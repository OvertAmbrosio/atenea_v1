import dashboard from './routes/dashboard';
import gestionPersonal from './routes/gestionPersonal';
import operativa from './routes/operativa';

const arregloRutas = [
  ...dashboard,
  ...gestionPersonal,
  ...operativa
]

export default arregloRutas;