import { averias } from '../../constants/valores';
import { pendientesAverias } from './asignarAverias'

export default async function asignarValores(obj, tipo, estado) {
  switch (tipo) {
    case averias.TIPO:
      if (estado === 1) {
        return await pendientesAverias(obj);
      } else {
        return false   
      }
    default:
      break;
  }
}