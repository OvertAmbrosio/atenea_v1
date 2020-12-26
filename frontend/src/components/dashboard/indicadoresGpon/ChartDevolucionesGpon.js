import React from "react";
import PropTypes from 'prop-types';
import { Spin } from 'antd'
import { Chart, Tooltip, Interval, Interaction } from "bizcharts";

export default function ChartDevolucionesGpon({data, loading}) {
  if (loading) {
    return (
      <div 
        style={{ 
          width: '100%', 
          height: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Spin spinning tip="Cargando..." size="large"/>
      </div>)
  } else {
    return (
      <Chart height={400} padding={[30, 20, 140, 40]} data={data.filter((d) => d.gestor !== '-')} autoFit filter={[
        ['ordenes', val => val != null]
      ]}>
        <Interval
          adjust={[
            {
              type: 'dodge',
              marginRatio: 0,
            },
          ]}
          color={{
            fields: ["motivo"]
          }}
          position="gestor*ordenes"
          label={{
            fields: ['ordenes', 'motivo'],
          }}
        />
        <Tooltip shared />
        <Interaction type="active-region" />
      </Chart>
    );
  }
};

ChartDevolucionesGpon.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool
};