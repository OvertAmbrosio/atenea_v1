import moment from 'moment';

export function numeroFecha(numeroDeDias, utc){
  var diasDesde1900 = 25567 + 2;
  // 86400 es el número de segundos en un día, luego multiplicamos por 1000 para obtener milisegundos.
  let fecha = new Date((numeroDeDias - diasDesde1900) * 86400 * 1000);
  //false para los valores que de frente suban
  //true para los valores que necesitan tratamiento
  if (utc) {
    return fecha;
  } else {
    return (new Date(fecha.setHours(fecha.getHours() + 5)))
  }
};

/**
 * @param {Date} fecha 
 * @param {string} hora 
 */
export function unirHoraFecha(fecha, hora) {
  if (!Number(fecha)) {
    return null;
  }
  let dia = moment(fecha).format('DD');
  let mes = moment(fecha).format('MM');
  let anio = moment(fecha).format('YYYY');
  let fechaCompleta = new Date(anio + '-' + mes + '-' + dia + `T${hora}.000Z`);

  return new Date(fechaCompleta.setHours(fechaCompleta.getHours() + 5));
}