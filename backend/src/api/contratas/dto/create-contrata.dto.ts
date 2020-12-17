import { IsNotEmpty } from 'class-validator';

export class CreateContrataDto {
  @IsNotEmpty()
  readonly nombre: string;
  readonly ruc?: string;
  readonly fecha_incorporacion?: Date;
  readonly activo: boolean;
  readonly observacion?: string;
}
