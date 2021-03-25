import perfilUsuario from './routes/perfilUsuario';
import dashboard from './routes/dashboard';
import sistemas from './routes/sistemas';
import gestionPersonal from './routes/gestionPersonal';
import operativa from './routes/operativa';

const arregloRutas = [
  ...perfilUsuario,
  ...dashboard,
  ...sistemas,
  ...gestionPersonal,
  ...operativa
]

export default arregloRutas;