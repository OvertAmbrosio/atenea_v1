import { rutas as listaRutas, permisos } from '../constants/listaRutas';
import IndicadoresGpon from "../views/Dashboard/IndicadoresGpon";
import IndicadoresHfc from "../views/Dashboard/IndicadoresHfc";

const rutas = [
  {
    path: listaRutas.indicadoresGpon,
    exact: true,
    component: IndicadoresGpon,
    nivel: permisos.todos
  },
  {
    path: listaRutas.indicadoresHfc,
    exact: true,
    component: IndicadoresHfc,
    nivel: permisos.todos
  }
]

export default rutas