import { HttpException, HttpService, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { DateTime } from 'luxon';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { RedisService } from 'src/database/redis.service';
import { THistorial, TOrdenesToa } from 'src/helpers/types';
import { cache_keys } from 'src/config/variables';
import { CreateOrdeneDto } from './dto/create-ordene.dto';
import { UpdateOrdeneDto } from './dto/update-ordene.dto';
import { IOrden } from './interfaces/ordene.interface';
import { estado_gestor, tipos_orden } from 'src/constants/enum';

import { OrdenesGateway } from './ordenes.gateway';
import { UpdateDataService } from '@localLibs/update-data'
import { bandejas, bandejasLiteyca, nodosLima, nodosLiteyca, tiposLiquidacion } from 'src/constants/valoresOrdenes';
import { estados_toa } from 'src/constants/valoresToa';

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

  // @Cron('30 47 * * * *', {
  //   name: 'modificarOrdenes',
  //   timeZone: 'America/Lima',
  // })
  // async modificarOrdenes() {
  //   await this.ordenModel.updateMany({ "historial_registro.grupo_entrada": 1616417388734 }, {
  //     $set: { tipo: tipos_orden.ALTAS }
  //   }).then((e) => console.log(e));
  // }

  cambiarBandeja(antiguoCtr:number, nuevoCtr:number):{observacion:string, estado:string, service:string} {
    if (Number(nuevoCtr) === Number(bandejas.PEX)) {
      return ({ 
        observacion: 'Orden movida a planta externa.', 
        estado: estado_gestor.PEXT, 
        service: "subirData(servicio - o.codigo_ctr === bandejas.PEX)"
      })
    } else if (Number(nuevoCtr) === Number(bandejas.LITEYCA)) {
      return ({ 
        observacion: `Orden retorna a la bandeja Liteyca (${antiguoCtr} > ${nuevoCtr}).`, 
        estado: estado_gestor.PENDIENTE, 
        service: 'subirData(servicio - o.codigo_ctr === bandejas.LITEYCA)'
      })
    } else if (Number(nuevoCtr) === Number(bandejas.CRITICOS)) {
      return ({ 
        observacion: 'Orden movida a la bandeja criticos.', 
        estado: null, 
        service: 'subirData(servicio - o.codigo_ctr === bandejas.CRITICOS)'
      })
    } else {
      return ({ 
        observacion: `Orden movida a una bandeja externa (${antiguoCtr} > ${nuevoCtr}).`,
        estado: null, 
        service: 'subirData(servicio - bandeja externa)'
      })
    }
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
    const grupo_entrada = Date.now();
    return await Promise.all(createOrdenesDto.map(async(o) => {
      const ordenBase:IOrden = await this.ordenModel.findOne({ codigo_requerimiento: String(o.codigo_requerimiento) })
        .select('codigo_ctr estado_gestor codigo_nodo')
      if (o.tipo === tipos_orden.AVERIAS) {
        if (ordenBase) {
          if (Number(ordenBase.codigo_ctr) !== Number(o.codigo_ctr)) {
            let cambioResponse = this.cambiarBandeja(ordenBase.codigo_ctr, o.codigo_ctr );
            const historial_registro:THistorial = {
              observacion: cambioResponse.observacion,
              usuario_entrada: usuario,
              fecha_entrada: new Date(),
              codigo_ctr: o.codigo_ctr
            };

            let objUpdate:any = {
              codigo_ctr: o.codigo_ctr,
              descripcion_ctr: o.descripcion_ctr,
              fecha_liquidado: null,
            }

            if (cambioResponse.estado) {
              historial_registro.estado_orden = cambioResponse.estado;
              objUpdate['estado_gestor'] = cambioResponse.estado;
            }
            if (ordenBase.codigo_nodo !== o.codigo_nodo) objUpdate['codigo_nodo'] = o.codigo_nodo;
            if (ordenBase.fecha_asignado !== o.fecha_asignado) objUpdate['fecha_asignado'] = o.fecha_asignado;

            return await this.ordenModel.findOneAndUpdate({ _id: ordenBase._id}, {  $set: objUpdate, $push: { historial_registro }
            }).then(() => actualizados = actualizados +1).catch((e:any) => {
              errores = errores +1;
              this.logger.error({ message: e, service: cambioResponse.service })
              return;
            })
          } else if ( ordenBase.estado_gestor === estado_gestor.LIQUIDADO || ordenBase.estado_gestor === estado_gestor.ANULADO ) { 
            const historial_registro:THistorial = {
              observacion: `Orden reinyectada.(${ordenBase.estado_gestor}>${estado_gestor.PENDIENTE})`,
              usuario_entrada: usuario,
              fecha_entrada: new Date(),
              estado_orden: ordenBase.estado_gestor
            };
            let objUpdate:any = {
              estado_gestor: estado_gestor.PENDIENTE
            }
            if (ordenBase.fecha_asignado !== o.fecha_asignado) objUpdate['fecha_asignado'] = o.fecha_asignado;

            return await this.ordenModel.findOneAndUpdate({ _id: ordenBase._id}, {  $set: objUpdate, $push: { historial_registro }
            }).then(() =>  actualizados = actualizados + 1).catch((e:any) => {
              errores = errores +1;
              this.logger.error({ message: e, service: "esatdos liquidados" })
              return;
            })
           
          } else { duplicados = duplicados + 1}
        } else {
          const fechaInicio = DateTime.fromJSDate(new Date(o.fecha_registro)).plus({month: -1});
          const fechaBusqueda = new Date(Date.UTC(fechaInicio.get('year'), fechaInicio.get('month')-1, fechaInicio.get('day'), 0, 0, 0));
          
          const infancia:IOrden = await this.ordenModel.findOne({
            $and: [
              { tipo: tipos_orden.ALTAS },
              { codigo_cliente: o.codigo_cliente },
              { fecha_liquidado: { $gte: fechaBusqueda } },
              { estado_gestor: estado_gestor.LIQUIDADO }
            ]
          }).select('_id');

          return await new this.ordenModel({
            ...o,
            infancia: infancia && infancia._id ? infancia._id : null,
            historial_registro: [{
              usuario_entrada: usuario,
              estado_orden: estado_gestor.PENDIENTE,
              observacion: 'Ordenes exportadas desde cms.',
              grupo_entrada,
              codigo_ctr: o.codigo_ctr
            }]
          }).save().then((e) => {
            if (bandejasLiteyca.includes(e.codigo_ctr)) nuevos = nuevos + 1
          }).catch((e) => {
            errores = errores +1
            this.logger.error({ message: e, service: 'subirData(servicio - else)' })
            return;
          })
        };
      } else if (o.tipo === tipos_orden.ALTAS){
        if (ordenBase) {
          let objUpdate = {
            fecha_liquidado: null
          };

          if (o.codigo_trabajo && String(o.codigo_trabajo).length > 1) objUpdate['codigo_trabajo'] = o.codigo_trabajo;
          if (o.codigo_peticion && String(o.codigo_peticion).length > 1) objUpdate['codigo_peticion'] = o.codigo_peticion;
          if (o.indicador_pai) {
            if (String(o.indicador_pai).toLowerCase() === 'pendiente') {
              objUpdate['indicador_pai'] = 1;
            } else {
              objUpdate['indicador_pai'] = o.indicador_pai;
            }
          }
          if (o.codigo_ctr && o.codigo_ctr !== ordenBase.codigo_ctr) objUpdate['codigo_ctr'] = o.codigo_ctr;
          if (o.codigo_nodo && o.codigo_nodo !== ordenBase.codigo_nodo) objUpdate['codigo_nodo'] = o.codigo_nodo;
          if (o.tipo_tecnologia) objUpdate['tipo_tecnologia'] = o.tipo_tecnologia;

          await this.ordenModel.findByIdAndUpdate({ _id: ordenBase._id }, { $set: objUpdate });
          duplicados = duplicados +1;
          return;
        } else {
          return new this.ordenModel({
            ...o,
            historial_registro:[{
              usuario_entrada: usuario,
              estado_orden: estado_gestor.PENDIENTE,
              observacion: 'Ordenes exportadas desde cms.',
              grupo_entrada,
            }],
          }).save().then((e) => {
            if ( bandejasLiteyca.includes(e.codigo_ctr)) {
              nuevos = nuevos + 1
            }
          }).catch((e) => {
            errores = errores + 1
            this.logger.error({ message: e, service: 'subirData(servicio - o.tipo === tipos_orden.ALTAS)' })
            return;
          });
        };
      } else { return; }
    })).then(() => ({ nuevos, duplicados, actualizados, errores }));
  };
  //comprobar infancias 
  async comprobarInfancias() {
    return await this.ordenModel.find({
      $and: [
        { $or: [
          { estado_gestor: { $ne: estado_gestor.LIQUIDADO } },
          { fecha_liquidado: null },
        ] },
        { estado_gestor: { $ne: estado_gestor.ANULADO } },
        { codigo_nodo: { $in: nodosLima } },
        { codigo_ctr: { $in: bandejasLiteyca } },
        { tipo: tipos_orden.AVERIAS },
      ]
    }).select('fecha_registro codigo_cliente').then(async(ordenes:IOrden[]) => {
      return await Promise.all(ordenes.map(async (o) => {
        //obtener fecha_registro - 31 dias de garantia de la alta (la averia debe tener menos de 30 dias para pasar la garantia)
        const fechaInicio = DateTime.fromJSDate(new Date(o.fecha_registro)).plus({month: -1});
        const fechaBusqueda = new Date(Date.UTC(fechaInicio.get('year'), fechaInicio.get('month')-1, fechaInicio.get('day'), 0, 0, 0, 0));
        
        return await this.ordenModel.findOne({ 
          $and: [
            { tipo: tipos_orden.ALTAS },
            { codigo_nodo: { $in: nodosLima } },
            { codigo_cliente: o.codigo_cliente },
            { fecha_liquidado: { $gte: fechaBusqueda } },
            { estado_gestor: estado_gestor.LIQUIDADO }
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
      const ordenBase:IOrden = await this.ordenModel.findOne({ codigo_requerimiento: String(ordenUpdate.codigo_requerimiento) });

      let estadoXTipoLiquidacion = String(ordenUpdate.tipo_liquidacion).toUpperCase() === tiposLiquidacion.ANULADA ? estado_gestor.ANULADO : estado_gestor.LIQUIDADO
      let objUpdate = {};

      if (ordenBase && !ordenBase.fecha_liquidado && ordenUpdate.fecha_liquidado) {
        if (Number(ordenBase.codigo_ctr) === Number(ordenUpdate.codigo_ctr)) {
          const registroOrdenes:THistorial = {
            usuario_entrada: usuario,
            estado_orden: estadoXTipoLiquidacion,
            empleado_modificado: ordenUpdate.tecnico_liquidado,
            observacion: ordenUpdate.observacion_liquidado ? ordenUpdate.observacion_liquidado : 'Orden liquidada desde la data exportada de cms.',
            codigo_ctr: ordenUpdate.codigo_ctr
          };
          objUpdate = {
            fecha_liquidado: ordenUpdate.fecha_liquidado,
            tecnico_liquidado: ordenUpdate.tecnico_liquidado,
            carnet_liquidado: ordenUpdate.carnet_liquidado,
            nombre_liquidado: ordenUpdate.nombre_liquidado,
            tipo_averia: ordenUpdate.tipo_averia,
            codigo_usuario_liquidado: ordenUpdate.codigo_usuario_liquidado,
            observacion_liquidado: ordenUpdate.observacion_liquidado,
            descripcion_codigo_liquidado: ordenUpdate.descripcion_codigo_liquidado,
            estado_liquidado: ordenUpdate.estado_liquidado,
            estado_gestor: estadoXTipoLiquidacion
          };
          if (ordenUpdate.codigo_ctr) objUpdate['codigo_ctr'] = ordenUpdate.codigo_ctr
          if (ordenUpdate.codigo_nodo) objUpdate['codigo_nodo'] = ordenUpdate.codigo_nodo

          return await this.ordenModel.findOneAndUpdate({ 
            codigo_requerimiento: ordenUpdate.codigo_requerimiento
          }, { $set: objUpdate, $push: { historial_registro: registroOrdenes }
          }).then(() => actualizados = actualizados +1 ).catch((e) => {
            errores = errores +1
            this.logger.error({ message: e, service: 'liquidarOrdenes(servicio - misma bandeja)' })
            return;
          });
        } else {
          const registroOrdenes:THistorial = {
            usuario_entrada: usuario,
            estado_orden: estadoXTipoLiquidacion,
            empleado_modificado: ordenUpdate.tecnico_liquidado,
            observacion: 'Orden liquidadas en otra bandeja.',
            codigo_ctr: ordenUpdate.codigo_ctr
          };
          objUpdate = {
            codigo_ctr: ordenUpdate.codigo_ctr,
            codigo_nodo: ordenUpdate.codigo_nodo,
            fecha_liquidado: ordenUpdate.fecha_liquidado,
            tecnico_liquidado: ordenUpdate.tecnico_liquidado,
            carnet_liquidado: ordenUpdate.carnet_liquidado,
            nombre_liquidado: ordenUpdate.nombre_liquidado,
            tipo_averia: ordenUpdate.tipo_averia,
            codigo_usuario_liquidado: ordenUpdate.codigo_usuario_liquidado,
            estado_liquidado: ordenUpdate.estado_liquidado,
            observacion_liquidado: ordenUpdate.observacion_liquidado,
            descripcion_codigo_liquidado: ordenUpdate.descripcion_codigo_liquidado,
            estado_gestor: estadoXTipoLiquidacion
          }
          if (ordenUpdate.codigo_ctr) objUpdate['codigo_ctr'] = ordenUpdate.codigo_ctr
          if (ordenUpdate.codigo_nodo) objUpdate['codigo_nodo'] = ordenUpdate.codigo_nodo
          return await this.ordenModel.findOneAndUpdate({ 
            codigo_requerimiento: ordenUpdate.codigo_requerimiento
          }, { $set: objUpdate, $push: { historial_registro: registroOrdenes }
          }).then(() => actualizados = actualizados +1 ).catch((e) => {
            errores = errores +1
            this.logger.error({ message: e, service: 'liquidarOrdenes(servicio - bandeja diferente)' })
            return;
          });
        };
      } else if (ordenBase && ordenBase.fecha_liquidado && !ordenBase.tecnico_liquidado && ordenUpdate.tecnico_liquidado) {
        const registroOrdenes:THistorial = {
          usuario_entrada: usuario,
          estado_orden: estadoXTipoLiquidacion,
          empleado_modificado: ordenUpdate.tecnico_liquidado,
          observacion: 'Datos de liquidación actualizado (tecnico).',
        };
        objUpdate = {
          tecnico_liquidado: ordenUpdate.tecnico_liquidado,
          carnet_liquidado: ordenUpdate.carnet_liquidado,
          nombre_liquidado: ordenUpdate.nombre_liquidado,
          tipo_averia: ordenUpdate.tipo_averia,
          codigo_usuario_liquidado: ordenUpdate.codigo_usuario_liquidado,
          estado_liquidado: ordenUpdate.estado_liquidado,
          observacion_liquidado: ordenUpdate.observacion_liquidado,
          descripcion_codigo_liquidado: ordenUpdate.descripcion_codigo_liquidado,
          estado_gestor: estadoXTipoLiquidacion
        }
        if (ordenUpdate.codigo_ctr) objUpdate['codigo_ctr'] = ordenUpdate.codigo_ctr
        if (ordenUpdate.codigo_nodo) objUpdate['codigo_nodo'] = ordenUpdate.codigo_nodo
        return await this.ordenModel.findOneAndUpdate({ 
          codigo_requerimiento: ordenUpdate.codigo_requerimiento
        }, {
          $set: objUpdate, $push: { historial_registro: registroOrdenes }
        }).then(() => actualizados = actualizados +1 ).catch((e) => {
          errores = errores +1
          this.logger.error({ message: e, service: 'liquidarOrdenes(servicio - bandeja diferente)' })
          return;
        });
      } else {
        let registroUpdate:any = {};
        if (ordenBase && ordenBase.estado_gestor) {
          if ( ordenBase.estado_gestor !== estadoXTipoLiquidacion) {
            registroUpdate = {
              historial_registro: {
                usuario_entrada: usuario,
                estado_orden: estadoXTipoLiquidacion,
                empleado_modificado: ordenUpdate.tecnico_liquidado,
                observacion: `Orden liquidada. Estado actualizado. (${ordenBase.estado_gestor}>${estadoXTipoLiquidacion})`,
              }
            }
          }
          
          return await this.ordenModel.findOneAndUpdate({ 
            codigo_requerimiento: ordenUpdate.codigo_requerimiento
          }, { $set: {
            estado_gestor: estadoXTipoLiquidacion }
            , $push: { registroUpdate } })
          .then(() => duplicados = duplicados + 1).catch((e) => {
            errores = errores +1
            this.logger.error({ message: e, service: 'liquidarOrdenes(servicio - estado diferente)' })
            return;
          });
        } else { duplicados = duplicados+1 };
      };
    })).then(() => ({ duplicados,  actualizados, errores }));
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
        let estadosCerrados = [estados_toa.SUSPENDIDO, estados_toa.CANCELADO, estados_toa.NO_REALIZADA]
        let reqUnicos:TOrdenesToa[] = [];
        ordenesJson.forEach((ordenBase) => {
          if (reqUnicos.length > 0 ) {
            const filtrados = ordenesJson.filter((e) => e.requerimiento === ordenBase.requerimiento);
            if (filtrados.length > 1) {
              const pendientes = filtrados.filter((e) => !estadosCerrados.includes(e.estado_toa));
              reqUnicos.push(...pendientes);
            } else if (filtrados.length === 1){
              reqUnicos.push(...filtrados);
            }
          } else { reqUnicos.push(ordenBase) }
        });
        
        return await Promise.all(reqUnicos.filter(e => e).map(async(o) => {
          let objUpdate = {};
          if (o.tecnico && String(o.tecnico).length > 1) {      
            objUpdate = {
              tipo: o.tipo,
              fecha_cancelado: o.fecha_cancelado ? new Date(DateTime.fromFormat(String(o.fecha_cancelado).trim(), 'dd/MM/yy hh:mm a').toISO()): null,
              observacion_toa: o.observacion_toa,
              tecnico: o.tecnico && typeof o.tecnico !== 'string' ? o.tecnico._id : null,
              gestor: o.gestor && typeof o.gestor !== 'string' ? o.gestor._id : null,
              gestor_liquidado_toa: o.gestor_liquidado_toa && typeof o.gestor_liquidado_toa !== 'string' ? o.gestor_liquidado_toa._id : null,
              auditor: o.auditor && typeof o.auditor !== 'string' ? o.auditor._id : null,
              // contrata: o.contrata && typeof o.contrata !== 'string' ? o.contrata._id : null,
              estado_toa: o.estado,
              estado_indicador_toa: o.estado_indicador_toa,
              subtipo_actividad: o.subtipo_actividad,
              tipo_agenda: o.tipo_agenda,
              motivo_no_realizado: o.motivo_no_realizado,
              sla_inicio: o.sla_inicio ? new Date(String(o.sla_inicio).trim()): null,
              sla_fin: o.sla_fin ? new Date(String(o.sla_fin).trim()): null
            };
            
            if (o.bucket && String(o.bucket).length > 3) objUpdate['bucket'] = o.bucket;
            if (o.fecha_cita && String(o.fecha_cita).length > 3) objUpdate['fecha_cita'] = new Date(String(o.fecha_cita).trim());
            if (o.direccion && String(o.direccion).length > 1) objUpdate['direccion'] = o.direccion;
            if (o.nombre_cliente && String(o.nombre_cliente).length > 1) objUpdate['nombre_cliente'] = o.nombre_cliente;
          } else {
            objUpdate['tipo_agenda'] = o.tipo_agenda;
            if (o.observacion_toa && String(o.observacion_toa).length > 1) objUpdate['observacion_toa'] = o.observacion_toa;
            if (o.estado_toa && String(o.estado_toa).length > 1) objUpdate['estado_toa'] = o.estado_toa;
            if (o.estado_indicador_toa && String(o.estado_indicador_toa).length > 1) objUpdate['estado_indicador_toa'] = o.estado_indicador_toa;
            if (o.subtipo_actividad && String(o.subtipo_actividad).length > 4) objUpdate['subtipo_actividad'] = o.subtipo_actividad;
            if (o.motivo_no_realizado && String(o.motivo_no_realizado).length > 4) objUpdate['motivo_no_realizado'] = o.motivo_no_realizado;
            if (o.sla_inicio && String(o.sla_inicio).length > 4) objUpdate['sla_inicio'] = o.sla_inicio;
            if (o.sla_fin && String(o.sla_fin).length > 4) objUpdate['sla_fin'] = o.sla_fin;
            if (o.bucket && String(o.bucket).length > 3) objUpdate['bucket'] = o.bucket;
            if (o.fecha_cita && String(o.fecha_cita).length > 3) objUpdate['fecha_cita'] = new Date(String(o.fecha_cita).trim());
            if (o.direccion && String(o.direccion).length > 1) objUpdate['direccion'] = o.direccion;
            if (o.nombre_cliente && String(o.nombre_cliente).length > 1) objUpdate['nombre_cliente'] = o.nombre_cliente;
          };
          
          return await this.ordenModel.findOneAndUpdate({codigo_requerimiento: o.requerimiento}, { $set: objUpdate });

        }));  
      };
    });
  };
  //funcion que obtiene las ordenes del dia actual filtrandolo por la fecha de LIQUIDACION 
  async obtenerOrdenesPendientes(tipo: string) {
    return await this.ordenModel.find({
      $and: [
        { $or: [
          { estado_gestor: { $ne: estado_gestor.LIQUIDADO } },
          { fecha_liquidado: null },
        ] },
        { estado_gestor: { $ne: estado_gestor.ANULADO } },
        { codigo_nodo: { $in: nodosLima } },
        { codigo_ctr: { $in: [bandejas.CRITICOS,bandejas.LITEYCA] } },
        { tipo },
      ]
    }).populate('contrata', 'nombre')
      .populate('gestor_liteyca tecnico tecnico_liteyca', 'nombre apellidos carnet')
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
        indicador_pai: 1,
        distrito: 1,
        bucket: 1,
        tipo_requerimiento: 1,
        tipo_tecnologia: 1,
        estado_toa: 1,
        estado_gestor: 1,
        estado_liquidado: 1,
        contrata: 1,
        gestor: 1,
        gestor_liteyca: 1,
        tecnico: 1,
        tecnico_liteyca: 1,
        fecha_cita: 1,
        tipo_agenda: 1,
        fecha_asignado: 1,
        fecha_registro: 1,
        infancia: 1,
        infancia_externa: 1,
        numero_reiterada: 1,
        orden_devuelta: 1,
        observacion_gestor: 1,
        observacion_toa: 1,
        subtipo_actividad: 1
      }).sort('bucket estado_toa contrata');
  };
  async obtenerOrdenesLiquidadas(gestor:string, tipo:string, fechaInicio:Date, fechaFin:Date) {
    let objQuery:any = { codigo_requerimiento: null };
    let fi = DateTime.fromJSDate(new Date(fechaInicio));
    let ff = DateTime.fromJSDate(new Date(fechaFin));
    const field = gestor ? 'gestor' : 'tipo'

    if (!fechaInicio || !fechaFin) {
      let dia = DateTime.fromJSDate(new Date());
      let startOfToday = new Date(Date.UTC(dia.get('year'), dia.get('month')-1, dia.get('day'), 0, 0, 0, 0));

      objQuery = {
        $and: [
          { fecha_liquidado: { $gte: startOfToday } } ,
          { codigo_ctr: { $in: bandejasLiteyca } },
          { codigo_nodo: { $in: nodosLima } },
          { estado_gestor: estado_gestor.LIQUIDADO },
          { [field]: gestor ? gestor : tipo }
        ]
      };

    } else if (fi.get('year') > 2000 && ff.get('year') > 2000) {
      let inicioUTC = new Date(Date.UTC(fi.get('year'), fi.get('month')-1, fi.get('day'), 0, 0, 0));
      let finUTC = new Date(Date.UTC(ff.get('year'), ff.get('month')-1, ff.get('day'), 0, 0, 0));
      
      objQuery = {
        $and: [
          { fecha_liquidado: { $gte: inicioUTC, $lte: finUTC } } ,
          { codigo_ctr: { $in: bandejasLiteyca } },
          { estado_gestor: estado_gestor.LIQUIDADO },
          { [field]: gestor ? gestor : tipo }
        ]
      };
    };     

    return await this.ordenModel.find(objQuery).populate('contrata', 'nombre')
      .populate('gestor', 'nombre apellidos')
      .populate('tecnico_liquidado', 'nombre apellidos carnet')
      .select({
        tipo: 1,
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
        fecha_cita: 1,
        tipo_agenda: 1,
        fecha_registro: 1,
        fecha_liquidado: 1,
        observacion_gestor: 1,
        observacion_liquidado: 1
      }).sort('bucket estado_toa contrata');
  };
  async obtenerOrdenesOtrasBandejas(tipo: string) {
    let dia = DateTime.fromJSDate(new Date());
    let startOfToday = new Date(Date.UTC(dia.get('year'), dia.get('month')-1, dia.get('day'), 0, 0, 0, 0));

    return await this.ordenModel.find({ 
      $and: [
        { $or: [
          {fecha_liquidado: { $gte: startOfToday }},
          {fecha_liquidado: null}
        ]},
        { estado_gestor: { $ne: estado_gestor.LIQUIDADO } },
        { codigo_ctr: { $nin: [bandejas.CRITICOS, bandejas.PEX ] } },
        { codigo_nodo: { $in: nodosLiteyca } },
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
        nombre_liquidado: 1,
        carnet_liquidado: 1,
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
    let dia = DateTime.fromJSDate(new Date());
    let startOfToday = new Date(Date.UTC(dia.get('year'), dia.get('month')-1, dia.get('day'), 0, 0, 0, 0));

    return await this.ordenModel.find({ 
      $and: [
        { $or: [
          {fecha_liquidado: { $gte: startOfToday }},
          {fecha_liquidado: null}
        ]},
        { estado_gestor: estado_gestor.ANULADO },
        { codigo_nodo: { $in: nodosLiteyca } },
        { tipo },
      ]
    }).populate('contrata gestor tecnico tecnico_liquidado', 'nombre apellidos carnet').select({
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
        contrata: 1,
        gestor: 1,
        tecnico: 1,
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
  async obtenerOrdenesPendientesGestor(gestor: string, todo:string) {   
     
    return await this.ordenModel.find({
      $and: [
        { $or: [
          { estado_gestor: { $ne: estado_gestor.LIQUIDADO } },
          { fecha_liquidado: null },
        ] },
        { estado_gestor: { $ne: estado_gestor.ANULADO } },
        { gestor_liteyca: gestor },
        { codigo_nodo: { $in: nodosLima } },
        { codigo_ctr: { $in: [bandejas.LITEYCA, bandejas.CRITICOS] } }
      ]
    }).populate('contrata', 'nombre')
      .populate('tecnico tecnico_liteyca', 'nombre apellidos carnet')
      .populate('gestor gestor_liteyca', 'nombre apellidos carnet')
      .populate({
        path: 'infancia', 
        select: 'codigo_requerimiento tecnico_liquidado estado_gestor fecha_registro fecha_liquidado codigo_ctr',
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
        indicador_pai: 1,
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
        tecnico: 1,
        tecnico_liteyca: 1,
        gestor_liteyca: 1,
        fecha_cita: 1,
        tipo_agenda: 1,
        fecha_registro: 1,
        fecha_asignado: 1,
        observacion_gestor: 1,
        observacion_toa: 1,
        subtipo_actividad: 1
      }).sort('bucket estado_toa');
  };
  //FUNCION PARA OBTENER LAS ORDENES REITERADAS
  async obtenerReiteradas(codigo_cliente: string):Promise<IOrden[]> {
    let haceUnMes = DateTime.fromJSDate(new Date()).plus({month: -1}).toJSDate();
    return await this.ordenModel.find({
      $and: [
        { codigo_cliente },
        { fecha_liquidado: { $gte: haceUnMes } },
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
  //funcion para obtener el detalle de la orden ya sea averia o alta
  async obtenerDetalleOrden(id_orden:string): Promise<IOrden> {
    return await this.ordenModel.findById(id_orden)
  };
  //funcion para obtener las ordenesa a exportar
  async obtenerPendientesExportar(todo:string, tipo:string, ids:string[]) {
    let objQuery:any;
    
    if (todo === 'true') {
      objQuery = {
        $and: [
          { $or: [
            { estado_gestor: { $ne: estado_gestor.LIQUIDADO } },
            { fecha_liquidado: null },
          ] },
          { estado_gestor: { $ne: estado_gestor.ANULADO } },
          { codigo_ctr: { $in: [bandejas.LITEYCA, bandejas.CRITICOS] } },
          { codigo_nodo: { $in: nodosLima } },
          { tipo },
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
      tipo: 1,
      codigo_requerimiento: 1,
      codigo_cliente: 1,
      codigo_trabajo: 1,
      codigo_peticion: 1,
      direccion: 1,
      nombre_cliente: 1,
      indicador_pai: 1,
      detalle_trabajo: 1,
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
      gestor_liteyca: 1,
      auditor: 1,
      tecnico: 1,
      tecnico_liteyca: 1,
      fecha_cita: 1,
      tipo_agenda: 1,
      fecha_registro: 1,
      fecha_asignado: 1,
      fecha_liquidado: 1,
      orden_devuelta: 1,
      observacion_toa: 1,
      observacion_gestor: 1,
      subtipo_actividad: 1,
    }).populate({
      path: 'infancia',
      select: 'codigo_requerimiento tecnico_liquidado fecha_registro fecha_liquidado codigo_ctr',
      populate: {
        path: 'tecnico_liquidado',
        select: 'nombre apellidos carnet gestor',
        populate: {
          path: 'gestor',
          select: 'nombre apellidos'
        }
      }
    }).populate('contrata', 'nombre')
      .populate('gestor gestor_liteyca auditor tecnico tecnico_liteyca', 'nombre apellidos carnet')
  };

  async obtenerLiquidadasExportar(gestor:string, todo:string, tipo:string, ids:string[], fechaInicio:Date, fechaFin:Date) {
    let objQuery:any = { codigo_requerimiento: null };
    let fi = DateTime.fromJSDate(new Date(fechaInicio));
    let ff = DateTime.fromJSDate(new Date(fechaFin));
    
    if (todo === 'true') {
      let dia = DateTime.fromJSDate(new Date());
      let startOfToday = new Date(Date.UTC(dia.get('year'), dia.get('month')-1, dia.get('day'), 0, 0, 0, 0));

      if (gestor) {
        objQuery = {
          $and: [
            { fecha_liquidado: { $gte: startOfToday } } ,
            { codigo_ctr: { $in: bandejasLiteyca } },
            { gestor }
          ]
        };
      } else {
        objQuery = {
          $and: [
            { fecha_liquidado: { $gte: startOfToday } } ,
            { codigo_ctr: { $in: bandejasLiteyca } },
            { tipo }
          ]
        };
      }
    } else if (todo === 'false' && !fechaInicio && !fechaFin) {      
      if (!ids || ids.length < 0 ) {
        throw new HttpException({
          status: 'error',
          message: "No se encontraron ordenes."
        }, HttpStatus.FORBIDDEN)
      }
      objQuery = { _id: { $in: ids } }
    } else if (fi.get('year') > 2000 && ff.get('year') > 2000) {
      let inicioUTC = new Date(Date.UTC(fi.get('year'), fi.get('month')-1, fi.get('day'), 0, 0, 0));
      let finUTC = new Date(Date.UTC(ff.get('year'), ff.get('month')-1, ff.get('day'), 23, 59, 59));      

      if (gestor) {
        objQuery = {
          $and: [
            { fecha_liquidado: { $gte: inicioUTC, $lte: finUTC } } ,
            { codigo_ctr: { $in: bandejasLiteyca } },
            { gestor }
          ]
        }
      } else {
        objQuery = {
          $and: [
            { fecha_liquidado: { $gte: inicioUTC, $lte: finUTC } } ,
            { codigo_ctr: { $in: bandejasLiteyca } },
            { tipo }
          ]
        }
      }
    };
    
    return await this.ordenModel.find(objQuery).select({
      tipo: 1,
      codigo_requerimiento: 1,
      codigo_cliente: 1,
      codigo_trabajo: 1,
      codigo_peticion: 1,
      nombre_cliente: 1,
      indicador_pai: 1,
      tipo_agenda: 1,
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
      estado_liquidado: 1,
      contrata: 1,
      gestor: 1,
      auditor: 1,
      tecnico_liquidado: 1,
      fecha_cita: 1,
      fecha_registro: 1,
      fecha_asignado: 1,
      fecha_liquidado: 1,
      observacion_toa: 1,
      observacion_gestor: 1,
      observacion_liquidado: 1,
      subtipo_actividad: 1,
      descripcion_codigo_liquidado: 1,
      tipo_averia: 1
    }).populate({
      path: 'infancia',
      select: 'codigo_requerimiento tecnico_liquidado fecha_registro fecha_liquidado codigo_ctr',
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

  async obtenerPendientesExportarGestor(gestor:string, ids:string[], todo:string, ) {
    let objQuery:any={};
    
    if (todo === 'true') {
      objQuery = {
        $and: [
          { gestor_liteyca: gestor },
          { estado_gestor: { $nin: [estado_gestor.LIQUIDADO,estado_gestor.ANULADO] } },
          { codigo_ctr: { $in: [bandejas.LITEYCA, bandejas.CRITICOS] } }
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
      tipo: 1,
      codigo_requerimiento: 1,
      codigo_cliente: 1,
      codigo_trabajo: 1,
      codigo_peticion: 1,
      direccion: 1,
      nombre_cliente: 1,
      indicador_pai: 1,
      tipo_requerimiento: 1,
      tipo_tecnologia: 1,
      codigo_ctr: 1,
      codigo_nodo: 1,
      codigo_troba: 1,
      detalle_trabajo: 1,
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
      tecnico_liteyca: 1,
      fecha_cita: 1,
      tipo_Agenda: 1,
      fecha_registro: 1,
      fecha_asignado: 1,
      fecha_liquidado: 1,
      orden_devuelta: 1,
      observacion_toa: 1,
      observacion_gestor: 1,
      subtipo_actividad: 1,
    }).populate({
      path: 'infancia',
      select: 'codigo_requerimiento tecnico_liquidado fecha_registro fecha_liquidado codigo_ctr',
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
      .populate('tecnico tecnico_liteyca', 'nombre apellidos carnet')
  };
  //funcion para agendar una orden
  async agendarOrden(ordenes:string[], id:string, bucket?:string, contrata?:string, gestor?:string, tecnico?:string, fecha_cita?:string, observacion?: string) {
    let objUpdate = {};

    let observacion_gestor = observacion ? observacion : `Orden agendada (${bucket ? 'bucket, ' : ''}${contrata ? 'contrata, ' : ''}${gestor ? 'gestor, ' : ''}${fecha_cita ? 'fecha de cita, ' : ''})`;

    let registroOrdenes:THistorial = {
      observacion: observacion_gestor,
      usuario_entrada: id,
      contrata_modificado: contrata,
      empleado_modificado: tecnico ? tecnico : gestor,
      estado_orden: estado_gestor.AGENDADO
    };

    if(gestor) objUpdate['gestor_liteyca'] = gestor;
    if(tecnico) objUpdate['tecnico_liteyca'] = tecnico;
    if(fecha_cita) objUpdate['fecha_cita'] = new Date(fecha_cita).toUTCString();
    

    return await this.ordenModel.updateMany({ _id: { $in: ordenes } }, {
      $set: { ...objUpdate, estado_gestor: estado_gestor.AGENDADO, observacion_gestor },
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
      estado_orden: estado_gestor.ASIGNADO
    };

    if (contrata  && contrata.length > 5) {
      objUpdate['contrata'] = contrata;
    }
    if (gestor  && gestor.length > 5) {
      objUpdate['gestor_liteyca'] = gestor;
      objUpdate['estado_gestor'] = estado_gestor.ASIGNADO;
    }
    if (tecnico && tecnico.length > 5) {
      objUpdate['auditor'] = auditor;
      objUpdate['tecnico_liteyca'] = tecnico;
      objUpdate['estado_gestor'] = estado_gestor.ASIGNADO;
    }
    if (observacion && String(observacion).length > 4) objUpdate['observacion_gestor'] = observacion
    
    return await this.ordenModel.updateMany({ _id: { $in: ordenes } }, {
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
        observacion: observacion ? observacion : `Orden Modificada (${estado}).`,
        estado_orden: estado ? estado :'-',
      };
      if (images && images.length > 0) {
        registro.imagenes = images.map((img) => ({
          public_id: img.public_id,
          url: img.secure_url
        }));
      };
      if (estado && estado !== 'null') objUpd.estado_gestor = estado;
      if (observacion && observacion !== 'null') objUpd.observacion_gestor = observacion
      
      return await this.ordenModel.updateMany(
        {  _id: { $in: JSON.parse(String(ordenes)) } }, 
        { $set: {...objUpd }, $push: { historial_registro: registro } })
    });
  };
  //funcion para agregar una observacion a la orden
  async agregarObservacion(usuario:string, orden:string, observacion:string) {
    let registro: THistorial = {
      usuario_entrada: usuario,
      observacion: observacion,
    };
      
    return await this.ordenModel.findByIdAndUpdate( orden , { $set: { observacion_gestor: observacion }, $push: { historial_registro: registro } })
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
