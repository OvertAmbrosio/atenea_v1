import { rutas } from '../../constants/listaRutas';
import ListaRutas from "../../views/Operativa/ListaRutas/AsignarRutas";
import Asistencias from "../../views/Operativa/ListaRutas/Asistencias";

const array = [
  {
    path: rutas.asignarRutas,
    exact: true,
    component: ListaRutas
  },
  {
    path: rutas.listaAsistencia,
    exact: true,
    component: Asistencias
  }
]

export default array