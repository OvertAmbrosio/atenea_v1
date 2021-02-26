import { restPrivate } from './requestHelper';

/**
 * @param {object} parametros 
 * @param {number} parametros.page
 * @param {number} parametros.limit
 * @param {string} parametros.metodo
 * @param {Date} parametros.fecha_inicio
 * @param {Date} parametros.fecha_fin
 */
export const getAsistencias = async ({metodo, tipo, page, limit, fecha_inicio, fecha_fin}) => restPrivate({
  url: 'asistencia', method: 'GET', params: {metodo, tipo, page, limit, fecha_inicio, fecha_fin}
}, true);
/**
 * @param {object} parametros 
 * @param {string} parametros.id
 * @param {string} parametros.tipo
 * @param {string} parametros.estado
 * @param {Date} parametros.fecha
 * @param {string} parametros.observacion
 */
export const postAsistencias = async ({id, tipo, estado, fecha, observacion}) => restPrivate({
  url: 'asistencia', method: 'POST', data: {id, tipo, estado, fecha, observacion}
}, true)

export const patchAsistencia = async (data) => restPrivate({
  url: 'asistencia', method: 'PATCH', data
}, true)