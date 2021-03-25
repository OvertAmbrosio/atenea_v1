import { tipoOrdenes } from '../../constants/tipoOrden';
import { pendientesAverias, liquidadasAverias } from './asignarAverias';
import { pendientesAltas, liquidadasAltas } from './asignarAltas';

export default async function asignarValores(obj, tipo, estado, tecnicos) {
  switch (tipo) {
    case tipoOrdenes.AVERIAS:
      if (estado === 1) {
        return await pendientesAverias(obj);
      } else if(estado === 2) {
        return await liquidadasAverias(obj, tecnicos);   
      } else {
        return [];
      }
    case tipoOrdenes.ALTAS:
      if (estado === 1) {
        return await pendientesAltas(obj);
      } else {
        return await liquidadasAltas(obj, tecnicos);   
      }
    default:
      break;
  }
}