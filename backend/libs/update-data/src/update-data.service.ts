import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DateTime } from 'luxon';

import { IEmpleado } from 'src/api/empleados/interfaces/empleados.interface';
import { TOrdenesToa } from 'src/helpers/types';

@Injectable()
export class UpdateDataService {
  constructor (
    @InjectModel('Empleado') private readonly empleadoModel: Model<IEmpleado>,
  ) {}

  public async actualizarTecnicosToa(ordenes:TOrdenesToa[]):Promise<TOrdenesToa[]> {
    return await Promise.all(ordenes.map(async(o) => await this.empleadoModel.findOne({ $and: [{carnet: o.tecnico},{carnet: { $ne: null}}]})
      .select('_id nombre apellidos gestor auditor contrata').populate('gestor', 'nombre apellidos').populate('auditor', 'nombre apellidos').populate('contrata', 'nombre')
      .then((empleado) => {
        return({
          ...o,
          estado_toa: o.estado,
          tecnico: empleado && empleado,
          fecha_cancelado: o.fecha_cancelado ? new Date(DateTime.fromFormat(String(o.fecha_cancelado).trim(), 'dd/MM/yy hh:mm a').toISO()): null,
          fecha_cita: o.fecha_cita ? new Date(DateTime.fromFormat(String(o.fecha_cita).trim(), 'dd/MM/yy').toISO()): null,
          sla_inicio: o.sla_inicio ? new Date(DateTime.fromFormat(String(o.sla_inicio).trim(), 'dd/MM/yy hh:mm a').toISO()): null,
          sla_fin: o.sla_fin ? new Date(DateTime.fromFormat(String(o.sla_fin).trim(), 'dd/MM/yy hh:mm a').toISO()): null
        })
      })
    ));
  };
}
