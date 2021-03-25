import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import moment from 'moment';

import estadoAsistencia from '../../../../constants/estadoAsistencia';
import ModalCrearAsistencia from './ModalCrearAsistencia';

function EstadoAsistenciaTag({actualizar, row, fecha, estado}) {
  const [modalCrear, setModalCrear] = useState(false);

  const abrirModal = () => setModalCrear(!modalCrear);

  switch (estado) {
    case estadoAsistencia.FALTA:
      return (<Tag color="error">{estado}</Tag>);
    case estadoAsistencia.ASISTIO:
      return (<Tag color="success">{estado}</Tag>);
    case estadoAsistencia.TARDANZA:
      return (<Tag color="lime">{estado}</Tag>);
    case estadoAsistencia.DESCANSO:
      return (<Tag color="gold">{estado}</Tag>);
    case estadoAsistencia.GUARDIA:
      return (<Tag color="cyan">{estado}</Tag>);
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
      return (<>
       <Tag onClick={() => abrirModal()} style={{ cursor: 'pointer' }}>-</Tag>
       <ModalCrearAsistencia actualizar={actualizar} row={row} fecha={moment(`${fecha}-2021`, 'DD-MM-YYYY').toDate()} visible={modalCrear} abrir={abrirModal}/>
      </>)
  };
};

EstadoAsistenciaTag.propTypes = {
  actualizar: PropTypes.func,
  row: PropTypes.object,
  fecha: PropTypes.string,
  estado: PropTypes.string
};

export default EstadoAsistenciaTag;

