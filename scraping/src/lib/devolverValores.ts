export type TOrdenToa = {
  requerimiento?: string,

  codigo_cliente?: string,
  nombre_cliente?: string,
  direccion?: string,
  fecha_cancelado?: string,
  observacion_toa?: string,

  tecnico?: string|null,
  estado?: string,
  bucket?: string,
  subtipo_actividad?: string,
  fecha_cita?: string,
  tipo_agenda?:string,
  motivo_no_realizado: string,
  sla_inicio?: string,
  sla_fin?: string
};

const carnetAdmitido:Array<string> = ['LY','LX']

export function valoresToa(data:any):TOrdenToa {
  return ({
    requerimiento: data['Número de Petición'],

    codigo_cliente: data['Código de Cliente'],
    nombre_cliente: data['Nombre Cliente'],
    direccion: data['Dirección'],
    fecha_cancelado: data['Fecha Hora de Cancelación'],
    observacion_toa: data['Observaciones en TOA'],

    tecnico: carnetAdmitido.includes(String(data['Técnico']).substring(0,2)) ? String(data['Técnico']).substring(0,6) : null,
    estado: data['Estado actividad'],
    bucket: data['Bucket Inicial'],
    subtipo_actividad: data['Subtipo de Actividad'],
    fecha_cita: data['Fecha de Cita'],
    tipo_agenda: data['Time Slot'],
    motivo_no_realizado: data['Motivo no realizado instalación'],
    sla_inicio: data['SLA Inicio'],
    sla_fin: data['SLA Fin']
  })
};

export function valoresRuta(data:any):string {
  if (carnetAdmitido.includes(String(data['Usuario - Iniciado']).substring(0,2))) {
    return String(data['Usuario - Iniciado']).substring(0,6)
  } else {
    return '-';
  };
}