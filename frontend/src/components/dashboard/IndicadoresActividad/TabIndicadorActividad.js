import React from 'react';
import { Col, Empty, Row, Table } from 'antd';
import PropTypes from 'prop-types';

import { columnasResumen, columnasTotal } from './columnasResumen';
import ChartActividad from './ChartActividad';


function TabIndicadorActividad({dataSource=[], dataChart=[],  tipo}) {

  if (dataSource.length <= 0 || dataChart <= 0) {
    return (
      <div>
        <Empty style={{ margin: '5rem' }}/>
      </div>
    )
  } else {
    return (
      <Row style={{ marginTop: '2rem', marginBottom: '1rem' }}>
        <Col sm={24}>
          <ChartActividad data={dataChart} field={tipo}/>
        </Col>
        <Col sm={24}>
          <Row style={{ margin: '1rem 0' }}>
            <Table
              style={{ background: "white !important"}}
              rowKey="key"
              columns={columnasResumen(tipo)}
              dataSource={dataSource}
              size="small"
              pagination={false}
              summary={columnasTotal}
            />
          </Row>
        </Col>
      </Row>
    );
  };
}

TabIndicadorActividad.propTypes = {
  dataSource: PropTypes.array,
  dataChart: PropTypes.array,
  tipo: PropTypes.string
};

export default TabIndicadorActividad;

