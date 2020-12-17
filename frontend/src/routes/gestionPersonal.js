import { rutas as lisaRutas, permisos } from '../constants/listaRutas';
import ListaPersonal from "../views/GestionPersonal/ListaPersonal";
import ListaContratas from '../views/GestionPersonal/ListaContratas';

const rutas = [
  {
    path: lisaRutas.listaPersonal,
    exact: true,
    component: ListaPersonal,
    nivel: permisos.todos
  },
  {
    path: lisaRutas.listaContratas,
    exact: true,
    component: ListaContratas,
    nivel: permisos.listaContratas
  }
]

export default rutas