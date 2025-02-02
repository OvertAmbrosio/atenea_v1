import moment from 'moment';
/**
 * @param {array} data 
 */
export async function ordenarAsistencia(data=[]) {
  return new Promise((resolve, reject) => {
    try {
      let nuevoArray = [];
      if (data.length === 0 ) return resolve(nuevoArray)
      data.forEach((obj) => {
        if (nuevoArray.length > 0) {
          const aux = nuevoArray.findIndex((i) => i.nombre === obj.tecnico.nombre && i.apellidos === obj.tecnico.apellidos);
          if (aux !== -1 && obj.fecha_registro ) {
            const objetoNuevo = nuevoArray[aux];
            const field = moment(obj.fecha_registro).format('DD-MM');
            nuevoArray[aux] = {
              ...objetoNuevo,
              [field]: {
                _id: obj._id,
                estado: obj.estado,
                observacion: obj.observacion,
                iniciado: obj.iniciado,
                fecha_iniciado: obj.fecha_iniciado
              }
            };
          } else {
            const field = moment(obj.fecha_registro).format('DD-MM');
            const objetoNuevo = {
              _id: obj._id,
              estado_empresa: obj.tecnico.estado_empresa,
              tipo_negocio: obj.tecnico.tipo_negocio,
              sub_tipo_negocio: obj.tecnico.sub_tipo_negocio,
              nombre: obj.tecnico.nombre,
              apellidos: obj.tecnico.apellidos,
              carnet: obj.tecnico.carnet,
              dni: obj.tecnico.numero_documento,
              tipo: obj.tipo,
              idEmpleado: obj.tecnico._id,
              gestor: {
                nombre: obj.tecnico.gestor ? obj.tecnico.gestor.nombre : '-',
                apellidos: obj.tecnico.gestor ? obj.tecnico.gestor.apellidos: '-',
                carnet: obj.tecnico.gestor ? obj.tecnico.gestor.carnet: '-',
                _id: obj.tecnico.gestor ? obj.tecnico.gestor._id: '-',
              },
              auditor: {
                nombre: obj.tecnico.auditor ? obj.tecnico.auditor.nombre : '-',
                apellidos: obj.tecnico.auditor ? obj.tecnico.auditor.apellidos: '-',
                _id: obj.tecnico.auditor ? obj.tecnico.auditor._id: '-',
              },
              contrata: {
                nombre: obj.tecnico.contrata ? obj.tecnico.contrata.nombre : '-',
                _id: obj.tecnico.contrata ? obj.tecnico.contrata._id: '-',
              },
              observacion: obj.observacion,
              [field]: {
                _id: obj._id,
                estado: obj.estado,
                observacion: obj.observacion,
                iniciado: obj.iniciado,
                fecha_iniciado: obj.fecha_iniciado
              }
            };
            nuevoArray.push(objetoNuevo);
          }
        } else {
          const field = moment(obj.fecha_registro).format('DD-MM');
          nuevoArray = [{
            _id: obj._id,
            estado_empresa: obj.tecnico.estado_empresa,
            tipo_negocio: obj.tecnico.tipo_negocio,
            sub_tipo_negocio: obj.tecnico.sub_tipo_negocio,
            nombre: obj.tecnico.nombre,
            apellidos: obj.tecnico.apellidos,
            carnet: obj.tecnico.carnet,
            dni: obj.tecnico.numero_documento,
            tipo: obj.tipo,
            idEmpleado: obj.tecnico._id,
            gestor: {
              nombre: obj.tecnico.gestor ? obj.tecnico.gestor.nombre : '-',
              apellidos: obj.tecnico.gestor ? obj.tecnico.gestor.apellidos: '-',
              carnet: obj.tecnico.gestor ? obj.tecnico.gestor.carnet: '-',
              _id: obj.tecnico.gestor ? obj.tecnico.gestor._id: '-',
            },
            auditor: {
              nombre: obj.tecnico.auditor ? obj.tecnico.auditor.nombre: '-',
              apellidos: obj.tecnico.auditor ? obj.tecnico.auditor.apellidos: '-',
              _id: obj.tecnico.auditor ? obj.tecnico.auditor._id: '-',
            },
            contrata: {
              nombre: obj.tecnico.contrata ? obj.tecnico.contrata.nombre : '-',
              _id: obj.tecnico.contrata ? obj.tecnico.contrata._id: '-',
            },
            observacion: obj.observacion,
            [field]: {
              _id: obj._id,
              estado: obj.estado,
              observacion: obj.observacion,
              iniciado: obj.iniciado,
              fecha_iniciado: obj.fecha_iniciado
            }
          }];
        };
      });
      return resolve(nuevoArray);
    } catch (error) {
      return reject(error);
    }
  });
};

