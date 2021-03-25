import { Schema } from 'mongoose';
import { estado_asistencia } from 'src/constants/enum';

export const AsistenciaSchema = new Schema({
  tipo: {
    type: String,
    lowercase: true,
    trim: true,
    default: 'tecnico'
  },
  tecnico: {
    type: Schema.Types.ObjectId,
    ref: 'Empleado'
  },
  gestor: {
    type: Schema.Types.ObjectId,
    ref: 'Empleado'
  },
  auditor: {
    type: Schema.Types.ObjectId,
    ref: 'Empleado'
  },
  estado: {
    type: String,
    trim: true,
    enum: [
      estado_asistencia.ASISTIO,
      estado_asistencia.TARDANZA,
      estado_asistencia.DESCANSO,
      estado_asistencia.DESCANSO_MEDICO,
      estado_asistencia.EXAMEN_MEDICO,
      estado_asistencia.FALTA,
      estado_asistencia.PERMISO,
      estado_asistencia.SUSPENDIDO,
      estado_asistencia.VACACIONES,
      estado_asistencia.BAJA,
      estado_asistencia.GUARDIA
    ],
    default: 'F'
  },
  iniciado: {
    type: Boolean,
    default: false,
  },
  fecha_iniciado: {
    type: Date,
    default: null
  },
  fecha_registro: {
    type: Date,
    default: null
  },
  observacion: {
    type: String,
    trim: true,
    default: '-'
  }
}, {
  timestamps: true
});
