import { restPrivate } from './requestHelper';

/**
 * @param {boolean} toast false si debe buscar sin mostrar avisos
 */
export const getTipoEmpleados = async (toast) => restPrivate({
  url: 'tipoempleados', method: 'GET'
}, toast);

/**
 * @param {object} data 
 * @param {string} data.metodo
 * @param {object} data.data
 * @param {string} data.data.nombre
 * @param {string} data.data.acron
 */
export const postTipoEmpleado = async (data) => restPrivate({
  url: 'tipoempleados', method: 'POST', data
}, true);

/**
 * @param {string} id 
 * @param {object} data 
 * @param {string} data.metodo
 * @param {object} data.data
 * @param {string} data.data.nombre
 * @param {string} data.data.acron
 */
export const putTipoEmpleado = async (id, data) => restPrivate({
  url: 'tipoempleados/' + id, method: 'PUT', data
}, true);
/**
 * 
 * @param {string} id id de la contrata
 * @param {string} metodo metodo a enviar
 */
export const deleteTipoEmpleado = async (id, metodo) => restPrivate({
  url: 'tipoempleados/' + id, method: 'DELETE', data: { metodo }
}, true)
