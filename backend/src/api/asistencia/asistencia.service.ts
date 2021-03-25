import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { DateTime } from 'luxon';

import { RedisService } from 'src/database/redis.service';
import { IAsistencia } from './interfaces/asistencia.interface';
import { TPaginateParams } from 'src/helpers/types';
import { IEmpleado } from '../empleados/interfaces/empleados.interface';
import { estado_asistencia, estado_empresa, tipos_usuario } from 'src/constants/enum';
import { cache_keys } from 'src/config/variables';

type THelperAsis = {
  [key: string]: any,
  tipo: string,
  estado: string,
  observacion: string,
  fecha_registro: Date,
}

@Injectable()
export class AsistenciaService {
  constructor(
    @InjectModel('Asistencia') private readonly asistenciaModel: Model<IAsistencia>,
    @InjectModel('Empleado') private readonly empleadoModel: Model<IEmpleado>,
    private readonly redisService: RedisService,
  ) {};
  //convertir lista de empleados en objetos de asistenica
  private ordenarAsistencia(empleados:IEmpleado[], estado:string, fecha_registro:Date):THelperAsis[] {
    return empleados.map((empleado) => {
      const field = empleado.usuario.cargo === tipos_usuario.TECNICO ? 'tecnico' : 
                    empleado.usuario.cargo === tipos_usuario.GESTOR ? 'gestor' : 'auditor';
      return ({
        [field]: empleado._id,
        tipo: field,
        estado,
        observacion: 'Estado aplicado automaticamente por el sistema.',
        fecha_registro
      })
    })
  };
  // generar asistencia diaria
  @Cron('0 0 6 * * 1-6', {
    name: 'generarAsistencia',
    timeZone: 'America/Lima',
  })
  async generarAsistencia() {
    const hoy = DateTime.fromJSDate(new Date()).set({hour: 0, minute: 1, second: 0, millisecond: 0});
    const mañana = DateTime.fromJSDate(new Date()).set({hour: 23, minute: 59, second: 59, millisecond: 0});

    const empleadosAsistencia:Array<THelperAsis> = await this.empleadoModel.find({
      $and:[
        { estado_empresa: { $ne: estado_empresa.INACTIVO } },
        { 'usuario.cargo': { $in: [tipos_usuario.TECNICO, tipos_usuario.GESTOR, tipos_usuario.AUDITOR] } }
    ]}).select('_id usuario.cargo').then((empleados:IEmpleado[]) => {
      if (empleados && empleados.length > 0) {
        return this.ordenarAsistencia(empleados, estado_asistencia.FALTA, hoy.set({hour: 6}).toJSDate())
      } else {
        return []
      } 
    });

    return Promise.all(empleadosAsistencia.map(async(obj) => {   
        return await this.asistenciaModel.findOne({
          $and: [
            { [obj.tipo]: obj[obj.tipo] },
            { fecha_registro: { $gte: hoy.toJSDate(), $lt: mañana.toJSDate() } }
          ] 
        }).then(async(a:IAsistencia) => {
          if (a) {
            return null;
          } else {
            return await new this.asistenciaModel(obj).save()
          };
        })
    })).then((a) => console.log('Cantidad de nuevas: ' + a.filter(e => e).length)).catch((e) => console.log(e));
  };
  // generar asistencia domingos
  @Cron('0 0 6 * * 5', {
    name: 'generarDescansos',
    timeZone: 'America/Lima',
  })
  async generarDescansos() {
    const hoy = DateTime.fromJSDate(new Date()).plus({day: 2}).set({hour: 0, minute: 1, second: 0, millisecond: 0});
    const mañana = DateTime.fromJSDate(new Date()).plus({day: 2}).set({hour: 23, minute: 59, second: 59, millisecond: 0});
    
    const empleadosAsistencia:Array<THelperAsis> = await this.empleadoModel.find({
      $and:[
        { estado_empresa: { $ne: estado_empresa.INACTIVO } },
        { 'usuario.cargo': { $in: [tipos_usuario.TECNICO, tipos_usuario.GESTOR, tipos_usuario.AUDITOR] } }
    ]}).select('_id usuario.cargo').then((empleados:IEmpleado[]) => {
      if (empleados && empleados.length > 0) {
        return this.ordenarAsistencia(empleados, estado_asistencia.DESCANSO, hoy.set({hour: 6}).toJSDate())
      } else {
        return []
      } 
    });

    return Promise.all(empleadosAsistencia.map(async(obj) => {   
        return await this.asistenciaModel.findOne({
          $and: [
            { [obj.tipo]: obj[obj.tipo] },
            { fecha_registro: { $gte: hoy.toJSDate(), $lt: mañana.toJSDate() } }
          ] 
        }).then(async(a:IAsistencia) => {
          if (a) {
            return null;
          } else {
            return await new this.asistenciaModel(obj).save()
          };
        })
    })).then((a) => console.log('Cantidad de nuevas: ' + a.filter(e => e).length)).catch((e) => console.log(e));
  };

  @Cron('0 */5 7-10 * * *', {
    name: 'comprobarRuta',
    timeZone: 'America/Lima'  
  })
  async comprobarRuta() {
    try {
      const strRutas:Array<string> = await this.redisService.get(cache_keys.RUTAS_TOA).then((e) => JSON.parse(e));
      const hoy = new Date(DateTime.local().toFormat('yyyy/MM/dd'));
      if (strRutas) {
        const tecnicos = await this.empleadoModel.find({ carnet: { $in: strRutas } }).select('_id').then((e) => {
          if(e) {
            return e.map((t) => t._id);
          } else {
            return null
          }
        }).then((tec) => tec.filter((x) => x._id));
        return await this.asistenciaModel.updateMany({
          $and: [
            { tecnico: { $in: tecnicos } },
            { iniciado: { $ne: true } },
            { fecha_registro: { $gte: hoy } }
          ]
        }, { iniciado: true, fecha_iniciado: new Date() }).then((data) => {
          console.log('rutas cruzadas - ', new Date())
          return data;
        });
      };
    } catch (error) {
      console.log(error);
    };
  };

