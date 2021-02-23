import perfilUsuario from './routes/perfilUsuario';
import dashboard from './routes/dashboard';
import gestionPersonal from './routes/gestionPersonal';
import operativa from './routes/operativa';

const arregloRutas = [
  ...perfilUsuario,
  ...dashboard,
  ...gestionPersonal,
  ...operativa
]

export default arregloRutas;