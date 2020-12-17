export type TOrdenToa = {
  requerimiento?: string,
  tecnico?: string|null,
  estado?: string,
  bucket?: string,
  subtipo_actividad?: string,
  fecha_cita?: string,
  sla_inicio?: string,
  sla_fin?: string
};

const carnetAdmitido = ['LY','LX']

export function valoresToa(data:any):TOrdenToa {
  return ({
    requerimiento: data['Número de Petición'],
    tecnico: carnetAdmitido.includes(String(data['Técnico']).substring(0,2)) ? String(data['Técnico']).substring(0,6) : null,
    estado: data['Estado actividad'],
    bucket: data['Bucket Inicial'],
    subtipo_actividad: data['Subtipo de Actividad'],
    fecha_cita: data['Fecha de Cita'],
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