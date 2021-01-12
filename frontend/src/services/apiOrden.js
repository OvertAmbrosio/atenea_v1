import { restPrivate } from './requestHelper';

export const getOrdenes = async (toast, {metodo, tipo, codigo_cliente, id}) => restPrivate({
  url: 'ordenes', method: 'GET', params: {metodo, tipo, codigo_cliente, id}
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

export const putOrdenes = async ({metodo, ordenes}) => restPrivate({
  url: 'ordenes', method: 'PUT', data: { ordenes, metodo }
},true);

export const patchOrdenes = async ({metodo, ordenes, bucket, tecnico, auditor, gestor, contrata, fecha_cita, estado, observacion}) => restPrivate({
  url: 'ordenes', 
  method: 'PATCH', 
  data: { metodo, ordenes, bucket, tecnico, auditor, gestor, contrata, fecha_cita, estado, observacion}
},true);

export const patchFilesOrdenes = async (data) => restPrivate({
  url: 'ordenes', 
  method: 'PATCH', 
  data, 
  headers: { 'Content-Type': 'multipart/form-data' }
}, true)