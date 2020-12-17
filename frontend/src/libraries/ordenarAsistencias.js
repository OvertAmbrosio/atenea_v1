import moment from 'moment';
/**
 * @param {array} data 
 */
export default async function ordenarAsistencia(data=[]) {
  return new Promise((resolve, reject) => {
    try {
      let nuevoArray = [];
      if (data.length === 0 ) return resolve(nuevoArray)
      data.forEach((obj) => {
        if (nuevoArray.length > 0) {
          const aux = nuevoArray.findIndex((i) => i.nombre === obj.tecnico.nombre && i.apellidos === obj.tecnico.apellidos);
          if (aux !== -1 && obj.createdAt ) {
            const objetoNuevo = nuevoArray[aux];
            let field = moment(obj.createdAt).format('DD-MM');
            nuevoArray[aux] = {
              ...objetoNuevo,
              [field]: {
                estado: obj.estado,
                observacion: obj.observacion,
                iniciado: obj.iniciado,
                fecha_iniciado: obj.fecha_iniciado
              }
            };
          } else {
            let field = moment(obj.createdAt).format('DD-MM');
            const objetoNuevo = {
              _id: obj._id,
              nombre: obj.tecnico.nombre,
              apellidos: obj.tecnico.apellidos,
              gestor: {
                nombre: obj.tecnico.gestor !== undefined && obj.tecnico.gestor !== null ? obj.tecnico.gestor.nombre + ' ' + obj.tecnico.gestor.apellidos: '-',
                _id: obj.tecnico.gestor !== undefined && obj.tecnico.gestor !== null ? obj.tecnico.gestor._id: '-',
              },
              auditor: {
                nombre: obj.tecnico.auditor !== undefined ? obj.tecnico.auditor.nombre + ' ' + obj.tecnico.auditor.apellidos: '-',
                _id: obj.tecnico.auditor !== undefined ? obj.tecnico.auditor._id: '-',
              },
              observacion: obj.observacion,
              [field]: {
                estado: obj.estado,
                observacion: obj.observacion,
                iniciado: obj.iniciado,
                fecha_iniciado: obj.fecha_iniciado
              }
            };
            nuevoArray.push(objetoNuevo);
          }
        } else {
          let field = moment(obj.createdAt).format('DD-MM');
          nuevoArray = [{
            _id: obj._id,
            nombre: obj.tecnico.nombre,
            apellidos: obj.tecnico.apellidos,
            gestor: {
              nombre: obj.tecnico.gestor !== undefined ? obj.tecnico.gestor.nombre + ' ' + obj.tecnico.gestor.apellidos: '-',
              _id: obj.tecnico.gestor !== undefined ? obj.tecnico.gestor._id: '-',
            },
            auditor: {
              nombre: obj.tecnico.auditor !== undefined ? obj.tecnico.auditor.nombre + ' ' + obj.tecnico.auditor.apellidos: '-',
              _id: obj.tecnico.auditor !== undefined ? obj.tecnico.auditor._id: '-',
            },
            observacion: obj.observacion,
            [field]: {
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