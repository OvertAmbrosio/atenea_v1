export const tipos_usuario = {
  ADMINISTRADOR: 1,
  JEFE_OPERACIONES: 2,
  JEFE_LOGISTICA: 3,
  LIDER_GESTION: 4,
  ASISTENTE_LOGISTICA: 5,
  JEFE_CONTRATA: 6,
  GESTOR: 7,
  ALMACENERO: 8,
  AUDITOR: 9,
  TECNICO: 10
};

export const estado_empresa = {
  ACTIVO: 'Activo',
  SUSPENDIDO: 'Suspendido',
  INACTIVO: 'Inactivo'
};

export const tipos_orden = {
  AVERIAS: 'averiashfc',
  ALTAS: 'altashfc',
  SPEEDY: 'speedy',
  BASICAS: 'basicas'
};

export const estado_asistencia= {
  FALTA: 'F',
  ASISTIO: 'A',
  TARDANZA: 'T',
  DESCANSO: 'D',
  PERMISO: 'P',
  SUSPENDIDO: 'S',
  DESCANSO_MEDICO: 'DM',
  EXAMEN_MEDICO: 'EM',
  VACACIONES: 'V',
  BAJA: 'BAJA',
  GUARDIA: 'GUARDIA'
};

export const tipo_negocio = {
  AVERIAS: 'averias',
  ALTAS: 'altas',
};

export const tipos_negocios = [tipo_negocio.ALTAS,tipo_negocio.AVERIAS]

export const sub_tipo_negocio = {
  GPON: 'gpon',
  HFC: 'hfc',
  COBRE: 'cobre',
  CRITICOS: 'criticos',
  EMPRESAS: 'empresas'
};

export const sub_tipos_negocios = [sub_tipo_negocio.GPON,sub_tipo_negocio.HFC,sub_tipo_negocio.COBRE,sub_tipo_negocio.CRITICOS,sub_tipo_negocio.EMPRESAS];

export const estado_gestor = {
  PENDIENTE: 'pendiente',
  AGENDADO: 'agendado',
  ASIGNADO: 'asignado',
  INICIADO: 'iniciado',
  LIQUIDADO: 'liquidado',
  SUSPENDIDO: 'suspendido',
  CANCELADO: 'cancelado',
  NO_REALIZADO: 'no_realizado',
  MASIVO: 'masivo',
  PEXT: 'pext',
  REMEDY: 'remedy',
  ANULADO: 'anulado'
};


