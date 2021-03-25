import listaRutas from './listaRutas';
import gestionarAsistencia from './gestionarAsistencia';
import administrarOrdenes from './administrarOrdenes';

const rutasOperativa = [
  ...listaRutas,
  ...gestionarAsistencia,
  ...administrarOrdenes
];

export default rutasOperativa;