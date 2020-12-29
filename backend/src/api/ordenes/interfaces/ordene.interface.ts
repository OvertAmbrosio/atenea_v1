import { Document } from 'mongoose';

import { IContrata } from 'src/api/contratas/interfaces/contrata.interface';
import { IEmpleado } from 'src/api/empleados/interfaces/empleados.interface';
import { THistorial } from 'src/helpers/types';

export interface IOrden extends Document {
  readonly tipo: string,
  readonly codigo_zonal: string,
  readonly codigo_requerimiento: string,
  readonly codigo_cliente: string,
  readonly nombre_cliente: string,
  readonly codigo_ctr: number,
  readonly descripcion_ctr: string,
  readonly codigo_nodo: string,
  readonly codigo_troba: string,
  readonly distrito: string,
  readonly direccion: string,
  readonly fecha_registro: Date,
  readonly codigo_motivo: string,
  readonly detalle_motivo: string,
  readonly tipo_requerimiento: string,
  readonly detalle_trabajo: string,
  readonly telefono_contacto: string,
  readonly telefono_referencia: string,
  readonly numero_reiterada: number,
  readonly tipo_tecnologia: string,
  ///////////////////////////////////////
  readonly historial_registro: THistorial,
  readonly estado_toa: string,
  readonly estado_gestor: string,
  readonly estado_tecnico: string,
  readonly bucket: string,
  readonly subtipo_actividad?: string,
  readonly fecha_cita: Date,
  readonly fecha_cancelado?: Date,
  readonly tipo_agenda: string,
  readonly motivo_no_realizado: string,
  readonly sla_inicio: Date,
  readonly sla_fin: Date,
  readonly observacion_toa: string,
  readonly orden_devuelta: boolean,
  //
  readonly tecnico: IEmpleado['_id'],
  readonly gestor: IEmpleado['_id'],
  readonly auditor: IEmpleado['_id'],
  readonly contrata: IContrata['_id'],
};
