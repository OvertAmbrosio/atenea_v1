import { rutas, permisos } from './constants/listaRutas';
import Dashboard from './views/Dashboard';

import gestionPersonal from './routes/gestionPersonal';
import operativa from './routes/operativa';

const arregloRutas = [
  {
    path: rutas.dashboard,
    exact: true,
    nivel: [...permisos.todos, 9],
    component: Dashboard
  },
  ...gestionPersonal,
  ...operativa
]

export default arregloRutas;