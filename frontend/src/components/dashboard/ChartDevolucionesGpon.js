import React from "react";
import PropTypes from 'prop-types';
import {
  Chart,
  Axis,
  Tooltip,
  Legend,
  Facet
} from "bizcharts";

const coloresGestores = ['#1890ff','#2fc25b','#facc14','#14E9FA','#FF8818','#4618FF','#6DF719','#C018FF','#18B7FF','#F4A460','#6495ED','#00CED1','#1890ff','#2fc25b','#facc14','#14E9FA','#FF8818','#4618FF','#6DF719','#C018FF','#18B6FF','#F4A460','#6495ED','#00CED1'];

const getTypeColor = (type, gestores=[]) => {
  if (!type && gestores.length === 0) {
    return '#fff';
  } else {
    const i = gestores.findIndex((e) => e === type);
    if (i > -1) {
      return coloresGestores[i];
    } else {
      return '#fff';
    };
  };
};

export default function ChartDevolucionesGpon({data, loading, gestores}) {
  if (loading) {
    return <div>cargando...</div>
  } else {
    return (
      <Chart height={450} data={data} autoFit padding={[20, 5, 10, 255]}>
        <Legend visible={false}/>
        <Tooltip showMarkers={true}/>
        <Axis name="ordenes" />
        <Facet
          fields={['gestor']}
          type="rect"
          columnTitle={{
            offsetY: -15,
            style: {
              fontSize: 11,
              fontWeight: 300,
              fill: '#8d8d8d'
            }
          }}
          eachView={(view, facet) => {
            view.coordinate().transpose();

            if (facet.columnIndex === 0) {
              view.axis('motivo', {
                tickLine: null,
                line: null,
              });
              view.axis('ordenes', false);
            } else {
              view.axis(false);
            }
            const color = getTypeColor(facet.columnValue, gestores);
            view
              .interval()
              .adjust('stack')
              .position('motivo*ordenes')
              .color('type', [color, '#ebedf0'])
              .size(20)
              .label('ordenes*type', (value, type) => {
                if (type === 2) {
                  return null;
                }
                const offset = (value < 3) ? 3 : -4;
                return {
                  offset,
                };
              });
            view.interaction('element-active');
          }}
        />
      </Chart>
    );
  };
};

ChartDevolucionesGpon.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
  gestores: PropTypes.array
};