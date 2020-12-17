import { Document } from 'mongoose';
import { IEmpleado } from 'src/api/empleados/interfaces/empleados.interface';

export interface IAsistencia extends Document {
  readonly tecnico: IEmpleado['_id'],
  readonly gestor?: IEmpleado['_id'],
  readonly estado?: string,
  readonly iniciado?: boolean,
  readonly fecha_iniciado?: Date,
  readonly observacion?: string,
  readonly updatedAt?: Date,
  readonly createdAt?: Date
}
