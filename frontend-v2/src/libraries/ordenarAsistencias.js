import moment from 'moment';
import { niveles } from '../constants/cargos';
/**
 * @param {number} nivel
 * @param {array} data 
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default function(nivel, data){
  if (nivel === niveles.OPERATIVO) {
    return ordenarTecnicos(data);
  } else if (nivel === niveles.FUERA_SISTEMA) {
    return ordenarOtros(data);
  } else {
    return ordenarDefault(data);
  };
};

function ordenarDefault(data=[]) {
  try {
    let nuevoArray = [];
    if (data.length === 0 ) return nuevoArray
    data.forEach((obj) => {
      if (nuevoArray.length > 0) {
        const aux = nuevoArray.findIndex((i) => i.empleado && i.empleado.nombre === obj.empleado.nombre && i.empleado.apellidos === obj.empleado.apellidos);
        if (aux !== -1 && obj.fecha_asistencia ) {
          const objetoNuevo = nuevoArray[aux];
          const field = moment(obj.fecha_asistencia).format('DD-MM');
          nuevoArray[aux] = {
            ...objetoNuevo,
            [field]: {
              _id: obj._id,
              estado: obj.estado,
              iniciado: obj.iniciado,
              fecha_iniciado: obj.fecha_iniciado,
              historial_registro: obj.historial_registro
            }
          };
        } else {
          const field = moment(obj.fecha_asistencia).format('DD-MM');
          const objetoNuevo = {
            _id: obj._id,
            estado_empresa: obj.empleado.estado_empresa,
            empleado: obj.empleado,
            cargo: obj.cargo,
            idEmpleado: obj.empleado._id,
            [field]: {
              _id: obj._id,
              estado: obj.estado,
              iniciado: obj.iniciado,
              fecha_iniciado: obj.fecha_iniciado,
              historial_registro: obj.historial_registro
            }
          };
          nuevoArray.push(objetoNuevo);
        }
      } else {
        const field = moment(obj.fecha_asistencia).format('DD-MM');
        nuevoArray = [{
          _id: obj._id,
          estado_empresa: obj.empleado.estado_empresa,
          empleado: obj.empleado,
          cargo: obj.cargo,
          idEmpleado: obj.empleado._id,
          [field]: {
            _id: obj._id,
            estado: obj.estado,
            iniciado: obj.iniciado,
            fecha_iniciado: obj.fecha_iniciado,
            historial_registro: obj.historial_registro
          }
        }];
      };
    });
    return nuevoArray;
  } catch (error) {
    console.error(error);
    return [];
  }
};

function ordenarTecnicos(data=[]) {
  try {
    let nuevoArray = [];
    if (data.length === 0 ) return nuevoArray
    data.forEach((obj) => {
      if (nuevoArray.length > 0) {
        const aux = nuevoArray.findIndex((i) => i.empleado.nombre === obj.empleado.nombre && i.empleado.apellidos === obj.empleado.apellidos);
        if (aux !== -1 && obj.fecha_asistencia ) {
          const objetoNuevo = nuevoArray[aux];
          const field = moment(obj.fecha_asistencia).format('DD-MM');
          nuevoArray[aux] = {
            ...objetoNuevo,
            [field]: {
              _id: obj._id,
              estado: obj.estado,
              iniciado: obj.iniciado,
              fecha_iniciado: obj.fecha_iniciado,
              historial_registro: obj.historial_registro
            }
          };
        } else {
          const field = moment(obj.fecha_asistencia).format('DD-MM');
          const objetoNuevo = {
            _id: obj._id,
            estado_empresa: obj.empleado.estado_empresa,
            tipo_negocio: obj.empleado.tipo_negocio,
            sub_tipo_negocio: obj.empleado.sub_tipo_negocio,
            empleado: obj.empleado,
            carnet: obj.empleado.carnet,
            dni: obj.empleado.numero_documento,
            idEmpleado: obj.empleado._id,
            gestor: {
              nombre: obj.empleado.gestor ? obj.empleado.gestor.nombre : '-',
              apellidos: obj.empleado.gestor ? obj.empleado.gestor.apellidos: '-',
              _id: obj.empleado.gestor ? obj.empleado.gestor._id: '-',
            },
            auditor: {
              nombre: obj.empleado.auditor ? obj.empleado.auditor.nombre : '-',
              apellidos: obj.empleado.auditor ? obj.empleado.auditor.apellidos: '-',
              _id: obj.empleado.auditor ? obj.empleado.auditor._id: '-',
            },
            contrata: {
              nombre: obj.empleado.contrata ? obj.empleado.contrata.nombre : '-',
              _id: obj.empleado.contrata ? obj.empleado.contrata._id: '-',
            },
            [field]: {
              _id: obj._id,
              estado: obj.estado,
              iniciado: obj.iniciado,
              fecha_iniciado: obj.fecha_iniciado,
              historial_registro: obj.historial_registro
            }
          };
          nuevoArray.push(objetoNuevo);
        }
      } else {
        const field = moment(obj.fecha_asistencia).format('DD-MM');
        nuevoArray = [{
          _id: obj._id,
          estado_empresa: obj.empleado.estado_empresa,
          tipo_negocio: obj.empleado.tipo_negocio,
          sub_tipo_negocio: obj.empleado.sub_tipo_negocio,
          empleado: obj.empleado,
          carnet: obj.empleado.carnet,
          dni: obj.empleado.numero_documento,
          idEmpleado: obj.empleado._id,
          gestor: {
            nombre: obj.empleado.gestor ? obj.empleado.gestor.nombre : '-',
            apellidos: obj.empleado.gestor ? obj.empleado.gestor.apellidos: '-',
            _id: obj.empleado.gestor ? obj.empleado.gestor._id: '-',
          },
          auditor: {
            nombre: obj.empleado.auditor ? obj.empleado.auditor.nombre: '-',
            apellidos: obj.empleado.auditor ? obj.empleado.auditor.apellidos: '-',
            _id: obj.empleado.auditor ? obj.empleado.auditor._id: '-',
          },
          contrata: {
            nombre: obj.empleado.contrata ? obj.empleado.contrata.nombre : '-',
            _id: obj.empleado.contrata ? obj.empleado.contrata._id: '-',
          },
          [field]: {
            _id: obj._id,
            estado: obj.estado,
            iniciado: obj.iniciado,
            fecha_iniciado: obj.fecha_iniciado,
            historial_registro: obj.historial_registro
          }
        }];
      };
    });
    return nuevoArray;
  } catch (error) {
    console.error(error);
    return [];
  }
};

function ordenarOtros(data=[]) {
  try {
    let nuevoArray = [];
    if (data.length === 0 ) return nuevoArray
    data.forEach((obj) => {
      if (nuevoArray.length > 0) {
        const aux = nuevoArray.findIndex((i) => i.empleado && i.empleado.nombre === obj.empleado.nombre && i.empleado.apellidos === obj.empleado.apellidos);
        if (aux !== -1 && obj.fecha_asistencia ) {
          const objetoNuevo = nuevoArray[aux];
          const field = moment(obj.fecha_asistencia).format('DD-MM');
          nuevoArray[aux] = {
            ...objetoNuevo,
            [field]: {
              _id: obj._id,
              estado: obj.estado,
              iniciado: obj.iniciado,
              fecha_iniciado: obj.fecha_iniciado,
              historial_registro: obj.historial_registro
            }
          };
        } else {
          const field = moment(obj.fecha_asistencia).format('DD-MM');
          const objetoNuevo = {
            _id: obj._id,
            estado_empresa: obj.empleado.estado_empresa,
            empleado: obj.empleado,
            tecnico: obj.empleado ? obj.empleado.tecnico : null,
            cargo: obj.cargo,
            idEmpleado: obj.empleado._id,
            [field]: {
              _id: obj._id,
              estado: obj.estado,
              iniciado: obj.iniciado,
              fecha_iniciado: obj.fecha_iniciado,
              historial_registro: obj.historial_registro
            }
          };
          nuevoArray.push(objetoNuevo);
        }
      } else {
        const field = moment(obj.fecha_asistencia).format('DD-MM');
        nuevoArray = [{
          _id: obj._id,
          estado_empresa: obj.empleado.estado_empresa,
          empleado: obj.empleado,
          tecnico: obj.empleado ? obj.empleado.tecnico : null,
          cargo: obj.cargo,
          idEmpleado: obj.empleado._id,
          [field]: {
            _id: obj._id,
            estado: obj.estado,
            iniciado: obj.iniciado,
            fecha_iniciado: obj.fecha_iniciado,
            historial_registro: obj.historial_registro
          }
        }];
      };
    });
    return nuevoArray;
  } catch (error) {
    console.error(error);
    return [];
  }
};