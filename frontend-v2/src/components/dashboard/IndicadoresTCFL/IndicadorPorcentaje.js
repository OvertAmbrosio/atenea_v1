import React from 'react';
import PropTypes from 'prop-types';
import { Col, Progress, Row, Statistic, Tooltip } from 'antd';
import { AlertOutlined, CheckCircleOutlined } from '@ant-design/icons';

import colores from '../../../constants/colores'

function IndicadorPorcentaje({hora, plazo, vencidas, porcentaje}) {
  return (
    <Col sm={12}style={{ justifyContent: 'center', textAlign: 'center' }} >
      <h4>Plazo {hora}h</h4>
      <Row gutter={16} style={{ margin: '1rem 0' }}>
        <Col sm={12} >
          <Tooltip title={`${plazo} En plazo / ${vencidas} Vencidas`}>
            <Progress
              format={(p) => p + '%'}
              strokeColor={porcentaje < 50 ? colores.error : porcentaje >= 50 && porcentaje < 70 ? colores.warning : colores.success}
              percent={porcentaje} 
              strokeWidth={10}
              width={160}
              gapDegree={80}
              trailColor="#CCCCFF"
              type="dashboard" 
              showInfo
            />
          </Tooltip>
        </Col>
        <Col sm={12}>
          <Row style={{marginBottom: '.5rem'}}>
            <Statistic
              title="En plazo"
              value={plazo}
              valueStyle={{ color: colores.success }}
              prefix={<CheckCircleOutlined />}
            />
          </Row>
          <Row style={{marginBottom: '.5rem'}}>
            <Statistic
              title="Vencidas"
              value={vencidas}
              valueStyle={{ color: colores.error }}
              prefix={<AlertOutlined />}
            />
          </Row>
        </Col>
      </Row>
    </Col>
  )
};

IndicadorPorcentaje.propTypes = {
  hora: PropTypes.number,
  plazo: PropTypes.number,
  vencidas: PropTypes.number,
  porcentaje: PropTypes.number,
};

export default IndicadorPorcentaje;

