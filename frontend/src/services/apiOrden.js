import { restPrivate } from './requestHelper';

export const getOrdenes = async (toast, {metodo, tipo, codigo_cliente, id, todo, id_ordenes, fechaInicio, fechaFin }) => restPrivate({
  url: 'ordenes', method: 'GET', params: { metodo, tipo, todo, codigo_cliente, id, id_ordenes, fechaInicio, fechaFin }, headers: { "Content-Type": "application/json" }
}, toast);

/**
 * @param {object} body
 * @param {string} body.metodo
 * @param {array} body.ordenes
 * @param {array} body.ordenesExternas
 * @param {object} body.orden
 */
export const postOrdenes = async ({metodo, ordenes, ordenesExternas, orden}) => restPrivate({
  url: 'ordenes', method: 'POST', data: { ordenes, ordenesExternas, metodo, orden}
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