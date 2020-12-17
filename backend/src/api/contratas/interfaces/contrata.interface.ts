import { Document } from 'mongoose';

export interface IContrata extends Document {
  readonly nombre: string,
  readonly ruc: string,
  readonly fecha_incorporacion: Date,
  readonly activo: boolean;
  readonly observacion: string
}