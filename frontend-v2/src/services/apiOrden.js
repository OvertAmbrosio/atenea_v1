import { restPrivate } from './requestHelper';

export const getOrdenes = async (toast, {metodo, tipo, nodos, requerimiento, cliente, fechaInicio, fechaFin }) => restPrivate({
  url: 'ordenes', method: 'GET', params: { metodo, tipo, nodos, requerimiento, cliente, fechaInicio, fechaFin }, headers: { "Content-Type": "application/json" }
}, toast);

export const getOrdenesExportar = async (toast, {metodo, todo, tipo, nodos, ordenes }) => restPrivate({
  url: 'ordenes/exportar', method: 'GET', params: { metodo, todo, tipo, nodos, ordenes }, headers: { "Content-Type": "application/json" }
}, toast);

/**
 * @param {object} body
 * @param {string} body.metodo
 * @param {array} body.ordenes
 */
export const postOrdenes = async ({metodo, ordenes, orden}) => restPrivate({
  url: 'ordenes', method: 'POST', data: { metodo, ordenes, orden}
},true);

export const putOrdenes = async ({metodo, ordenes}) => restPrivate({
  url: 'ordenes', method: 'PUT', data: { ordenes, metodo }
},true);

export const patchOrdenes = async ({metodo, id, ordenes, bucket, tecnico, auditor, gestor, contrata, fecha_cita, estado, observacion}) => restPrivate({
  url: 'ordenes', 
  method: 'PATCH', 
  data: { metodo, id, ordenes, bucket, tecnico, auditor, gestor, contrata, fecha_cita, estado, observacion}
},true);

export const patchFilesOrdenes = async (data) => restPrivate({
  url: 'ordenes', 
  method: 'PATCH', 
  data, 
  headers: { 'Content-Type': 'multipart/form-data' }
}, true)