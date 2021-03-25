import { restPrivate } from './requestHelper';
/**
 * @param {boolean} toast false si debe buscar sin mostrar avisos
 */
export const getCargos = async (toast) => restPrivate({
  url: 'cargos', method: 'GET'
}, toast);

/**
 * @param {object} data 
 * @param {string} data.metodo
 * @param {object} data.data
 * @param {string} data.data.nombre
 * @param {number} data.data.nivel
 */
export const postCargo = async (data) => restPrivate({
  url: 'cargos', method: 'POST', data
}, true);

/**
 * 
 * @param {string} id 
 * @param {object} data 
 * @param {string} data.metodo
 * @param {object} data.data
 * @param {string} data.data.nombre
 * @param {number} data.data.nivel
 */
export const putCargo = async (id, data) => restPrivate({
  url: 'cargos/' + id, method: 'PUT', data
}, true);
/**
 * 
 * @param {string} id id de la contrata
 * @param {string} metodo metodo a enviar
 */
export const deleteCargo = async (id, metodo) => restPrivate({
  url: 'cargos/' + id, method: 'DELETE', data: { metodo }
}, true)
