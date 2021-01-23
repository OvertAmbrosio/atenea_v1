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
          if (aux !== -1 && obj.createdAt ) {
            const objetoNuevo = nuevoArray[aux];
            const field = moment(obj.createdAt).format('DD-MM');
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
            const field = moment(obj.createdAt).format('DD-MM');
            const objetoNuevo = {
              _id: obj._id,
              tipo_negocio: obj.tecnico.tipo_negocio,
              sub_tipo_negocio: obj.tecnico.sub_tipo_negocio,
              nombre: obj.tecnico.nombre,
              apellidos: obj.tecnico.apellidos,
              gestor: {
                nombre: obj.tecnico.gestor ? obj.tecnico.gestor.nombre : '-',
                apellidos: obj.tecnico.gestor ? obj.tecnico.gestor.apellidos: '-',
                _id: obj.tecnico.gestor ? obj.tecnico.gestor._id: '-',
              },
              auditor: {
                nombre: obj.tecnico.auditor ? obj.tecnico.auditor.nombre : '-',
                apellidos: obj.tecnico.auditor ? obj.tecnico.auditor.apellidos: '-',
                _id: obj.tecnico.auditor ? obj.tecnico.auditor._id: '-',
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
          const field = moment(obj.createdAt).format('DD-MM');
          nuevoArray = [{
            _id: obj._id,
            tipo_negocio: obj.tecnico.tipo_negocio,
            sub_tipo_negocio: obj.tecnico.sub_tipo_negocio,
            nombre: obj.tecnico.nombre,
            apellidos: obj.tecnico.apellidos,
            gestor: {
              nombre: obj.tecnico.gestor ? obj.tecnico.gestor.nombre : '-',
              apellidos: obj.tecnico.gestor ? obj.tecnico.gestor.apellidos: '-',
              _id: obj.tecnico.gestor ? obj.tecnico.gestor._id: '-',
            },
            auditor: {
              nombre: obj.tecnico.auditor ? obj.tecnico.auditor.nombre: '-',
              apellidos: obj.tecnico.auditor ? obj.tecnico.auditor.apellidos: '-',
              _id: obj.tecnico.auditor ? obj.tecnico.auditor._id: '-',
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
        if(obj.estado === 'P') console.log(obj.observacion);
        if (nuevoArray.length > 0) {
          const aux = nuevoArray.findIndex((i) => i.nombre === obj.gestor.nombre && i.apellidos === obj.gestor.apellidos);
          if (aux !== -1 && obj.createdAt ) {
            const objetoNuevo = nuevoArray[aux];
            const field = moment(obj.createdAt).format('DD-MM');
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
            const field = moment(obj.createdAt).format('DD-MM');
            const objetoNuevo = {
              _id: obj._id,
              nombre: obj.gestor.nombre,
              apellidos: obj.gestor.apellidos,
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
          const field = moment(obj.createdAt).format('DD-MM');
          nuevoArray = [{
            _id: obj._id,
            nombre: obj.gestor.nombre,
            apellidos: obj.gestor.apellidos,
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

export async function ordenarAsistenciaAuditor(data=[]) {
  return new Promise((resolve, reject) => {
    try {
      let nuevoArray = [];
      if (data.length === 0 ) return resolve(nuevoArray)
      data.forEach((obj) => {
        if(obj.estado === 'P') console.log(obj.observacion);
        if (nuevoArray.length > 0) {
          const aux = nuevoArray.findIndex((i) => i.nombre === obj.auditor.nombre && i.apellidos === obj.auditor.apellidos);
          if (aux !== -1 && obj.createdAt ) {
            const objetoNuevo = nuevoArray[aux];
            const field = moment(obj.createdAt).format('DD-MM');
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
            const field = moment(obj.createdAt).format('DD-MM');
            const objetoNuevo = {
              _id: obj._id,
              nombre: obj.auditor.nombre,
              apellidos: obj.auditor.apellidos,
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
          const field = moment(obj.createdAt).format('DD-MM');
          nuevoArray = [{
            _id: obj._id,
            nombre: obj.auditor.nombre,
            apellidos: obj.auditor.apellidos,
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
}