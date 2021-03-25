import { rutas } from '../../constants/listaRutas';
import GestionarAsistencia from "../../views/Operativa/GestionarAsistencia";
import ListaOrdenes from "../../views/Operativa/Gestionar/ListaOrdenes";

const array = [
  {
    path: rutas.gestionarAsistencia,
    exact: true,
    component: GestionarAsistencia
  },
  {
    path: rutas.gestionarListaOrdenes,
    exact: true,
    component: ListaOrdenes
  }
]

export default array