import { rutas as lisaRutas } from '../../constants/listaRutas';
import AdministrarAverias from "../../views/Operativa/Administrar/AdministrarAverias";
import AdministrarAltas from "../../views/Operativa/Administrar/AdministrarAltas";
import AdministrarBasicas from "../../views/Operativa/Administrar/AdministrarBasicas";
import AdministrarSpeedy from "../../views/Operativa/Administrar/AdministrarSpeedy";

const rutas = [
  {
    path: lisaRutas.adminAveriasHfc,
    exact: true,
    component: AdministrarAverias,
  },
  {
    path: lisaRutas.adminAltasHfc,
    exact: true,
    component: AdministrarAltas,
  },
  {
    path: lisaRutas.adminBasicas,
    exact: true,
    component: AdministrarBasicas,
  },
  {
    path: lisaRutas.adminSpeedy,
    exact: true,
    component: AdministrarSpeedy,
  }
]

export default rutas