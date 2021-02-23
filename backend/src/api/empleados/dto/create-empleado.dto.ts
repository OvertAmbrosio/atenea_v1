import { IContrata } from "../../contratas/interfaces/contrata.interface";

class CreateUserDto {
  readonly email: string;
  readonly imagen: string;
  password: string;
  readonly cargo: number;
}

export class CreateEmpleadoDto {
  readonly usuario: CreateUserDto;
  readonly nombre: string;
  readonly apellidos: string;
  readonly contrata: IContrata['_id'];
  readonly numero_documento: string;
  readonly tipo_documento: string;
  carnet?: string;
  readonly fecha_ingreso: Date;
  readonly fecha_nacimiento: Date;
}