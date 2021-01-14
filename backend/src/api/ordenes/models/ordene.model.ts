import { Schema, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export const OrdenSchema = new Schema({
  tipo: {
    type: String,
    trim: true,
    required: true,
  },
  codigo_zonal: {
    type: String,
    trim: true,
    required: true,
    default: '-'
  },
  codigo_requerimiento: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    default: '-'
  },
  codigo_trabajo: {
    type: String,
    trim: true,
    default: '-'
  },
  codigo_peticion: {
    type: String,
    trim: true,
    default: '-'
  },
  codigo_cliente: {
    type: String,
    trim: true,
    default: '-'
  },
  nombre_cliente: {
    type: String,
    trim: true,
    default: '-'
  },
  codigo_ctr: {
    type: Number,
    trim: true,
    default: '-'
  },
  descripcion_ctr: {
    type: String,
    trim: true,
    default: '-'
  },
  codigo_nodo: {
    type: String,
    trim: true,
    default: '-'
  },
  codigo_troba: {
    type: String,
    trim: true,
    default: '-'
  },
  codigo_incidencia: {
    type: String,
    trim: true,
    default: '-'
  },
  codigo_segmento: {
    type: String,
    trim: true,
    default: '-'
  },
  distrito: {
    type: String,
    trim: true,
    default: '-'
  },
  direccion: {
    type: String,
    trim: true,
    default: '-'
  },
  fecha_asignado:{
    type: Date,
    trim: true,
  },
  fecha_registro:{
    type: Date,
    trim: true,
    required: true
  },
  codigo_motivo: {
    type: String,
    trim: true,
    default: '-'
  },
  detalle_motivo: {
    type: String,
    trim: true,
    default: '-'
  },
  tipo_requerimiento: {
    type: String,
    trim: true,
    default: '-'
  },
  indicador_pai: {
    type: String,
    trim: true,
    default: '-'
  },
  movistar_total: {
    type: String,
    trim: true,
    default: '-'
  },
  detalle_trabajo: {
    type: String,
    trim: true,
    default: '-' 
  },
  telefono_contacto: {
    type: String,
    trim: true,
    default: '-'
  },
  telefono_referencia: {
    type: String,
    trim: true,
    default: '-'
  },
  numero_reiterada: {
    type: String,
    trim: true,
    default: '-'
  },
  tipo_tecnologia: {
    type: String,
    trim: true,
    default: '-'
  },
  infancia: {
    type: Types.ObjectId,
    ref: 'Ordene',
    default: null
  },
  //REGISTROS EN EL SISTEMA
  historial_registro: [{
    fecha_entrada: {
      type: Date,
      default: Date.now
    },
    estado_orden: {
      type: String,
      trim: true,
      default: '-'
    },
    contrata_modificado: {
      type: Schema.Types.ObjectId,
      ref: 'Contrata'
    },
    empleado_modificado: {
      type: Schema.Types.ObjectId,
      ref: 'Empleado'
    },
    usuario_entrada: {
      type: Schema.Types.ObjectId,
      ref: 'Empleado'
    },
    imagenes: [{
      url: String,
      public_id: String,
    }],
    observacion: {
      type: String,
      default: '-'
    },
    grupo_entrada: {
      type: Number,
      required: true,
      default: 0
    }
  }],
  //estados
  estado_toa: {
    type: String,
    trim: true,
    lowercase: true,
    default: '-'
  },
  estado_gestor: {
    type: String,
    trim: true,
    lowercase: true,
    default: 'pendiente'
  },
  estado_tecnico: {//asignado, enviado, aprobado, rechazado
    type: String,
    trim: true,
    lowercase: true,
    default: '-'
  },
  estado_liquidado: {//efectiva, inefectiva, no_corresponde
    type: String,
    lowercase: true,
    trim: true,
    default: '-',
    enum: ['efectiva', 'inefectiva', 'no_corresponde', '-']
  },
  //datos toa
  bucket: {
    type: String,
    trim: true,
    uppercase: true,
    default: '-'
  },
  subtipo_actividad: {
    type: String,
    trim: true,
    default: '-',
  },
  fecha_cita: {
    type: Date,
    trim: true,
    default: null
  },
  fecha_cancelado: {
    type: Date,
    trim: true,
    default: null
  },
  tipo_agenda: {
    type: String,
    trim: true,
    default: null
  },
  motivo_no_realizado: {
    type: String,
    trim: true,
    default: true
  },
  sla_inicio: {
    type: Date,
    trim: true,
    default: null,
  },
  sla_fin: {
    type: Date,
    trim: true,
    default: null,
  },
  observacion_toa: {
    type: String,
    trim: true,
    default: '-'
  },
  //datos de asignacion
  tecnico: {
    type: Types.ObjectId,
    ref: 'Empleado',
  },
  gestor: {
    type: Types.ObjectId,
    ref: 'Empleado',
  },
  auditor: {
    type: Types.ObjectId,
    ref: 'Empleado',
  },
  contrata: {
    type: Types.ObjectId,
    ref: 'Contrata'
  },
  //datos de liquidacion
  tecnico_liquidado: {
    type: Types.ObjectId,
    ref: 'Empleado',
  },
  fecha_liquidado: {
    type: Date,
    default: null,
  },
  tipo_averia: {
    type: String,
    trim: true,
    uppercase: true,
    default: null
  },
  codigo_usuario_liquidado: {
    type: String,
    trim: true,
    default: null
  },
  orden_devuelta: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

OrdenSchema.index({ codigo_requerimiento: 1 }, { unique: true });

OrdenSchema.plugin(mongoosePaginate);
