import { rutas, permisos } from '../../constants/listaRutas';
import ListaRutas from "../../views/Operativa/ListaRutas";

const array = [
  {
    path: rutas.listaRutas,
    exact: true,
    component: ListaRutas,
    nivel: permisos.administrarOrdenes
  }
]

export default array