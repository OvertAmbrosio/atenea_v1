import { restPrivate } from './requestHelper';

export const getOrdenes = async (toast, {metodo, tipo, codigo_cliente}) => restPrivate({
  url: 'ordenes', method: 'GET', params: {metodo, tipo, codigo_cliente}
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

export const patchOrdenes = async ({metodo, ordenes, bucket, tecnico, gestor, contrata, fecha_cita, estado, observacion}) => restPrivate({
  url: 'ordenes', method: 'PATCH', data: { metodo, ordenes, bucket, tecnico, gestor, contrata, fecha_cita, estado, observacion}
},true);