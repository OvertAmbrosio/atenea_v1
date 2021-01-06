import { averias, altas } from '../../constants/valoresOrdenes';
import { pendientesAverias, liquidadasAverias } from './asignarAverias';

export default async function asignarValores(obj, tipo, estado, tecnicos) {
  switch (tipo) {
    case averias.TIPO:
      if (estado === 1) {
        return await pendientesAverias(obj);
      } else {
        return await liquidadasAverias(obj, tecnicos);   
      }
    case altas.TIPO:
      if (estado === 1) {
        return await 
      } else {
        return await 
      }
    default:
      break;
  }
}