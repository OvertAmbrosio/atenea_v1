import React from "react";
import PropTypes from 'prop-types';
import { Spin } from 'antd'
import { Chart, Tooltip, Interval, Interaction } from "bizcharts";

export default function ChartDevoluciones({data, loading}) {
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
      <Chart height={400} padding={[30, 20, 140, 40]} data={data} autoFit filter={[
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
            fields: ["gestor"]
          }}
          position="motivo*ordenes"
          label={{
            fields: ['ordenes', 'gestor'],
          }}
        />
        <Tooltip shared />
        <Interaction type="active-region" />
      </Chart>
    );
  }
};

ChartDevoluciones.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool
};