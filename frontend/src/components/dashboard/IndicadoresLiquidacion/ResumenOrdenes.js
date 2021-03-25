import React from 'react'
import PropTypes from 'prop-types';
import { Col, Row, Statistic } from 'antd';
import { AlertOutlined, CheckCircleOutlined } from '@ant-design/icons';
import colores from '../../../constants/colores';
import { estadosToa } from '../../../constants/valoresToa';

function ResumenOrdenes({titulo, ordenes=[]}) {
  return (
    <Row style={{ padding: '.5rem 0' }}>
      <Col sm={24}><h4>{titulo}</h4></Col>
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
  )
};

ResumenOrdenes.propTypes = {
  titulo: PropTypes.string,
  ordenes: PropTypes.array,
};

export default ResumenOrdenes;

