import { HttpException, HttpService, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { DateTime } from 'luxon';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { RedisService } from 'src/database/redis.service';
import { THistorial, TInfanciasExternas, TOrdenesToa, TRespuesta } from 'src/helpers/types';
import { cache_keys } from 'src/config/variables';
import { CreateOrdeneDto } from './dto/create-ordene.dto';
import { UpdateOrdeneDto } from './dto/update-ordene.dto';
import { IOrden } from './interfaces/ordene.interface';
import { estado_gestor, tipos_orden } from 'src/constants/enum';

import { OrdenesGateway } from './ordenes.gateway';
import { UpdateDataService } from '@localLibs/update-data'
import { bandejas, bandejasLiteyca } from 'src/constants/valoresOrdenes';

@Injectable()
export class OrdenesService {
  constructor (
    @InjectModel('Ordene') private readonly ordenModel: Model<IOrden>,
    private readonly redisService: RedisService,
    private readonly ordenesGateway: OrdenesGateway,
    private httpService: HttpService,
    private readonly updateDataService:UpdateDataService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}
  //tarea que sirve para automatizar la descarga de dota del toa
  // ajustar hora al servidor
  @Cron('0 */15 6-20 * * *', {
    name: 'obtenerOrdenes',
    timeZone: 'America/Lima',
  })
  async obtenerOrdenesToa() { 
    // return await this.httpService.get(`${variables.url_scrap}?user=${variables.user_scrap}&pass=${variables.pass_scrap}`).toPromise().then(async(res) => {
      // { status: success | error }
      // console.log(res.data, ' - ', new Date());
      setTimeout(async() => {
        await this.ordenesGateway.enviarOdenesToa()
      }, 120000);
    // }).catch((err) => console.log(err));
  };
  //capturar la data del excel, validar si es alta o averia
  //AVERIA---
  //buscar la orden en la base de datos
  //--SI EXISTE
  //---comprobar la bandeja:
  //---bandejas iguales = no hacer nada
  //---bandejas diferentes actualizar 
  //----SI EX PLANTA EXTERNA: codigo_ctr, descripcion_ctr, observacion, estado_gestor=pex, 
  //----SI NO ES: codigo_ctr, descripcion_ctr, observacion,
  //--SI NO EXISTE
  //---buscar infancia
  //---guardar orden
  //ALTAS---
  //---guardar orden
  async subirData(createOrdenesDto:CreateOrdeneDto[], usuario:string):Promise<{nuevos:number, duplicados:number, actualizados:number, errores?:number}> {
    let nuevos = 0;
    let duplicados = 0;
    let actualizados = 0;
    let errores = 0;
    return await Promise.all(createOrdenesDto.map(async(o) => {
      if (o.tipo === tipos_orden.AVERIAS) {
        const ordenBase:IOrden = await this.ordenModel.findOne({ codigo_requerimiento: o.codigo_requerimiento }).select('codigo_ctr')
        if (ordenBase) {
          if (Number(ordenBase.codigo_ctr) !== Number(o.codigo_ctr)) {
            if (o.codigo_ctr === bandejas.PEX) {
              const registro:THistorial = {
                observacion: 'Orden movida a planta externa.',
                usuario_entrada: usuario,
                fecha_entrada: new Date(),
                estado_orden: estado_gestor.PEXT,
                codigo_ctr: o.codigo_ctr
              };
              return await this.ordenModel.findOneAndUpdate({ codigo_requerimiento: o.codigo_requerimiento}, {
                $set: { estado_gestor: estado_gestor.PEXT,  codigo_ctr: o.codigo_ctr,  descripcion_ctr: o.descripcion_ctr },
                $push: { historial_registro: registro }
              }).then(() => actualizados = actualizados +1).catch((e) => {
                errores = errores +1;
                this.logger.error({ message: e, service: 'subirData(servicio - o.codigo_ctr === bandejas.PEX)' })
                return;
              })
            } else if (o.codigo_ctr === bandejas.CRITICOS) {
              const registro:THistorial = {
                observacion: 'Orden movida a la bandeja criticos.',
                usuario_entrada: usuario,
                fecha_entrada: new Date(),
                codigo_ctr: o.codigo_ctr
              };
              return await this.ordenModel.findOneAndUpdate({ codigo_requerimiento: o.codigo_requerimiento}, {
                $set: { codigo_ctr: o.codigo_ctr,  descripcion_ctr: o.descripcion_ctr },
                $push: { historial_registro: registro }
              }).then(() => actualizados = actualizados +1).catch((e) => {
                errores = errores +1;
                this.logger.error({ message: e, service: 'subirData(servicio - o.codigo_ctr === bandejas.CRITICOS)' })
                return;
              });
            } else if (o.codigo_ctr === bandejas.LITEYCA) {
              const registro:THistorial = {
                observacion: 'Orden regresada a la bandeja Liteyca.',
                usuario_entrada: usuario,
                fecha_entrada: new Date(),
                codigo_ctr: o.codigo_ctr
              };
              return await this.ordenModel.findOneAndUpdate({ codigo_requerimiento: o.codigo_requerimiento}, {
                $set: { codigo_ctr: o.codigo_ctr,  descripcion_ctr: o.descripcion_ctr },
                $push: { historial_registro: registro }
              }).then(() => actualizados = actualizados +1).catch((e) => {
                errores = errores +1;
                this.logger.error({ message: e, service: 'subirData(servicio - o.codigo_ctr === bandejas.LITEYCA)' })
                return;
              });
            } else {
              const registro:THistorial = {
                observacion: 'Orden movida a una bandeja externa.',
                usuario_entrada: usuario,
                fecha_entrada: new Date(),
                codigo_ctr: Number(o.codigo_ctr)
              };
              return await this.ordenModel.findOneAndUpdate({ codigo_requerimiento: o.codigo_requerimiento}, {
                $set: { codigo_ctr: o.codigo_ctr,  descripcion_ctr: o.descripcion_ctr },
                $push: { historial_registro: registro }
              }).then(() => actualizados = actualizados +1).catch((e) => {
                errores = errores +1;
                console.log(e);
                this.logger.error({ message: e, service: 'subirData(servicio - bandeja externa)' })
                return;
              });
            }
          } else {
            duplicados = duplicados + 1
            return;
          }
        } else {
          const dia = new Date().getDate();
          const fechaInicio = DateTime.fromJSDate(o.fecha_registro).set({day: dia-31});

          const infancia:IOrden = await this.ordenModel.findOne({
            $and: [
              { tipo: tipos_orden.ALTAS },
              { codigo_cliente: o.codigo_cliente },
              { fecha_liquidado: { $gte: new Date(fechaInicio.toISO()) } }
            ]
          }).select('_id');

          return await new this.ordenModel({
            ...o,
            infancia: infancia && infancia._id ? infancia._id : null,
            historial_registro: [{
              usuario_entrada: usuario,
              estado_orden: 'pendiente',
              observacion: 'Ordenes exportadas desde cms.',
              grupo_entrada: Date.now(),
              codigo_ctr: o.codigo_ctr
            }]
          }).save().then(() => nuevos = nuevos + 1).catch((e) => {
            errores = errores +1
            this.logger.error({ message: e, service: 'subirData(servicio - else)' })
            return;
          })
        };
      } else if (o.tipo === tipos_orden.ALTAS){
        return new this.ordenModel({
          ...o,
          historial_registro:[{
            usuario_entrada: usuario,
            estado_orden: 'pendiente',
            observacion: 'Ordenes exportadas desde cms.',
            grupo_entrada: Date.now(),
          }],
        }).save().then(() => nuevos = nuevos + 1).catch((e) => {
          errores = errores +1
          this.logger.error({ message: e, service: 'subirData(servicio - o.tipo === tipos_orden.ALTAS)' })
          return;
        });
      } else { return; }
    })).then(() => ({ nuevos, duplicados, actualizados, errores }));
  };
  //subir la data del excel convertido en json y guardarla en la base de datos-------------------------------------------------------------------
  async subirData2(createOrdenesDto:CreateOrdeneDto[], usuario:string):Promise<TRespuesta> {
    const registroOrdenes:THistorial = {
      usuario_entrada: usuario,
      estado_orden: 'pendiente',
      observacion: 'Ordenes exportadas desde cms.',
      grupo_entrada: Date.now(),
    };

    return await Promise.all(createOrdenesDto.map(async(o) => {
      if (o.tipo === tipos_orden.AVERIAS) {
        const dia = new Date().getDate();
        const fechaInicio = DateTime.fromJSDate(o.fecha_registro).set({day: dia-31});
        //buscar infancias
        const infancia = await this.ordenModel.findOne({ 
          $and: [
            { tipo: tipos_orden.ALTAS },
            { codigo_cliente: o.codigo_cliente },
            { fecha_liquidado: { $gte: new Date(fechaInicio.toISO()) } }
          ]
        })
        return new this.ordenModel({
          ...o,
          historial_registro:[registroOrdenes],
          infancia: infancia ? infancia._id : null
        })
      } else {
        return new this.ordenModel({
          ...o,
          historial_registro:[registroOrdenes],
        })
      };
    })).then(async(ordenes) => {
      return await this.ordenModel.insertMany(ordenes, { ordered: false }).then((d) => {      
        return ({
          status: 'success',
          message: `(${d.length}) Ordenes guardadas correctamente.`,
          data: { nInserted: d.length }
        })
      }).catch((e) => {        
        if (e.result && e.result.nInserted > 0 && (e.writeErrors).length === 0) {
          return ({
            status: 'success',
            message: `(${e.result.nInserted}) Ordenes guardadas correctamente.`,
            data: e.result
          });
        } else if (e.result && e.result.nInserted === 0 && (e.writeErrors).length > 0) {
          return ({
            status: 'warn',
            message: `(${(e.writeErrors).length}) Ordenes duplicadas y (0) Ordenes nuevas.`,
            data: e.result
          });
        } else if (e.result && e.result.nInserted > 0 && (e.writeErrors).length > 0) {
          return ({
            status: 'warn',
            message: `(${(e.writeErrors).length}) Ordenes duplicadas y (${e.result.nInserted}) Ordenes nuevas.`,
            data: e.result
          })
        } else { 
          console.log(e);         
          throw new HttpException({
            status: 'error',
            message: e
          }, HttpStatus.FORBIDDEN)
        }; 
      })
    });
  };
  //subir la data de infancias externas, buscar las ordenes de nuestra base de datos, recorrer esa data
  async subirInfanciasExternas(ordenesExternas:TInfanciasExternas[], usuario:string):Promise<TRespuesta> {
    const registroOrdenes:THistorial = {
      usuario_entrada: usuario,
      observacion: 'Orden con infancia externa.',
    };

    return await this.ordenModel.find({
      $and: [
        { fecha_liquidado: null } ,
        { tipo: tipos_orden.AVERIAS }
      ]
    }).select('codigo_cliente fecha_registro').then(async(data:IOrden[]) => {
      if (data) {
        return await Promise.all(ordenesExternas.map(async(o, i) => {
          const index = data.findIndex((e) => String(e.codigo_cliente).length > 3 && String(o.codigo_cliente).length > 3 && String(e.codigo_cliente) === String(o.codigo_cliente));   
                           
          if (index !== -1) {
            const fechaLiquidadoInfancia = DateTime.fromJSDate(new Date(o.fecha_liquidado));
            const diasDiferencia = DateTime.fromJSDate(new Date(data[index].fecha_registro)).diff(fechaLiquidadoInfancia, 'day').toObject().days;

            if (diasDiferencia <= 31) {
              return await this.ordenModel.findOneAndUpdate({ 
                _id: data[index]._id  
              }, {
                $set: { infancia_externa: o },
                $push: { historial_registro: registroOrdenes }
              }).then(() => true);
            } else {
              return false;
            }
          } else {
            return false;
          }
        })).then((res) => {
          let validados = res.filter((e) => e === true);
          return ({
            status: 'success',
            message: `(${validados.length}) Ordenes Actualizadas.`
          })
        })
      } else {
        return ({
          status: 'error',
          message: `No se encontraron ordenes.`
        })
      }
    });
  };
  //comprobar infancias 
  async comprobarInfancias() {
    let now = new Date();
    let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return await this.ordenModel.find({
      $and: [
        { $or: [
          {fecha_liquidado: { $gte: startOfToday }},
          {fecha_liquidado: null}
        ]},
        { tipo: tipos_orden.AVERIAS }
      ]
    }).select('fecha_registro codigo_cliente').then(async(ordenes:IOrden[]) => {
      return await Promise.all(ordenes.map(async (o) => {
        //obtener fecha_registro - 32 dias de garantia de la alta (la averia debe tener mas de 30 dias para pasar la garantia)
        const dia = new Date().getDate();
        const fechaInicio = DateTime.fromJSDate(o.fecha_registro).set({day: dia-31});
        return await this.ordenModel.findOne({ 
          $and: [
            { tipo: tipos_orden.ALTAS },
            { codigo_cliente: o.codigo_cliente },
            { fecha_liquidado: { $gte: new Date(fechaInicio.toISO()) } }
          ]
        }).then(async(newOrden: IOrden) => {
          if (newOrden) {
            return await this.ordenModel.findByIdAndUpdate(o._id, {
              $set: {
                infancia: newOrden._id
              }
            }).then(() => {
              return true
            })
          } else {
            return false;
          }
        });
      }));
    });
  };
  //subir la data de liquidadas
  //-BUSAR LA ORDEN FILTRANDO QUE NO HAYA SIDO LIQUIDADO AUN
  //--SI NO ESTA LIQUIDADA APARECERÁ
  //---Actualizar codigo_ctr, descripcion_ctr, estado_gestor
  async liquidarOrdenes(updateOrdeneDto:UpdateOrdeneDto[], usuario:string):Promise<{duplicados:number,  actualizados:number, errores:number}> {
    let duplicados = 0;
    let actualizados = 0;
    let errores = 0;
    return await Promise.all(updateOrdeneDto.map(async(ordenUpdate) => {
      const ordenBase:IOrden = await this.ordenModel.findOne({ 
        $and: [
          { codigo_requerimiento: ordenUpdate.codigo_requerimiento },
          { fecha_liquidado: null }
        ]
      });
      if (ordenBase) {
        if (Number(ordenBase.codigo_ctr) === Number(ordenUpdate.codigo_ctr)) {
          const registroOrdenes:THistorial = {
            usuario_entrada: usuario,
            estado_orden: estado_gestor.LIQUIDADO,
            empleado_modificado: ordenUpdate.tecnico_liquidado,
            observacion: 'Orden liquidada desde la data exportada de cms.',
            codigo_ctr: ordenUpdate.codigo_ctr
          };
          return await this.ordenModel.findOneAndUpdate({ 
            codigo_requerimiento: ordenUpdate.codigo_requerimiento
          }, {
            $set: {
              fecha_liquidado: ordenUpdate.fecha_liquidado,
              tecnico_liquidado: ordenUpdate.tecnico_liquidado,
              carnet_liquidado: ordenUpdate.carnet_liquidado,
              nombre_liquidado: ordenUpdate.nombre_liquidado,
              tipo_averia: ordenUpdate.tipo_averia,
              codigo_usuario_liquidado: ordenUpdate.codigo_usuario_liquidado,
              observacion_liquidado: ordenUpdate.observacion_liquidado,
              descripcion_codigo_liquidado: ordenUpdate.descripcion_codigo_liquidado,
              estado_liquidado: ordenUpdate.estado_liquidado,
              estado_gestor: estado_gestor.LIQUIDADO
            },
            $push: { historial_registro: registroOrdenes }
          }).then(() => actualizados = actualizados +1 ).catch((e) => {
            errores = errores +1
            this.logger.error({ message: e, service: 'liquidarOrdenes(servicio - misma bandeja)' })
            return;
          });
        } else {
          const registroOrdenes:THistorial = {
            usuario_entrada: usuario,
            estado_orden: estado_gestor.LIQUIDADO,
            empleado_modificado: ordenUpdate.tecnico_liquidado,
            observacion: 'Orden liquidadas en otra bandeja.',
            codigo_ctr: ordenUpdate.codigo_ctr
          };
          return await this.ordenModel.findOneAndUpdate({ 
            codigo_requerimiento: ordenUpdate.codigo_requerimiento
          }, {
            $set: {
              fecha_liquidado: ordenUpdate.fecha_liquidado,
              tecnico_liquidado: ordenUpdate.tecnico_liquidado,
              carnet_liquidado: ordenUpdate.carnet_liquidado,
              nombre_liquidado: ordenUpdate.nombre_liquidado,
              tipo_averia: ordenUpdate.tipo_averia,
              codigo_usuario_liquidado: ordenUpdate.codigo_usuario_liquidado,
              estado_liquidado: ordenUpdate.estado_liquidado,
              observacion_liquidado: ordenUpdate.observacion_liquidado,
              descripcion_codigo_liquidado: ordenUpdate.descripcion_codigo_liquidado,
              estado_gestor: estado_gestor.LIQUIDADO
            },
            $push: { historial_registro: registroOrdenes }
          }).then(() => actualizados = actualizados +1 ).catch((e) => {
            errores = errores +1
            this.logger.error({ message: e, service: 'liquidarOrdenes(servicio - bandeja diferente)' })
            return;
          });
        }
      } else {
        duplicados = duplicados + 1;
        return;
      }
    })).then(() => ({ duplicados,  actualizados, errores }));
  };
  //subir la data del excel de liquidadas y actualizar las ordenes
  async liquidarOrdenes2(updateOrdeneDto:UpdateOrdeneDto[], usuario:string) {
    const registroOrdenes:THistorial = {
      usuario_entrada: usuario,
      estado_orden: estado_gestor.LIQUIDADO,
      observacion: 'Ordenes liquidadas desde la data exportada de cms.'
    };
    return Promise.all(updateOrdeneDto.map(async(newOrden) => {
      return await this.ordenModel.findOneAndUpdate({ 
        codigo_requerimiento: newOrden.codigo_requerimiento
      }, {
        $set: {
          fecha_liquidado: newOrden.fecha_liquidado,
          tecnico_liquidado: newOrden.tecnico_liquidado,
          tipo_averia: newOrden.tipo_averia,
          codigo_usuario_liquidado: newOrden.codigo_usuario_liquidado,
          estado_liquidado: newOrden.estado_liquidado,
          estado_gestor: estado_gestor.LIQUIDADO
        },
        $push: {
          historial_registro: {
            ...registroOrdenes,
            empleado_modificado: newOrden.tecnico_liquidado
          }
        }
      }, { new: true }).then((d) => d ? true: false);
    }))
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
          if (o.tecnico && String(o.tecnico).length > 1) {            
            return await this.ordenModel.findOneAndUpdate({codigo_requerimiento: o.requerimiento}, {
              tipo: o.tipo,
              fecha_cancelado: o.fecha_cancelado ? new Date(DateTime.fromFormat(String(o.fecha_cancelado).trim(), 'dd/MM/yy hh:mm a').toISO()): null,
              observacion_toa: o.observacion_toa,
              tecnico: o.tecnico && typeof o.tecnico !== 'string' ? o.tecnico._id : null,
              gestor: o.gestor && typeof o.gestor !== 'string' ? o.gestor._id : null,
              gestor_liquidado_toa: o.gestor_liquidado_toa && typeof o.gestor_liquidado_toa !== 'string' ? o.gestor_liquidado_toa._id : null,
              auditor: o.auditor && typeof o.auditor !== 'string' ? o.auditor._id : null,
              contrata: o.contrata && typeof o.contrata !== 'string' ? o.contrata._id : null,
              estado_toa: o.estado,
              estado_indicador_toa: o.estado_indicador_toa,
              bucket: o.bucket,
              subtipo_actividad: o.subtipo_actividad,
              fecha_cita: o.fecha_cita ? new Date(String(o.fecha_cita).trim()): null,
              tipo_agenda: o.tipo_agenda,
              motivo_no_realizado: o.motivo_no_realizado,
              sla_inicio: o.sla_inicio ? new Date(String(o.sla_inicio).trim()): null,
              sla_fin: o.sla_fin ? new Date(String(o.sla_fin).trim()): null,
            });
          } 
        }));  
      };
    });
  };
  //funcion que obtiene las ordenes del dia actual filtrandolo por la fecha de LIQUIDACION 
  async obtenerOrdenesPendientes(tipo: string) {
    return await this.ordenModel.find({
      $and: [
        { fecha_liquidado: null },
        { codigo_ctr: { $in: bandejasLiteyca } },
        { tipo },
      ]
    }).populate('contrata', 'nombre')
      .populate('gestor', 'nombre apellidos')
      .populate('tecnico', 'nombre apellidos carnet')
      .select({
        direccion: 1,
        nombre_cliente: 1,
        codigo_requerimiento: 1,
        codigo_ctr: 1,
        codigo_nodo: 1,
        codigo_troba: 1,
        codigo_motivo: 1,
        codigo_trabajo: 1,
        codigo_peticion: 1,
        codigo_cliente: 1,
        distrito: 1,
        bucket: 1,
        tipo_requerimiento: 1,
        tipo_tecnologia: 1,
        estado_toa: 1,
        estado_gestor: 1,
        estado_liquidado: 1,
        contrata: 1,
        gestor: 1,
        tecnico: 1,
        fecha_cita: 1,
        fecha_asignado: 1,
        fecha_registro: 1,
        infancia: 1,
        infancia_externa: 1,
        numero_reiterada: 1,
        orden_devuelta: 1,
        observacion_gestor: 1
      }).sort('bucket estado_toa contrata');
  };
  async obtenerOrdenesLiquidadas(tipo: string) {
    let now = new Date();
    let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return await this.ordenModel.find({ 
      $and: [
        { fecha_liquidado: { $gte: startOfToday } } ,
        { codigo_ctr: { $in: bandejasLiteyca } },
        { tipo }
      ]
    }).populate('contrata', 'nombre')
      .populate('gestor', 'nombre apellidos')
      .populate('tecnico', 'nombre apellidos carnet')
      .select({
        codigo_requerimiento: 1,
        codigo_ctr: 1,
        codigo_nodo: 1,
        codigo_troba: 1,
        codigo_cliente: 1,
        distrito: 1,
        tipo_tecnologia: 1,
        estado_toa: 1,
        estado_gestor: 1,
        estado_liquidado: 1,
        contrata: 1,
        gestor: 1,
        tecnico_liquidado: 1,
        codigo_usuario_liquidado: 1,
        tipo_averia: 1,
        descripcion_codigo_liquidado: 1,
        fecha_asignado: 1,
        fecha_registro: 1,
        fecha_liquidado: 1,
        observacion_gestor: 1,
        observacion_liquidado: 1
      }).sort('bucket estado_toa contrata');
  };
  async obtenerOrdenesOtrasBandejas(tipo: string) {
    let now = new Date();
    let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return await this.ordenModel.find({ 
      $and: [
        { $or: [
          {fecha_liquidado: { $gte: startOfToday }},
          {fecha_liquidado: null}
        ]},
        { codigo_ctr: { $nin: bandejasLiteyca } },
        { tipo },
      ]
    }).select({
        codigo_requerimiento: 1,
        codigo_ctr: 1,
        descripcion_ctr: 1,
        codigo_nodo: 1,
        codigo_troba: 1,
        codigo_cliente: 1,
        distrito: 1,
        tipo_tecnologia: 1,
        estado_toa: 1,
        estado_gestor: 1,
        estado_liquidado: 1,
        tecnico_liquidado: 1,
        codigo_usuario_liquidado: 1,
        tipo_averia: 1,
        descripcion_codigo_liquidado: 1,
        fecha_asignado: 1,
        fecha_registro: 1,
        fecha_liquidado: 1,
        observacion_gestor: 1,
        observacion_liquidado: 1
    }).sort('bucket estado_toa');
  };
  async obtenerOrdenesAnuladas(tipo: string) {
    let now = new Date();
    let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return await this.ordenModel.find({ 
      $and: [
        { $or: [
          {fecha_liquidado: { $gte: startOfToday }},
          {fecha_liquidado: null}
        ]},
        { estado_gestor: estado_gestor.ANULADO },
        { tipo },
      ]
    }).populate('tecnico_liquidado', '-usuario').select({
        codigo_requerimiento: 1,
        codigo_ctr: 1,
        descripcion_ctr: 1,
        codigo_nodo: 1,
        codigo_troba: 1,
        codigo_cliente: 1,
        distrito: 1,
        tipo_tecnologia: 1,
        estado_toa: 1,
        estado_gestor: 1,
        estado_liquidado: 1,
        tecnico_liquidado: 1,
        codigo_usuario_liquidado: 1,
        tipo_averia: 1,
        descripcion_codigo_liquidado: 1,
        fecha_asignado: 1,
        fecha_registro: 1,
        fecha_liquidado: 1,
        observacion_gestor: 1,
        observacion_liquidado: 1
    }).sort('bucket estado_toa');
  };
  //funcion que obtiene las ordenes del dia actual POR GESTOR
  async obtenerOrdenesHoyGestor(gestor: string) {
    let now = new Date();
    let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());  
    
    return await this.ordenModel.find({
      $and: [
        { $or: [
          {fecha_liquidado: { $gte: startOfToday }},
          {fecha_liquidado: null}
        ]},
        { $or: [
          { gestor },
          { gestor: null }
        ]},
      ]
    }).populate('contrata', 'nombre')
      .populate('tecnico', 'nombre apellidos carnet')
      .populate('gestor', 'nombre apellidos carnet')
      .populate('auditor', 'nombre apellidos carnet')
      .populate({
        path: 'infancia', 
        select: 'codigo_requerimiento tecnico_liquidado estado_gestor fecha_registro fecha_liquidado',
        populate: {
          path: 'tecnico_liquidado',
          select: 'nombre apellidos carnet gestor',
          populate: {
            path: 'gestor',
            select: 'nombre apellidos carnet'
          }
        }
      })
      .select({
        tipo: 1,
        codigo_requerimiento: 1,
        codigo_cliente: 1,
        codigo_trabajo: 1,
        codigo_peticion: 1,
        direccion: 1,
        nombre_cliente: 1,
        tipo_requerimiento: 1,
        tipo_tecnologia: 1,
        codigo_ctr: 1,
        codigo_nodo: 1,
        codigo_troba: 1,
        numero_reiterada: 1,
        infancia: 1,
        distrito: 1,
        bucket: 1,
        estado_toa: 1,
        estado_gestor: 1,
        contrata: 1,
        gestor: 1,
        auditor: 1,
        tecnico: 1,
        fecha_cita: 1,
        fecha_registro: 1,
        fecha_asignado: 1,
        fecha_liquidado: 1,
        orden_devuelta: 1,
        observacion_toa: 1
      }).sort('bucket estado_toa');
  };
  //FUNCION PARA OBTENER LAS ORDENES REITERADAS
  async obtenerReiteradas(codigo_cliente: string):Promise<IOrden[]> {
    return await this.ordenModel.find({
      $and: [
        { codigo_cliente },
        { fecha_liquidado: { $ne: null } }
      ]
    }).populate({
      path: 'tecnico_liquidado', 
      select: 'nombre apellidos contrata gestor auditor',
      populate: [
        {
          path: 'contrata',
          select: 'nombre'
        },
        {
          path: 'gestor',
          select: 'nombre apellidos'
        },
        {
          path: 'auditor',
          select: 'nombre apellidos'
        }
      ]
    })
  };
  //funcion para obtener la orden de infancia
  async obtenerInfancia(id_orden: string):Promise<IOrden|any> {
    return await this.ordenModel.findOne({_id: id_orden}).populate({
        path: 'tecnico_liquidado',
        select: 'nombre apellidos carnet gestor',
        populate: {
          path: 'gestor',
          select: 'nombre apellidos carnet'
        }
      }).then((data) => {
        if (data) {
          return data;
        } else {
          return {}
        }
      })
  };
  //funcion para obtener el historial de registros
  async obtenerRegistros(id_orden: string): Promise<THistorial[]> {
    return await this.ordenModel.findOne({ _id: id_orden })
      .select('historial_registro')
      .populate('historial_registro.usuario_entrada', 'nombre apellidos cargo')
      .populate({
        path: 'historial_registro.empleado_modificado', 
        select: 'nombre apellidos usuario.cargo',
      })
      .populate('historial_registro.contrata_modificado', 'nombre')
      .then((data: IOrden) => {
        if (data) {
          return data.historial_registro;
        } else {
          return []
        }
      })
  };
  //funcion para obtener las pendientes seleccionas
  async obtenerPendientesExportar(todo:string, tipo:string, ids:string[]) {
    let now = new Date();
    let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());  

    let objQuery:any;
    
    if (todo === 'true') {
      objQuery = {
        $and: [
          { $or: [
            {fecha_liquidado: { $gte: startOfToday }},
            {fecha_liquidado: null}
          ]},
          { tipo }
        ]
      }
    } else {      
      if (!ids || ids.length < 0 ) {
        throw new HttpException({
          status: 'error',
          message: "No se encontraron ordenes."
        }, HttpStatus.FORBIDDEN)
      }
      objQuery = { _id: { $in: ids } }
    }
    return await this.ordenModel.find(objQuery).select({
      codigo_requerimiento: 1,
      codigo_cliente: 1,
      codigo_trabajo: 1,
      codigo_peticion: 1,
      tipo_requerimiento: 1,
      tipo_tecnologia: 1,
      codigo_ctr: 1,
      codigo_nodo: 1,
      codigo_troba: 1,
      numero_reiterada: 1,
      infancia: 1,
      infancia_externa: 1,
      distrito: 1,
      bucket: 1,
      estado_toa: 1,
      estado_gestor: 1,
      contrata: 1,
      gestor: 1,
      auditor: 1,
      tecnico: 1,
      fecha_cita: 1,
      fecha_registro: 1,
      fecha_asignado: 1,
      fecha_liquidado: 1,
      orden_devuelta: 1,
      observacion_toa: 1
    }).populate({
      path: 'infancia',
      select: 'codigo_requerimiento tecnico_liquidado fecha_registro fecha_liquidado',
      populate: {
        path: 'tecnico_liquidado',
        select: 'nombre apellidos carnet gestor',
        populate: {
          path: 'gestor',
          select: 'nombre apellidos'
        }
      }
    }).populate('contrata', 'nombre')
      .populate('gestor', 'nombre apellidos carnet')
      .populate('auditor', 'nombre apellidos carnet')
      .populate('tecnico', 'nombre apellidos carnet')
  };
  //funcion para agendar una orden
  async agendarOrden(ordenes:string[], id:string, bucket?:string, contrata?:string, gestor?:string, tecnico?:string, fecha_cita?:string, observacion?: string) {
    let objUpdate = {};

    let registroOrdenes:THistorial = {
      observacion: observacion ? observacion : 'Orden agendada (bucket, contrata, gestor, fecha de cita)',
      usuario_entrada: id,
      contrata_modificado: contrata,
      empleado_modificado: tecnico ? tecnico : gestor,
      estado_orden: "Agendado"
    }

    if(bucket) objUpdate['bucket'] = bucket;
    if(contrata) objUpdate['contrata'] = contrata;
    if(gestor) objUpdate['gestor'] = gestor;
    if(tecnico) objUpdate['tecnico'] = tecnico;
    if(fecha_cita) objUpdate['fecha_cita'] = new Date(fecha_cita).toUTCString();

    return await this.ordenModel.updateMany({ 
      $and: [
        { _id: { $in: ordenes } },
        { estado_toa: '-' }
      ]
    }, {
      $set: { ...objUpdate, estado_gestor: estado_gestor.AGENDADO },
      $push: { historial_registro: registroOrdenes }
    })
  };
  //funcion para asignar personal a una orden
  async asignarOrden(ordenes:string[], id:string, contrata?:string, gestor?:string, auditor?:string, tecnico?:string, observacion?: string) {
    let objUpdate = {};

    let registroOrdenes:THistorial = {
      observacion: observacion ? observacion : 'Orden asignada.',
      usuario_entrada: id,
      contrata_modificado: contrata,
      empleado_modificado: tecnico ? tecnico: gestor,
      estado_orden: "Asignado"
    }

    if(tecnico) {
      objUpdate['contrata'] = contrata;
      objUpdate['gestor'] = gestor;
      objUpdate['auditor'] = auditor;
      objUpdate['tecnico'] = tecnico;
      objUpdate['estado_gestor'] = estado_gestor.ASIGNADO;
    } else {
      objUpdate['gestor'] = gestor;
    };

    return await this.ordenModel.updateMany({ 
      $and: [
        { _id: { $in: ordenes } },
        { estado_toa: '-' },
      ]
    }, {
      $set: { ...objUpdate },
      $push: { historial_registro: registroOrdenes },
    })
  };
  //funcion para cambiar el estado de la orden, agregar una observacion y subir imagenes si las haya
  async actualizarEstadoOrden(usuario:string, ordenes:string[], observacion:string, estado?:string, files?:Array<any>) {
    return await this.updateDataService.subirImagenes(files, 'Ordenes').then(async(images) => {
      let objUpd:any = {};

      let registro: THistorial = {
        usuario_entrada: usuario,
        observacion,
        estado_orden: estado ? estado :'-',
      };
      if (images && images.length > 0) {
        registro.imagenes = images.map((img) => ({
          public_id: img.public_id,
          url: img.secure_url
        }));
      };
      if (estado) objUpd.estado_gestor = estado;
      return await this.ordenModel.updateMany({ 
        _id: { $in: ordenes }
      }, {
        $set: objUpd,
        $push: { historial_registro: registro }
      })
    });
  };
  //funcion para devolver la orden
  async devolverOrden(usuario:string, orden:string, observacion:string, files?:Array<any>) {
    return await this.updateDataService.subirImagenes(files, 'Ordenes').then(async(images) => {

      let registro: THistorial = {
        usuario_entrada: usuario,
        observacion: observacion + ' (orden devuelta)',
        estado_orden: 'devuelta',
      };
      if (images && images.length > 0) {
        registro.imagenes = images.map((img) => ({
          public_id: img.public_id,
          url: img.secure_url
        }));
      };
      return await this.ordenModel.findOneAndUpdate({ _id: orden }, {
        $set: {
          orden_devuelta: true,
          estado_liquidado: '-'
        },
        $push: { historial_registro: registro }
      })
    })
  };
};
