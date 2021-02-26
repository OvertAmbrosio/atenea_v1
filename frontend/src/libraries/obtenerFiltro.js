import moment from "moment";

/**
 * @param {array} data 
 * @param {string} field 
 */
export function obtenerFiltroId(data=[], field, persona=false) {
  if (data.length === 0) {
    return ([]);
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
        return ([...filtrosArray, { text: '-', value: '-'}]);
      } else {
        return filtrosArray;
      };
    } catch (error) {
      console.log(error);
      return [];
    }
  };
};

export function obtenerFiltroNombre(data=[], field) {
  if (data.length === 0) {
    return [];
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
      return (filtrosArray);
    } catch (error) {
      console.log(error);
      return ([]);
    }
  }
};

export function obtenerFiltroFecha(data=[], field) {
  if (data.length === 0) {
    return ([]);
  } else {
    let filtrosArray = [];
    try {
      data.forEach((e) => {
        if (e[field] !== undefined && e[field] !== null) {
          const i = filtrosArray.findIndex(c => c.value === moment(e[field]).format('DD/MM/YY'))
          if (i === -1) {
            filtrosArray.push({
              text: moment(e[field]).format('DD/MM/YY'),
              value: moment(e[field]).format('DD/MM/YY')
            })
          } 
        };
      });
      filtrosArray.push({text: '-', value: '-'})
      return (filtrosArray);
    } catch (error) {
      console.log(error);
      return ([]);
    }
  }
};