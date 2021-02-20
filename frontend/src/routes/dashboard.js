import { rutas as listaRutas, permisos } from '../constants/listaRutas';
import IndicadoresGpon from "../views/Dashboard/IndicadoresGpon";
import IndicadoresHfc from "../views/Dashboard/IndicadoresHfc";
import ResumenTcfl from "../views/Dashboard/ResumenTcfl";

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
  },
  {
    path: listaRutas.resumenTcfl,
    exact: true,
    component: ResumenTcfl,
    nivel: permisos.todos
  }
]

export default rutas