import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import { Chart, Interaction, Interval, Tooltip } from 'bizcharts';

import colores from '../../../constants/colores';

const getTypeColor = estado => {
  if (estado === 'Pendiente') { return colores.Pendiente; }
  if (estado === 'Completado') { return colores.Completado; }
  if (estado === 'Iniciado') { return colores.Iniciado; }
  if (estado === 'Suspendido') { return colores.Suspendido }
  if (estado === 'Cancelado') { return colores.Cancelado; }
  if (estado === 'No Realizada') { return colores.NoRealizada; }
};

export default function ChartActividad({data=[], field}) {
  if (!data || data.length < 1) {
    return (
      <div 
        style={{ 
          width: '100%', 
          height: 250,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Spin spinning tip="Cargando..." size="large"/>
      </div>)
  } else {
    return (
      <Chart height={250} padding={[30, 20, 90, 40]} data={data} autoFit filter={[
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
          position={`${field}*ordenes`}
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

ChartActividad.propTypes = {
  data: PropTypes.array,
  field: PropTypes.string
};

