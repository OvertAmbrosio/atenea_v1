import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { PaginateModel } from 'mongoose';
import { DateTime } from 'luxon';

import { RedisService } from 'src/database/redis.service';
// import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';
import { IAsistencia } from './interfaces/asistencia.interface';
import { TPaginateParams } from 'src/helpers/types';
import { IEmpleado } from '../empleados/interfaces/empleados.interface';
import { estado_empresa, tipos_usuario } from 'src/constants/enum';
import { cache_keys } from 'src/config/variables';

@Injectable()
export class AsistenciaService {
  constructor(
    @InjectModel('Asistencia') private readonly asistenciaModel: PaginateModel<IAsistencia>,
    @InjectModel('Empleado') private readonly empleadoModel: PaginateModel<IEmpleado>,
    private readonly redisService: RedisService,
  ) {};

  @Cron('0 0 5 * * *', {
    name: 'generarAsistencia',
    timeZone: 'America/Lima',
  })
  async generarAsistencia() {
    const tecnicos = await this.empleadoModel.find({
      $and:[
        { estado_empresa: { $ne: estado_empresa.INACTIVO } },
        { 'usuario.cargo': tipos_usuario.TECNICO }
    ]}).select('_id');
    const nuevaAsistencia = tecnicos.map((e) => {
      return ({
        tecnico: e._id,
        observacion: 'Estado aplicado automaticamente por el sistema.'
      })
    })
    console.log('asistencia creada')
    return await this.asistenciaModel.insertMany(nuevaAsistencia);
  };

  @Cron('0 */5 7-9 * * *', {
    name: 'guardarRutasActivas',
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
            { createdAt: { $gte: hoy } }
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

  async crearAsistencias(tecnicos: string[], gestor: string, estado: string) {
    
    const fecha = DateTime.DATETIME_SHORT;

    return await this.asistenciaModel.updateMany({
      $and: [
        { _id: { $in: tecnicos } },
        { updateAt: { $gte: fecha } }
      ]
    }, {
      tecnico: tecnicos, estado, gestor
    }, {
      upsert: true
    })
  };

  async listarTodoAsistencia(params: TPaginateParams): Promise<IAsistencia[]> {
    const diaFin = new Date(params.fecha_fin).getDate();
    const fechaFin = DateTime.fromISO(params.fecha_fin).set({day: diaFin+2});

    return await this.asistenciaModel.find({
      createdAt: { $gte: new Date(params.fecha_inicio), $lte: new Date(fechaFin.toISO()) }
    }).populate({
      path: 'tecnico',
      select: 'nombre apellidos contrata gestor tipo_negocio sub_tipo_negocio',
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
        { createdAt: { $gte: new Date(params.fecha_inicio), $lte: new Date(fechaFin.toISO()) } },
        { tecnico: { $in: tecnicos } }
      ]
    }).populate({
      path: 'tecnico',
      select: 'nombre apellidos contrata',
      populate: [{
        path: 'contrata',
        select: 'nombre'
      }, {
        path: 'gestor',
        select: 'nombre apellidos'
      }]
    }).select('tecnico estado observacion createdAt').then((obj) => obj.sort((a, b) => {
      if (a.tecnico.nombre > b.tecnico.nombre) {
        return -1;
      } else if (a.tecnico.nombre < b.tecnico.nombre) {
        return 1;
      } else {
        return 0
      };
    }));
  };

  findOne(id: number) {
    return `This action returns a #${id} asistencia`;
  }

  update(id: number, updateAsistenciaDto: UpdateAsistenciaDto) {
    return `This action updates a #${id} asistencia`;
  }

  remove(id: number) {
    return `This action removes a #${id} asistencia`;
  };

  prueba() {
    // funcion de prueba para ver si hay seguimiento
    return {};
  }
}
