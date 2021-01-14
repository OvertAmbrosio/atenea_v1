import { rutas, permisos } from '../../constants/listaRutas';
import GestionarAsistencia from "../../views/Operativa/GestionarAsistencia";
import ListaOrdenes from "../../views/Operativa/Gestionar/ListaOrdenes";

const array = [
  {
    path: rutas.gestionarAsistencia,
    exact: true,
    component: GestionarAsistencia,
    nivel: permisos.gestion
  },
  {
    path: rutas.gestionarListaOrdenes,
    exact: true,
    component: ListaOrdenes,
    nivel: permisos.gestion
  }
]

export default array