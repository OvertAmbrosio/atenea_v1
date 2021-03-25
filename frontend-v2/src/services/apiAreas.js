import { restPrivate } from './requestHelper';

/**
 * @param {boolean} toast false si debe buscar sin mostrar avisos
 */
export const getAreas = async (toast) => restPrivate({
  url: 'areas', method: 'GET'
}, toast);

/**
 * @param {object} data 
 * @param {string} data.metodo
 * @param {object} data.data
 */
export const postArea = async (data) => restPrivate({
  url: 'areas', method: 'POST', data
}, true);

/**
 * @param {string} id 
 * @param {object} data 
 * @param {string} data.metodo
 * @param {object} data.data
 */
export const putArea = async (id, data) => restPrivate({
  url: 'areas/' + id, method: 'PUT', data
}, true);
/**
 * 
 * @param {string} id id de la contrata
 * @param {string} metodo metodo a enviar
 */
export const deleteArea = async (id, metodo) => restPrivate({
  url: 'areas/' + id, method: 'DELETE', data: { metodo }
}, true)
