import React from 'react';
import PropTypes from 'prop-types';
import { Axis, Chart, Coordinate, Interval } from 'bizcharts';
import { Empty, Tooltip } from 'antd';

function ChartProduccion({data=[], field, height, paddinLeft=150}) {
  if (!data || data.length < 1) {
    return (
      <div 
        style={{ 
          width: '100%', 
          height: height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Empty/>
      </div>)
  } else {
    return (
      <Chart 
        data={data} 
        height={height} 
        padding={[0,50,10,paddinLeft]}
        autoFit
      >
        <Coordinate transpose />
        <Axis
          name="nombre"
        />
        <Axis name="cantidad" visible={false} />
        <Tooltip/>
        <Interval 
          shape="rect"
          position={`nombre*cantidad*${field}`}
          animate={{ enter: { duration: 500 } }}
          label="cantidad"
          tooltip={[`${field}*cantidad`,]}
        />
      </Chart>
    )
  }
};

ChartProduccion.propTypes = {
  data: PropTypes.array,
  field: PropTypes.string,
  height: PropTypes.number,
  paddinLeft: PropTypes.number
};

export default ChartProduccion;

