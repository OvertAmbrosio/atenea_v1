import { Schema, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { tipos_usuario, estado_empresa } from '../../../constants/enum';

export const EmpleadoSchema = new Schema({
  //usuario
  usuario: {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    imagen: {
      type: String,
      trim: true,
      default: 'https://res.cloudinary.com/ateneasystem/image/upload/v1583164290/avatar/mujer_3_pxlkpv.jpg'
    },
    cargo: {
      type: Number,
      min: 1,
      max: tipos_usuario.TECNICO,
      required: true,
      default: tipos_usuario.TECNICO 
    },
    activo: {
      //estado del usuario para validar el acceso al sistema,
      //un usuario puede estar activo en la empresa pero con el usuario
      //desactivado (vacaciones,fugas de seguridad, etc..)
      type: Boolean,
      default: true
    }
  },
  //datos del empleado
  nombre: {
    type: String,
    trim: true,
    uppercase: true,
    default: '-'
  },
  apellidos: {
    type: String,
    trim: true,
    uppercase: true,
    default: '-'
  },
  gestor: {
    type: Types.ObjectId,
    ref: 'Empleado'
  },
  auditor: {
    type: Types.ObjectId,
    ref: 'Empleado'
  },
  contrata: {
    type: Types.ObjectId,
    ref: 'Contrata'
  },
  tipo_negocio: {
    type: String,
    trim: true,
    lowercase: true,
    default: '-'
  },
  sub_tipo_negocio: {
    type: String,
    trim: true,
    lowercase: true,
    default: '-'
  },
  fecha_nacimiento: {
    type: Date,
    default: new Date()
  },
  numero_documento: {
    type: String,
    default: null,
    unique: true
  },
  tipo_documento: {
    type: String,
    default: 'DNI'
  },
  carnet: {
    type: String,
    uppercase: true,
    unique: true,
    sparse: true
  },
  fecha_ingreso: {
    type: Date,
    default: Date.now
  },
  fecha_baja: Date,
  estado_empresa: {
    type: String,
    trim: true,
    default: estado_empresa.ACTIVO
  },
  nacionalidad: {
    type: String,
    trim: true,
    uppercase: true,
    default: 'PERUANA'
  },
  columnas: [{
    type: String,
    trim: true,
    lowercase: true,
    default: null
  }],
  observacion: {
    type: String,
    default: '-'
  }
}, {
  timestamps: true
});

EmpleadoSchema.plugin(mongoosePaginate);
