import React from "react";
import PropTypes from 'prop-types';
import { Spin } from 'antd'
import { Chart, Tooltip, Interval, Interaction } from "bizcharts";

// import colores from '../../../constants/colores';

const getTypeColor = estado => {
  if (estado === 'Pendiente') { return '#FF351F' }
  if (estado === 'Completado') { return '#9BB6C2'; }
  if (estado === 'Iniciado') { return '#1890ff'; }
  if (estado === 'Suspendido') { return '#ABFFBC' }
  if (estado === 'Cancelado') { return '#80FF80'; }
  if (estado === 'No Realizada') { return '#1414FF'; }
  // if (estado === 'Pendiente') { return colores.warning; }
  // if (estado === 'Completado') { return colores.success; }
  // if (estado === 'Iniciado') { return '#1890ff'; }
  // if (estado === 'Suspendido') { return colores.error; }
  // if (estado === 'Cancelado') { return '#940000'; }
  // if (estado === 'No Realizada') { return '#A5A5A5'; }
};

export default function ChartGestor({data, loading}) {
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
            fields: ["estado"],
            callback: (a) => getTypeColor(a)
          }}
          position="gestor*ordenes"
          label={{
            fields: ['ordenes', 'estado'],
            callback: (a,b) => {
              if (b === 'Completado' && a > 0) {
                return {
                  content: a,
                  style: {
                    fill: 'red',
                    fontSize: 15,
                    fontWeight: 'bold'
                  }
                };
              } else {
                return {
                  content: a
                }
              }
            }
          }}
        />
        <Tooltip shared />
        <Interaction type="active-region" />
      </Chart>
    );
  }
};

ChartGestor.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool
};