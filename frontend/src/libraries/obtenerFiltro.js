/**
 * @param {array} data 
 * @param {string} field 
 */
export async function obtenerFiltroId(data=[], field, persona=false) {
  return new Promise((resolve, reject) => {
    if (data.length === 0) {
      return resolve([]);
    } else {
      let filtrosArray = [];
      let isNull = false;

      try {
        data.forEach((e) => {
          if (e[field] !== undefined && e[field] !== null && e[field]._id && e[field]._id !== null) {
            const i = filtrosArray.findIndex(c => c.value === e[field]._id)
            if (i === -1) {
              filtrosArray.push({
                text: persona ? e[field].nombre + ' ' + e[field].apellidos : e[field].nombre,
                value: e[field]._id
              })
            } 
          } else {
            isNull = true;
          };
        });
        
        if (isNull) {
          return resolve([...filtrosArray, { text: '-', value: '-'}]);
        } else {
          return resolve(filtrosArray);
        };
      } catch (error) {
        return reject(error);
      }
    }
  })
};

export async function obtenerFiltroNombre(data=[], field) {
  return new Promise((resolve, reject) => {
    if (data.length === 0) {
      return resolve([]);
    } else {
      let filtrosArray = [];

      try {
        data.forEach((e) => {
          if (e[field] !== undefined && e[field] !== null) {
            const i = filtrosArray.findIndex(c => c.value === e[field])
            if (i === -1) {
              filtrosArray.push({
                text: e[field],
                value: e[field]
              })
            } 
          };
        });
  
        return resolve(filtrosArray);
      } catch (error) {
        return reject(error);
      }
    }
  })
};