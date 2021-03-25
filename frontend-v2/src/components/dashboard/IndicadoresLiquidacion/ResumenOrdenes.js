import React from 'react'
import PropTypes from 'prop-types';
import { Col, Row, Statistic } from 'antd';
import { AlertOutlined, CheckCircleOutlined } from '@ant-design/icons';
import colores from '../../../constants/colores';
import { estadosToa } from '../../../constants/valoresToa';

function ResumenOrdenes({titulo, ordenes=[], columnas}) {

  const style_col = {
    borderRadius: '.3rem',
    padding: '.5rem 1rem',
    backgroundColor: '#fff',
    WebkitBoxShadow: '0px 0px 10px 0px rgba(0,0,0,0.03)',
    MozBoxShadow: '0px 0px 10px 0px rgba(0,0,0,0.03)',
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.03)'
  };

  return (
    <Col sm={columnas} style={style_col}>
      <h4>{titulo}</h4>
      <Row>
        <Col sm={12}>
          <Statistic
            title="Liquidadas"
            value={ordenes && ordenes.length > 0 ? ordenes.filter(e => e && e.estado_toa === estadosToa.COMPLETADO).length : 0}
            valueStyle={{ color: colores.success }}
            prefix={<CheckCircleOutlined />}
          />
        </Col>
        <Col sm={12}>
          <Statistic
            title="Pendientes"
            value={ordenes && ordenes.length > 0 ? ordenes.filter(e => e && e.estado_toa === estadosToa.PENDIENTE).length : 0}
            valueStyle={{ color: colores.warning }}
            prefix={<AlertOutlined />}
          />
        </Col>
      </Row>
    </Col>
  )
};

ResumenOrdenes.propTypes = {
  titulo: PropTypes.string,
  ordenes: PropTypes.array,
};

export default ResumenOrdenes;

