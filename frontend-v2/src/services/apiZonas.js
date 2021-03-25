import { restPrivate } from './requestHelper';

/**
 * @param {boolean} toast false si debe buscar sin mostrar avisos
 */
export const getZonas = async (toast) => restPrivate({
  url: 'zonas', method: 'GET'
}, toast);

/**
 * @param {object} data 
 * @param {string} data.metodo
 * @param {object} data.data
 */
export const postZona = async (data) => restPrivate({
  url: 'zonas', method: 'POST', data
}, true);

/**
 * @param {string} id 
 * @param {object} data 
 * @param {string} data.metodo
 * @param {object} data.data
 */
export const putZona = async (id, data) => restPrivate({
  url: 'zonas/' + id, method: 'PUT', data
}, true);
/**
 * 
 * @param {string} id id de la contrata
 * @param {string} metodo metodo a enviar
 */
export const deleteZona = async (id, metodo) => restPrivate({
  url: 'zonas/' + id, method: 'DELETE', data: { metodo }
}, true)
