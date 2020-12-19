import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { PaginateModel, Model  } from 'mongoose';
import { DateTime } from 'luxon';

import { RedisService } from 'src/database/redis.service';
import { TOrdenesToa, TRespuesta } from 'src/helpers/types';
import { cache_keys, variables } from 'src/config/variables';
import { CreateOrdeneDto } from './dto/create-ordene.dto';
import { UpdateOrdeneDto } from './dto/update-ordene.dto';
import { IOrden } from './interfaces/ordene.interface';
import { IEmpleado } from '../empleados/interfaces/empleados.interface';
import { estado_empresa, tipos_usuario } from 'src/constants/enum';

@Injectable()
export class OrdenesService {
  constructor (
    @InjectModel('Ordene') private readonly ordenModel: PaginateModel<IOrden>,
    @InjectModel('Empleado') private readonly empleadoModel: Model<IEmpleado>,
    private readonly redisService: RedisService,
    private httpService: HttpService
  ) {}
  //tarea que sirve para automatizar la descarga de dota del toa
  @Cron('0 */15 6-20 * * *')
  async obtenerOrdenesToa() {    
    return await this.httpService.get(`${variables.url_scrap}?user=${variables.user_scrap}&pass=${variables.pass_scrap}`).toPromise().then((res) => {
      console.log(res.data, ' - ', new Date());
    }).catch((err) => console.log(err));
  };
  //subir la data del excel convertido en json y guardarla en la base de datos
  async subirData(createOrdenesDto:CreateOrdeneDto[], usuario:string):Promise<TRespuesta> {
    const entrada = {
      usuario_entrada: usuario,
      observacion: 'Ordenes exportadas desde telefonica.',
      grupo_entrada: Date.now(),
    };

    const ordenes = createOrdenesDto.map((e) => {
      return ({...e, historial_registro:[entrada]})
    })

    return await this.ordenModel.insertMany(ordenes, { 
      ordered: false
    }).then((d) => {
      return ({
        status: 'success',
        message: `(${d.length}) Ordenes guardadas correctamente.`
      })
    }).catch((e) => {
      if (e.result.nInserted > 0 && (e.writeErrors).length === 0) {
        return ({
          status: 'success',
          message: `(${e.result.nInserted}) Ordenes guardadas correctamente.`
        });
      } else if (e.result.nInserted === 0 && (e.writeErrors).length > 0) {
        return ({
          status: 'warn',
          message: `(${(e.writeErrors).length}) Ordenes duplicadas y (0) Ordenes nuevas.`
        });
      } else if (e.result.nInserted > 0 && (e.writeErrors).length > 0) {
        return ({
          status: 'warn',
          message: `(${(e.writeErrors).length}) Ordenes duplicadas y (${e.result.nInserted}) Ordenes nuevas.`
        })
      } else {
        throw new HttpException({
          status: 'error',
          message: 'Error en el servidor.'
        }, HttpStatus.FORBIDDEN)
      };
    });
  };
  // funcion que guarda la data que envia el servidor de scraping
  async guardarDataToa(rutas:Array<any>, averias:Array<TOrdenesToa>, altas:Array<TOrdenesToa>, speedy:Array<TOrdenesToa>) {
    let strRrutas = JSON.stringify(rutas)
    let strAverias = JSON.stringify(averias);
    let strAltas = JSON.stringify(altas);
    let strSpeedy = JSON.stringify(speedy);

    return await this.redisService.set(cache_keys.RUTAS_TOA, strRrutas, 3600)
      .then(async () => await this.redisService.set(cache_keys.ORDENES_AVERIAS, strAverias, 3600))
      .then(async () => await this.redisService.set(cache_keys.ORDENES_ALTAS, strAltas, 3600))
      .then(async () => await this.redisService.set(cache_keys.ORDENES_SPEEDY, strSpeedy, 3600))
      .then(async () => await this.ordenModel.bulkWrite(
        [...averias,...altas].map((o) => ({
          updateOne: {
            filter: { codigo_requerimiento: o.requerimiento },
            update: { $set: o },
            upsert: true
          }
        }))
      ));
  };
  //funcion que recorre las ordenes del toa, actualiza el tecnico y actualiza la data que se subio del cms
  async cruzarOrdenes(cacheKey: string) {
    return await this.redisService.get(cacheKey).then(async(data) => {
      const ordenesJson:Array<TOrdenesToa> = JSON.parse(data);
      
      if (!ordenesJson || ordenesJson.length === 0) {
        throw new HttpException('No se encontró data(TOA) disponible para realizar el cruce.', HttpStatus.NOT_FOUND);
      } else {
        return await Promise.all(ordenesJson.map(async(o) => {
          if (o.tecnico) {
            return this.empleadoModel.findOne({carnet: o.tecnico}).then(async(emp) => {
              return await this.ordenModel.findOneAndUpdate({codigo_requerimiento: o.requerimiento}, {
                bucket: o.bucket,
                subtipo_actividad: o.subtipo_actividad,
                estado_toa: o.estado,
                fecha_cita: o.fecha_cita ? new Date(DateTime.fromFormat(String(o.fecha_cita).trim(), 'dd/MM/yy').toISO()): null,
                sla_inicio: o.sla_inicio ? new Date(DateTime.fromFormat(String(o.sla_inicio).trim(), 'dd/MM/yy hh:mm a').toISO()): null,
                sla_fin: o.sla_fin ? new Date(DateTime.fromFormat(String(o.sla_fin).trim(), 'dd/MM/yy hh:mm a').toISO()): null,
                tecnico: emp && emp._id,
                gestor: emp && emp.gestor,
                contrata: emp && emp.contrata
              });
            });
          } else {
            return await this.ordenModel.findOneAndUpdate({codigo_requerimiento: o.requerimiento}, {
              bucket: o.bucket,
              estado_toa: o.estado,
              sla_inicio: o.sla_inicio ? new Date(DateTime.fromFormat(String(o.sla_inicio).trim(), 'dd/MM/yy hh:mm a').toISO()): null,
              sla_fin: o.sla_fin ? new Date(DateTime.fromFormat(String(o.sla_fin).trim(), 'dd/MM/yy hh:mm a').toISO()): null
            });
          };
        }));  
      };
    });
  };
  //funcion que obtiene las ordenes del dia actual filtrandolo por la fecha de cita
  async obtenerOrdenesHoy(tipo: string) {
    let now = new Date();
    let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());    
    return await this.ordenModel.find({
      $and: [
        {$or: [
          {fecha_cita: { $gte: startOfToday }},
          {fecha_cita: null}
        ]},
        {tipo}
      ]
      
    })
      .populate('contrata', 'nombre')
      .populate('gestor', 'nombre apellidos')
      .select('codigo_requerimiento codigo_ctr codigo_nodo codigo_troba codigo_cliente distrito bucket estado_toa contrata gestor fecha_registro numero_reiterada')
      .sort('bucket estado_toa contrata');
  };
  // ------------->TEMPORAL<------------------
  //funcion para obtener la data del toa actualizada con los empleados
  async obtenerIndicadorToa(cacheKey: string) {
    const ordenes:Array<TOrdenesToa> = await this.redisService.get(cacheKey).then((data) => JSON.parse(data));
    let tecnicos:Array<IEmpleado> = await this.redisService.get(cache_keys.TECNICOS_GLOBAL).then((data) => JSON.parse(data));
    if (!tecnicos || tecnicos.length < 0) {
      this.empleadoModel.find({
        'usuario.cargo': tipos_usuario.TECNICO, 
        'estado_empresa': { $ne: estado_empresa.INACTIVO }
      }).populate({
        path: 'gestor',
        select: 'nombre apellidos'
      }).populate({
        path: 'auditor',
        select: 'nombre apellidos'
      }).populate({
        path: 'contrata',
        select: 'nombre'
      }).select('nombre apellidos gestor auditor contrata carnet').sort('contrata nombre').then(async(data) => {
        const string = JSON.stringify(data);
        return await this.redisService.set(cache_keys.TECNICOS_GLOBAL, string, variables.redis_ttl)
          .then(() => tecnicos = data);
      });
    }

    if (ordenes && ordenes.length > 0) {
      return Promise.all(ordenes.map(async(orden) => {
        if (orden.tecnico && orden.tecnico.length === 6) {
          const iTecnico = tecnicos.findIndex((e) => e.carnet === orden.tecnico);
          if (iTecnico !== -1) {
            return {
              ...orden,
              tecnico: tecnicos[iTecnico]
            };
          } else {
            return {
              ...orden,
              tecnico: '-'
            };
          }
        } else {
          return {
            ...orden,
            tecnico: '-'
          };
        } 
      }))
    } else {
      throw new HttpException('No se encontró data del toa', HttpStatus.NOT_FOUND);
    }
  };

  // create(createOrdeneDto: CreateOrdeneDto) {
  //   return 'This action adds a new ordene';
  // };

  // findOne(id: number) {
  //   return `This action returns a #${id} ordene`;
  // };

  // update(id: number, updateOrdeneDto: UpdateOrdeneDto) {
  //   return `This action updates a #${id} ordene`;
  // };

  // remove(id: number) {
  //   return `This action removes a #${id} ordene`;
  // };
}
