import { rutas as listaRutas } from '../constants/listaRutas';
import PerfilUsuario from '../views/PerfilUsuario';


const rutas = [
  {
    path: listaRutas.perfilUsuario,
    exact: true,
    component: PerfilUsuario
  },
]

export default rutas