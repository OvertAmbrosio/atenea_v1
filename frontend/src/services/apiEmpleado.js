import { restPrivate } from './requestHelper';

/**
 * @param {boolean} toast false si debe buscar sin mostrar avisos
 * @param {object} parametros 
 * @param {number} parametros.page
 * @param {number} parametros.limit
 * @param {string} parametros.metodo
 * @param {string} parametros.idFiltro
 */
export const getEmpleados = async (toast, {metodo, page, limit, idFiltro}) => restPrivate({
  url: 'empleados', method: 'GET', params: {metodo, page, limit, idFiltro}
}, toast);

/**
 * @param {string} value 
 * @param {string} field 
 */
export const buscarEmpleado = async (value, field) => restPrivate({
  url: 'empleados/buscar', method: 'GET', params: { value, field }
}, true);

/**
 * 
 * @param {boolean} toast validar si mostrará avisos
 * @param {object} data
 * @param {string} data.id
 * @param {string} data.metodo el metodo
 * @param {number} data.cargo cargo a modificar
 * @param {Date} data.fecha_baja fecha de baja
 * @param {number} data.estado_empresa estado dentro de la empresa
 * @param {string} data.gestor
 * @param {string[]} data.tecnicos
 */
export const patchEmpleados = async (
  toast, { id, metodo, cargo, fecha_baja, estado_empresa, gestor, auditor, tecnicos }
) => restPrivate({
  url: 'empleados', 
  method: 'PATCH', 
  data: { id, metodo, cargo, fecha_baja, estado_empresa, gestor, auditor, tecnicos }
}, toast);


/**
 * @param {object} data 
 */
export const postEmpleados = async (data) => restPrivate({
  url: 'empleados', method: 'POST', data
}, true);

/**
 * @param {string} id id del empleado
 * @param {object} data objeto a actualizar
 */
export const putEmpleados = async (id, data) => restPrivate({
  url: 'empleados/' + id, method: 'PUT', data
}, true);

