import { rutas, permisos } from '../../constants/listaRutas';
import ListaRutas from "../../views/Operativa/ListaRutas/AsignarRutas";
import Asistencias from "../../views/Operativa/ListaRutas/Asistencias";

const array = [
  {
    path: rutas.asignarRutas,
    exact: true,
    component: ListaRutas,
    nivel: permisos.administrarOrdenes
  },
  {
    path: rutas.listaAsistencia,
    exact: true,
    component: Asistencias,
    nivel: permisos.administrarOrdenes
  }
]

export default array