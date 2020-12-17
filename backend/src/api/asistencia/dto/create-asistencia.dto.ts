import { IEmpleado } from "src/api/empleados/interfaces/empleados.interface"

export class CreateAsistenciaDto {
  readonly tecnico: IEmpleado['_id'];
  gestor: IEmpleado['_id'];
  readonly estado: string;
  readonly observacion?: string;
};
