import { rutas as listaRutas } from '../constants/listaRutas';
import ResumenGeneral from '../views/Dashboard/ResumenGeneral';

const rutas = [
  {
    path: listaRutas.resumenGeneral,
    exact: true,
    component: ResumenGeneral
  }
]

export default rutas