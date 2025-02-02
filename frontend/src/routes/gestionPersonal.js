import { rutas as listaRutas, permisos } from '../constants/listaRutas';
import ListaPersonal from "../views/GestionPersonal/ListaPersonal";
import ListaContratas from '../views/GestionPersonal/ListaContratas';

const rutas = [
  {
    path: listaRutas.listaPersonal,
    exact: true,
    component: ListaPersonal,
    nivel: permisos.todos
  },
  {
    path: listaRutas.listaContratas,
    exact: true,
    component: ListaContratas,
    nivel: permisos.listaContratas
  }
]

export default rutas