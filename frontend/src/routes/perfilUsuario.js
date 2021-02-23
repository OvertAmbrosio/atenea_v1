import { rutas as listaRutas, permisos } from '../constants/listaRutas';
import PerfilUsuario from '../views/PerfilUsuario';


const rutas = [
  {
    path: listaRutas.perfilUsuario,
    exact: true,
    component: PerfilUsuario,
    nivel: permisos.todos
  },
]

export default rutas