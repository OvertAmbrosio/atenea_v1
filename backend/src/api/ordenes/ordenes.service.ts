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
import { estado_empresa, tipos_orden, tipos_usuario } from 'src/constants/enum';

import { OrdenesGateway } from './ordenes.gateway';
import { UpdateDataService } from '@localLibs/update-data'

const estadosToa = ['pendiente','iniciado'];

@Injectable()
export class OrdenesService {
  constructor (
    @InjectModel('Ordene') private readonly ordenModel: PaginateModel<IOrden>,
    @InjectModel('Empleado') private readonly empleadoModel: Model<IEmpleado>,
    private readonly redisService: RedisService,
    private readonly ordenesGateway: OrdenesGateway,
    private httpService: HttpService,
    private readonly updateDataService:UpdateDataService
  ) {}
  //tarea que sirve para automatizar la descarga de dota del toa
  @Cron('0 */5 6-20 * * *')
  async obtenerOrdenesToa() { 
    return await this.httpService.get(`${variables.url_scrap}?user=${variables.user_scrap}&pass=${variables.pass_scrap}`).toPromise().then(async(res) => {
      // { status: success | error }
      console.log(res.data, ' - ', new Date());
      // setTimeout(async() => {
        await this.ordenesGateway.enviarOdenesToa()
      // }, timeout);
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
    await this.redisService.set(cache_keys.RUTAS_TOA, strRrutas, 3600);

    await this.updateDataService.actualizarTecnicosToa(averias, tipos_orden.AVERIAS)
      .then((data) => JSON.stringify(data))
      .then(async(strData) => await this.redisService.set(cache_keys.ORDENES_AVERIAS, strData, 3600));

    await this.updateDataService.actualizarTecnicosToa(altas, tipos_orden.ALTAS)
      .then((data) => JSON.stringify(data))
      .then(async(strData) => await this.redisService.set(cache_keys.ORDENES_ALTAS, strData, 3600));

    await this.updateDataService.actualizarTecnicosToa(speedy, tipos_orden.SPEEDY)
      .then((data) => JSON.stringify(data))
      .then(async(strData) => await this.redisService.set(cache_keys.ORDENES_SPEEDY, strData, 3600));
    
    return;
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
            return await this.ordenModel.findOneAndUpdate({codigo_requerimiento: o.requerimiento}, {
              tipo: tipos_orden.AVERIAS,
              fecha_cancelado: o.fecha_cancelado ? new Date(DateTime.fromFormat(String(o.fecha_cancelado).trim(), 'dd/MM/yy hh:mm a').toISO()): null,
              observacion_toa: o.observacion_toa,
              tecnico: o.tecnico && typeof o.tecnico !== 'string' ? o.tecnico._id : null,
              gestor: o.gestor && typeof o.gestor !== 'string' ? o.gestor._id : null,
              auditor: o.auditor && typeof o.auditor !== 'string' ? o.auditor._id : null,
              contrata: o.contrata && typeof o.contrata !== 'string' ? o.contrata._id : null,
              estado_toa: o.estado,
              bucket: o.bucket,
              subtipo_actividad: o.subtipo_actividad,
              fecha_cita: o.fecha_cita ? new Date(String(o.fecha_cita).trim()): null,
              tipo_agenda: o.tipo_agenda,
              motivo_no_realizado: o.motivo_no_realizado,
              sla_inicio: o.sla_inicio ? new Date(String(o.sla_inicio).trim()): null,
              sla_fin: o.sla_fin ? new Date(String(o.sla_fin).trim()): null,
            });
          } else {
            return await this.ordenModel.findOneAndUpdate({codigo_requerimiento: o.requerimiento}, {
              tipo: tipos_orden.AVERIAS,
              fecha_cancelado: o.fecha_cancelado ? new Date(DateTime.fromFormat(String(o.fecha_cancelado).trim(), 'dd/MM/yy hh:mm a').toISO()): null,
              observacion_toa: o.observacion_toa,
              estado_toa: o.estado,
              bucket: o.bucket,
              subtipo_actividad: o.subtipo_actividad,
              fecha_cita: o.fecha_cita ? new Date(DateTime.fromFormat(String(o.fecha_cita).trim(), 'dd/MM/yy').toISO()): null,
              tipo_agenda: o.tipo_agenda,
              motivo_no_realizado: o.motivo_no_realizado,
              sla_inicio: o.sla_inicio ? new Date(DateTime.fromFormat(String(o.sla_inicio).trim(), 'dd/MM/yy hh:mm a').toISO()): null,
              sla_fin: o.sla_fin ? new Date(DateTime.fromFormat(String(o.sla_fin).trim(), 'dd/MM/yy hh:mm a').toISO()): null,
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
};
