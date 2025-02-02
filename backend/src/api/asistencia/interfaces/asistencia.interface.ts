import { Document } from 'mongoose';
import { IEmpleado } from 'src/api/empleados/interfaces/empleados.interface';

export interface IAsistencia extends Document {
  readonly tipo?: string,
  readonly tecnico?: IEmpleado['_id'],
  readonly gestor?: IEmpleado['_id'],
  readonly estado?: string,
  readonly iniciado?: boolean,
  readonly fecha_iniciado?: Date,
  readonly fecha_registro?: Date,
  readonly observacion?: string,
  readonly updatedAt?: Date,
  readonly createdAt?: Date
}
