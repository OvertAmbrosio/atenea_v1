import React from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';

import estadoAsistencia from '../../../constants/estadoAsistencia';

function EstadoTag({estado}) {
  switch (estado) {
    case estadoAsistencia.FALTA:
      return (<Tag color="error">{estado}</Tag>);
    case estadoAsistencia.ASISTIO:
      return (<Tag color="success">{estado}</Tag>);
    case estadoAsistencia.DESCANSO:
      return (<Tag color="gold">{estado}</Tag>);
    case estadoAsistencia.PERMISO:
      return (<Tag color="blue">{estado}</Tag>);
    case estadoAsistencia.SUSPENDIDO:
      return (<Tag color="warning">{estado}</Tag>);
    case estadoAsistencia.DESCANSO_MEDICO:
      return (<Tag color="geekblue">{estado}</Tag>);
    case estadoAsistencia.EXAMEN_MEDICO:
        return (<Tag color="purple">{estado}</Tag>);
    case estadoAsistencia.VACACIONES:
      return (<Tag color="pink">{estado}</Tag>);
    case estadoAsistencia.BAJA:
      return (<Tag color="volcano">{estado}</Tag>);
    default:
      return (<Tag>-</Tag>)
  };
};

EstadoTag.propTypes = {
  estado: PropTypes.string
};

export default EstadoTag;

