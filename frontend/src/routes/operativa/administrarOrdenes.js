import { rutas as lisaRutas, permisos } from '../../constants/listaRutas';
import AdministrarAverias from "../../views/Operativa/Administrar/AdministrarAverias";
import AdministrarAltas from "../../views/Operativa/Administrar/AdministrarAltas";
import AdministrarBasicas from "../../views/Operativa/Administrar/AdministrarBasicas";
import AdministrarSpeedy from "../../views/Operativa/Administrar/AdministrarSpeedy";

const rutas = [
  {
    path: lisaRutas.adminAveriasHfc,
    exact: true,
    component: AdministrarAverias,
    nivel: permisos.administrarOrdenes
  },
  {
    path: lisaRutas.adminAltasHfc,
    exact: true,
    component: AdministrarAltas,
    nivel: permisos.administrarOrdenes
  },
  {
    path: lisaRutas.adminBasicas,
    exact: true,
    component: AdministrarBasicas,
    nivel: permisos.administrarOrdenes
  },
  {
    path: lisaRutas.adminspeedy,
    exact: true,
    component: AdministrarSpeedy,
    nivel: permisos.administrarOrdenes
  }
]

export default rutas