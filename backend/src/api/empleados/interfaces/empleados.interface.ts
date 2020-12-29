import { Document } from 'mongoose';
import { IUsuario } from './usuarios.type';
import { IContrata } from '../../contratas/interfaces/contrata.interface';

export interface IEmpleado extends Document {
  readonly usuario: IUsuario,
  readonly nombre: string,
  readonly apellidos: string,
  readonly gestor: IEmpleado['_id']
  readonly auditor: IEmpleado['_id']
  readonly contrata: IContrata['_id'],
  readonly tipo_negocio: string,
  readonly sub_tipo_negocio: string,
  readonly fecha_nacimiento: Date,
  readonly numero_documento: string,
  readonly tipo_documento: string,
  readonly carnet: string,
  readonly fecha_ingreso: Date,
  readonly fecha_baja: Date,
  readonly estado_empresa: string,
  readonly nacionalidad: string,
  readonly observacion?: string
}
