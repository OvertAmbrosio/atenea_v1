import { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const ContrataSchema = new Schema({
  nombre: {
    type: String,
    trim: true,
    required: true,
    uppercase: true,
  },
  ruc: {
    type: String,
    trim: true,
    uppercase: true,
    default: '-'
  },
  fecha_incorporacion: {
    type: Date,
    default: Date.now
  },
  fecha_baja: Date,
  activo: {
    type: Boolean, 
    default: true
  },
  observacion: {
    type: String,
    default: '-'
  }
});

ContrataSchema.plugin(mongoosePaginate);
