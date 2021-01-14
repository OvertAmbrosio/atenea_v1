import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as CloudLib from 'cloudinary'
import { Model } from 'mongoose';
import { DateTime } from 'luxon';
import * as fs from 'fs';

import { Cloudinary } from './update-data.provider';
import { IEmpleado } from 'src/api/empleados/interfaces/empleados.interface';
import { TOrdenesToa } from 'src/helpers/types';
import { variables } from 'src/config';


@Injectable()
export class UpdateDataService {
  constructor (
    @InjectModel('Empleado') private readonly empleadoModel: Model<IEmpleado>,
    @Inject(Cloudinary) private cloudinary: typeof CloudLib,
    private configService: ConfigService,
  ) {
    this.cloudinary.v2.config({
      cloud_name: configService.get(variables.cloudinary_name),
      api_key: configService.get(variables.cloudinary_key),
      api_secret: configService.get(variables.cloudinary_secret),
    })
    // this.v2 = this.cloudinary.v2
  }

  public async actualizarTecnicosToa(ordenes:TOrdenesToa[], tipo:string):Promise<TOrdenesToa[]> {
    return await Promise.all(ordenes.map(async(o) => {
      if (o.tecnico && typeof o.tecnico === 'string' && String(o.tecnico).length === 6) {
        return await this.empleadoModel.findOne({ $and: [{carnet: o.tecnico},{carnet: { $ne: null}}]})
          .select('_id nombre apellidos gestor auditor contrata carnet').populate('gestor', 'nombre apellidos').populate('auditor', 'nombre apellidos').populate('contrata', 'nombre')
          .then(async(empleado) => {
            if (o.gestor_liquidado_toa && typeof o.gestor_liquidado_toa === 'string' && String(o.gestor_liquidado_toa).length === 6) {
              return await this.empleadoModel.findOne({ $and: [{carnet: o.gestor_liquidado_toa},{carnet: { $ne: null}}]}).select('_id').then((gestor) => {
                return({
                  ...o,
                  tipo,
                  estado_toa: o.estado,
                  tecnico: empleado ? {_id: empleado._id, nombre: empleado.nombre, apellidos: empleado.apellidos} : null,
                  carnet: empleado && empleado.carnet,
                  gestor: empleado && empleado.gestor ? empleado.gestor : null,
                  gestor_liquidado_toa: gestor ? {_id: empleado._id, nombre: empleado.nombre, apellidos: empleado.apellidos} : null,
                  auditor: empleado && empleado.auditor ? empleado.auditor : null,
                  contrata: empleado && empleado.contrata ? empleado.contrata : null,
                  fecha_cancelado: o.fecha_cancelado ? new Date(DateTime.fromFormat(String(o.fecha_cancelado).trim(), 'dd/MM/yy hh:mm a').toISO()): null,
                  fecha_cita: o.fecha_cita ? new Date(DateTime.fromFormat(String(o.fecha_cita).trim(), 'dd/MM/yy').toISO()): null,
                  sla_inicio: o.sla_inicio ? new Date(DateTime.fromFormat(String(o.sla_inicio).trim(), 'dd/MM/yy hh:mm a').toISO()): null,
                  sla_fin: o.sla_fin ? new Date(DateTime.fromFormat(String(o.sla_fin).trim(), 'dd/MM/yy hh:mm a').toISO()): null
                })
              })
            } else {
              return({
                ...o,
                tipo,
                estado_toa: o.estado,
                tecnico: empleado ? {_id: empleado._id, nombre: empleado.nombre, apellidos: empleado.apellidos} : null,
                carnet: empleado && empleado.carnet,
                gestor: empleado && empleado.gestor ? empleado.gestor : null,
                gestor_liquidado_toa: null,
                auditor: empleado && empleado.auditor ? empleado.auditor : null,
                contrata: empleado && empleado.contrata ? empleado.contrata : null,
                fecha_cancelado: o.fecha_cancelado ? new Date(DateTime.fromFormat(String(o.fecha_cancelado).trim(), 'dd/MM/yy hh:mm a').toISO()): null,
                fecha_cita: o.fecha_cita ? new Date(DateTime.fromFormat(String(o.fecha_cita).trim(), 'dd/MM/yy').toISO()): null,
                sla_inicio: o.sla_inicio ? new Date(DateTime.fromFormat(String(o.sla_inicio).trim(), 'dd/MM/yy hh:mm a').toISO()): null,
                sla_fin: o.sla_fin ? new Date(DateTime.fromFormat(String(o.sla_fin).trim(), 'dd/MM/yy hh:mm a').toISO()): null
              })
            }
          })
      } else {
        return({
          ...o,
          tipo,
          estado_toa: o.estado,
          tecnico: null,
          carnet: '-',
          gestor: null,
          gestor_liquidado_toa: null,
          auditor: null,
          contrata: null,
          fecha_cancelado: o.fecha_cancelado ? new Date(DateTime.fromFormat(String(o.fecha_cancelado).trim(), 'dd/MM/yy hh:mm a').toISO()): null,
          fecha_cita: o.fecha_cita ? new Date(DateTime.fromFormat(String(o.fecha_cita).trim(), 'dd/MM/yy').toISO()): null,
          sla_inicio: o.sla_inicio ? new Date(DateTime.fromFormat(String(o.sla_inicio).trim(), 'dd/MM/yy hh:mm a').toISO()): null,
          sla_fin: o.sla_fin ? new Date(DateTime.fromFormat(String(o.sla_fin).trim(), 'dd/MM/yy hh:mm a').toISO()): null
        })
      };
    }));
  };

  public async subirImagenes(files:Array<any>, folder:string):Promise<CloudLib.UploadApiResponse[]> {
    if (files && files.length > 0) {
      return Promise.all(files.map(async(file) => {
        return await this.cloudinary.v2.uploader.upload(file.path, {
          resource_type: "auto",
          folder: folder
        }).then(async(res) => {
          fs.unlinkSync(file.path)
          return res;
        });
      }));
    } else {
      return null;
    }
  };
}
