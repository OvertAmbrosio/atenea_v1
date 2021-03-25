import { restPrivate } from './requestHelper';

/**
 * @param {boolean} toast false si debe buscar sin mostrar avisos
 * @param {object} metodo
 * @param {string} metodo.metodo
 */
export const getEmpleados = async (toast, metodo) => restPrivate({
  url: 'empleados', method: 'GET', params: metodo
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
 * @param {string} data.negocio
 * @param {string} data.subNegocio
 * @param {string} data.columnas
 * @param {Array} data.tecnicos
 * @param {Array} data.empleados
 * @param {string} data.tecnico
 * @param {array} data.vistas
 * @param {string} data.password
 * @param {string} data.newPassword1
 * @param {string} data.newPassword2
 */
export const patchEmpleados = async (
  toast, { id, metodo, cargo, fecha_baja, estado_empresa, gestor, auditor,negocio, subNegocio, columnas, tecnico, tecnicos, empleados, vistas, password, newPassword1, newPassword2 }
) => restPrivate({
  url: 'empleados', 
  method: 'PATCH', 
  data: { id, metodo, cargo, fecha_baja, estado_empresa, gestor, auditor,negocio, subNegocio, columnas, tecnico, tecnicos, empleados, vistas, password, newPassword1, newPassword2 }
}, toast);


/**
 * @param {object} data
 * @param {string} data.metodo
 * @param {string} data.email
 * @param {object} data.empleado 
 */
export const postEmpleados = async ({metodo, email, empleado}) => restPrivate({
  url: 'empleados', method: 'POST', data: { metodo, email, empleado }
}, true);

/**
 * @param {string} id id del empleado
 * @param {object} data objeto a actualizar
 * @param {string} data.metodo
 * @param {string} data.email
 * @param {object} data.empleado
 */
export const putEmpleados = async (id, { metodo, email, empleado }) => restPrivate({
  url: 'empleados/' + id, method: 'PUT', data: { metodo, email, empleado }
}, true);

