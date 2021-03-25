import { rutas as lisaRutas } from '../../constants/listaRutas';
import Areas from '../../views/Sistemas/ConfiguracionEmpleados/Areas';
import Cargos from '../../views/Sistemas/ConfiguracionEmpleados/Cargos';
import TipoEmpleados from '../../views/Sistemas/ConfiguracionEmpleados/TipoEmpleados';
import Vistas from '../../views/Sistemas/ConfiguracionEmpleados/Vistas';
import Zonas from '../../views/Sistemas/ConfiguracionEmpleados/Zonas';


const rutas = [
  {
    path: lisaRutas.areas,
    exact: true,
    component: Areas,
  },
  {
    path: lisaRutas.cargos,
    exact: true,
    component: Cargos,
  },
  {
    path: lisaRutas.tipoEmpleados,
    exact: true,
    component: TipoEmpleados,
  },
  {
    path: lisaRutas.vistas,
    exact: true,
    component: Vistas,
  },
  {
    path: lisaRutas.zonas,
    exact: true,
    component: Zonas,
  }
]

export default rutas