export async function ordenarAsistenciaGestor(data=[]) {
  return new Promise((resolve, reject) => {
    try {
      let nuevoArray = [];
      if (data.length === 0 ) return resolve(nuevoArray)
      data.forEach((obj) => {
        if (nuevoArray.length > 0) {
          const aux = nuevoArray.findIndex((i) => i.nombre === obj.gestor.nombre && i.apellidos === obj.gestor.apellidos);
          if (aux !== -1 && obj.fecha_registro ) {
            const objetoNuevo = nuevoArray[aux];
            const field = moment(obj.fecha_registro).format('DD-MM');
            nuevoArray[aux] = {
              ...objetoNuevo,
              [field]: {
                _id: obj._id,
                estado: obj.estado,
                observacion: obj.observacion,
                iniciado: obj.iniciado,
                fecha_iniciado: obj.fecha_iniciado
              }
            };
          } else {
            const field = moment(obj.fecha_registro).format('DD-MM');
            const objetoNuevo = {
              _id: obj._id,
              estado_empresa: obj.gestor.estado_empresa,
              nombre: obj.gestor.nombre,
              apellidos: obj.gestor.apellidos,
              observacion: obj.observacion,
              tipo: obj.tipo,
              idEmpleado: obj.gestor._id,
              [field]: {
                _id: obj._id,
                estado: obj.estado,
                observacion: obj.observacion,
                iniciado: obj.iniciado,
                fecha_iniciado: obj.fecha_iniciado
              }
            };
            nuevoArray.push(objetoNuevo);
          }
        } else {
          const field = moment(obj.fecha_registro).format('DD-MM');
          nuevoArray = [{
            _id: obj._id,
            estado_empresa: obj.gestor.estado_empresa,
            nombre: obj.gestor.nombre,
            apellidos: obj.gestor.apellidos,
            observacion: obj.observacion,
            tipo: obj.tipo,
            idEmpleado: obj.gestor._id,
            [field]: {
              _id: obj._id,
              estado: obj.estado,
              observacion: obj.observacion,
              iniciado: obj.iniciado,
              fecha_iniciado: obj.fecha_iniciado
            }
          }];
        };
      });
      return resolve(nuevoArray);
    } catch (error) {
      return reject(error);
    }
  });
};

export async function ordenarAsistenciaAuditor(data=[]) {
  return new Promise((resolve, reject) => {
    try {
      let nuevoArray = [];
      if (data.length === 0 ) return resolve(nuevoArray)
      data.forEach((obj) => {
        if (nuevoArray.length > 0) {
          const aux = nuevoArray.findIndex((i) => i.nombre === obj.auditor.nombre && i.apellidos === obj.auditor.apellidos);
          if (aux !== -1 && obj.fecha_registro ) {
            const objetoNuevo = nuevoArray[aux];
            const field = moment(obj.fecha_registro).format('DD-MM');
            nuevoArray[aux] = {
              ...objetoNuevo,
              [field]: {
                _id: obj._id,
                estado: obj.estado,
                observacion: obj.observacion,
                iniciado: obj.iniciado,
                fecha_iniciado: obj.fecha_iniciado
              }
            };
          } else {
            const field = moment(obj.fecha_registro).format('DD-MM');
            const objetoNuevo = {
              _id: obj._id,
              estado_empresa: obj.auditor.estado_empresa,
              nombre: obj.auditor.nombre,
              apellidos: obj.auditor.apellidos,
              observacion: obj.observacion,
              tipo: obj.tipo,
              idEmpleado: obj.auditor._id,
              [field]: {
                _id: obj._id,
                estado: obj.estado,
                observacion: obj.observacion,
                iniciado: obj.iniciado,
                fecha_iniciado: obj.fecha_iniciado
              }
            };
            nuevoArray.push(objetoNuevo);
          }
        } else {
          const field = moment(obj.fecha_registro).format('DD-MM');
          nuevoArray = [{
            _id: obj._id,
            estado_empresa: obj.auditor.estado_empresa,
            nombre: obj.auditor.nombre,
            apellidos: obj.auditor.apellidos,
            observacion: obj.observacion,
            tipo: obj.tipo,
            idEmpleado: obj.auditor._id,
            [field]: {
              _id: obj._id,
              estado: obj.estado,
              observacion: obj.observacion,
              iniciado: obj.iniciado,
              fecha_iniciado: obj.fecha_iniciado
            }
          }];
        };
      });
      return resolve(nuevoArray);
    } catch (error) {
      return reject(error);
    }
  });
}