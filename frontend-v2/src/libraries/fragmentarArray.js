/**
 * @param {array} data array con los objetos a afragmentar
 * @param {number} cantidad cantidad en la que se quiere fragmentar
 */
export default async function fragmentarArray(data=[], cantidad) {
  if (!data && data.length < 0) {
    return [];
  } else {
    let inicio = 0;
    let cantidadAux = cantidad;
    let dataAux = data;
    let resultado = [];
    while (dataAux.length > 0) {
      resultado.push(data.slice(inicio, cantidadAux));
      dataAux = dataAux.slice(0, -cantidad);
      inicio = inicio + cantidad;
      cantidadAux = cantidadAux + cantidad;
    }

   if (resultado.length > 0) {
     return resultado.filter((e) => e && e.length > 0)
   } else {
     return [];
   }
  }
};