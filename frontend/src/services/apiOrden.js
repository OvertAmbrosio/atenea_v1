import { restPrivate } from './requestHelper';

export const getOrdenes = async (toast, {metodo, tipo}) => restPrivate({
  url: 'ordenes', method: 'GET', params: {metodo, tipo}
}, toast);

export const getIndicadores = async (toast, {tipo}) => restPrivate({
  url: 'ordenes/actividades', method: 'GET', params: {tipo}
}, toast);

/**
 * @param {object} body
 * @param {string} body.metodo
 * @param {array} body.ordenes
 * @param {object} body.orden
 */
export const postOrdenes = async ({metodo, ordenes, orden}) => restPrivate({
  url: 'ordenes', method: 'POST', data: { ordenes, metodo, orden}
},true);