  // @Cron('*/10 * * * * *', {
  //   name: 'prueba',
  //   timeZone: 'America/Lima'  
  // })
  // async prueba() {
  //   const hoy = DateTime.fromJSDate(new Date()).plus({day: -1}).set({hour: 0, minute: 0, second: 0, millisecond: 0});
  //   const mañana = DateTime.fromJSDate(new Date()).plus({day: -1}).set({hour: 23, minute: 59, second: 59, millisecond: 0});

  //  console.log(hoy.plus({day: 4}).toJSDate());
    
  // };

  async crearAsistencia(usuario:string, idEmpleado: string, tipo: string, estado:string, fecha: Date, observacion?: string) {
    const fechaJs = new Date(fecha)
    const fechaObtenida = DateTime.fromJSDate(fechaJs).toFormat('d/MM HH:mm')
    const hoy = DateTime.fromJSDate(fechaJs).set({hour: 0, minute: 0, second: 0, millisecond: 0});
    const mañana = DateTime.fromJSDate(fechaJs).set({hour: 23, minute: 59, second: 59, millisecond: 0});
    
    return await this.asistenciaModel.findOne({
      $and: [
        { [tipo]: idEmpleado },
        { fecha_registro: { $gte: hoy.toJSDate(), $lte: mañana.toJSDate() }  }
      ]
    }).then(async(obj:any) => {
      if (obj) {
        throw new HttpException('Ya existe un registro para esa fecha.', HttpStatus.NOT_FOUND);
      } else {
        return await new this.asistenciaModel({
          [tipo]: idEmpleado, tipo, estado, fecha_registro: DateTime.fromJSDate(fechaJs).plus({ hour: 5}).toJSDate(), 
          observacion: observacion ? observacion : `Asistencia creada por ${usuario} el: ${fechaObtenida}`
        }).save()
      }
    })
  };

  async actualizarAsistencia(cargo:number, dia:number, id:string, estado:string, observacion?:string) {

    return await this.asistenciaModel.findById(id).then(async(obj:IAsistencia) => {
      if (obj) {
        const diaAsistencia = DateTime.fromJSDate(obj.fecha_registro).get('day');
        if (cargo === tipos_usuario.GESTOR && dia !== diaAsistencia) {
          throw new HttpException('No tienes permisos para actualizar dias anteriores.', HttpStatus.BAD_REQUEST)
        } else {
          return await this.asistenciaModel.findByIdAndUpdate({
            _id: id
          }, {
            estado,
            observacion: observacion ? observacion : '-'
          })
        };
      } else {
        throw new HttpException('No se encuentra el id.', HttpStatus.BAD_REQUEST)
      };
    });
  };

  async listarTodoAsistencia(params: TPaginateParams): Promise<IAsistencia[]> {
    const diaFin = new Date(params.fecha_fin).getDate();
    const fechaFin = DateTime.fromISO(params.fecha_fin).set({day: diaFin+2});

    return await this.asistenciaModel.find({
      $and: [
        { fecha_registro: { $gte: new Date(params.fecha_inicio), $lte: new Date(fechaFin.toISO()) } },
        { tipo: params.tipo }
      ]
    }).populate('auditor', 'nombre apellidos carnet estado_empresa').populate('gestor', 'nombre apellidos carnet estado_empresa').populate({
      path: 'tecnico',
      select: 'nombre apellidos contrata gestor tipo_negocio sub_tipo_negocio estado_empresa numero_documento carnet',
      populate: [{
        path: 'contrata',
        select: 'nombre'
      }, {
        path: 'gestor',
        select: 'nombre apellidos carnet'
      }, {
        path: 'auditor',
        select: 'nombre apellidos'
      }]
    }).then((obj) => {
      return obj.sort((a, b) => {
        if (a.tecnico && b.tecnico) {
          if (a.tecnico.nombre > b.tecnico.nombre) {
            return 1;
          } else if (a.tecnico.nombre < b.tecnico.nombre) {
            return -1;
          } else {
            return 0
          };
        } else {
          return 0
        }
      }); 
    });
  };

  async listarGestorAsistencia(params: TPaginateParams, gestor:string) {
    const diaFin = new Date(params.fecha_fin).getDate();
    const fechaFin = DateTime.fromISO(params.fecha_fin).set({day: diaFin+2});
    
    const tecnicos = await this.empleadoModel.find({
      $and:[
        { estado_empresa: { $ne: estado_empresa.INACTIVO } },
        { 'gestor': gestor },
    ]}).select('_id');

    return await this.asistenciaModel.find({
      $and: [
        { fecha_registro: { $gte: new Date(params.fecha_inicio), $lte: new Date(fechaFin.toISO()) } },
        { tecnico: { $in: tecnicos } },
        { tipo: 'tecnico' }
      ]
    }).populate({
      path: 'tecnico',
      select: 'nombre apellidos contrata gestor estado_empresa',
      populate: [{
        path: 'contrata',
        select: 'nombre'
      }, {
        path: 'gestor',
        select: 'nombre apellidos'
      }, {
        path: 'auditor',
        select: 'nombre apellidos'
      }]
    }).then((obj) => obj.sort((a, b) => {
      if (a.tecnico.nombre > b.tecnico.nombre) {
        return -1;
      } else if (a.tecnico.nombre < b.tecnico.nombre) {
        return 1;
      } else {
        return 0
      };
    }));
  };

}
