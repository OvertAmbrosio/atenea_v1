import { restPrivate } from './requestHelper';
/**
 * @param {boolean} toast false si debe buscar sin mostrar avisos
 */
export const getVistas = async (toast) => restPrivate({
  url: 'vistas', method: 'GET'
}, toast);

/**
 * @param {object} data 
 * @param {string} data.metodo
 * @param {object} data.data
 * @param {string} data.data.titulo
 * @param {string} data.data.ruta
 * @param {array} data.data.cargos
 * @param {array} data.data.tipos_empleado
 * @param {array} data.data.areas
 */
export const postVista = async (data) => restPrivate({
  url: 'vistas', method: 'POST', data
}, true);

/**
 * 
 * @param {string} id 
 * @param {object} data 
 * @param {string} data.metodo
 * @param {object} data.data
 * @param {string} data.data.titulo
 * @param {string} data.data.ruta
 * @param {array} data.data.cargos
 * @param {array} data.data.tipos_empleado
 * @param {array} data.data.areas
 */
export const putVista = async (id, data) => restPrivate({
  url: 'vistas/' + id, method: 'PUT', data
}, true);
/**
 * 
 * @param {string} id id de la contrata
 * @param {string} metodo metodo a enviar
 */
export const deleteVista = async (id, metodo) => restPrivate({
  url: 'vistas/' + id, method: 'DELETE', data: { metodo }
}, true)
