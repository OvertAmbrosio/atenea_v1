import { rutas as listaRutas, permisos } from '../constants/listaRutas';
import IndicadoresGpon from "../views/Dashboard/IndicadoresGpon";
import ListaContratas from '../views/GestionPersonal/ListaContratas';

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
    component: ListaContratas,
    nivel: permisos.listaContratas
  }
]

export default rutas