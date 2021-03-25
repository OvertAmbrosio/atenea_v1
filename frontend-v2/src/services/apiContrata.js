import { restPrivate } from './requestHelper';
/**
 * @param {boolean} toast false si debe buscar sin mostrar avisos
 * @param {string} metodo
 */
export const getContratas = async (toast, metodo) => restPrivate({
  url: 'contratas', method: 'GET', params: {metodo}
}, toast);

/**
 * @param {object} data 
 * @param {string} data.metodo
 * @param {object} data.contrata
 */
export const postContrata = async ({ metodo, contrata }) => restPrivate({
  url: 'contratas', method: 'POST', data: { metodo, contrata }
}, true);

/**
 * 
 * @param {string} id 
 * @param {object} data 
 * @param {string} data.metodo
 * @param {object} data.contrata
 */
export const putContrata = async (id, { metodo, contrata }) => restPrivate({
  url: 'contratas/' + id, method: 'PUT', data: { metodo, contrata } 
}, true);
/**
 * 
 * @param {string} id id de la contrata
 * @param {object} data objeto a enviar
 * @param {bool} data.activo
 * @param {Date} data.fecha_baja
 */
export const patchContrata = async (id, data) => restPrivate({
  url: 'contratas/' + id, method: 'PATCH', data
}, true)
