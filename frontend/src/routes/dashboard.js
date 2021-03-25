import { rutas as listaRutas, permisos } from '../constants/listaRutas';
import ResumenGeneral from '../views/Dashboard/ResumenGeneral';

const rutas = [
  {
    path: listaRutas.resumenGeneral,
    exact: true,
    component: ResumenGeneral,
    nivel: permisos.todos
  }
]

export default rutas