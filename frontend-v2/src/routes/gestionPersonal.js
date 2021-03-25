import { rutas as listaRutas } from '../constants/listaRutas';
import ListaPersonal from "../views/GestionPersonal/ListaPersonal";
import ListaContratas from '../views/GestionPersonal/ListaContratas';

const rutas = [
  {
    path: listaRutas.listaPersonal,
    exact: true,
    component: ListaPersonal
  },
  {
    path: listaRutas.listaContratas,
    exact: true,
    component: ListaContratas
  }
]

export default rutas