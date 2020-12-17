import React from "react";
import {
  Chart,
  Axis,
  Tooltip,
  Legend,
  Facet
} from "bizcharts";

const getTypeColor = type => {
  if (type === 'BK_MA_SM_MAGDALENA_02') { return '#1890ff'; }
  if (type === 'BK_MR_SM_PN_SJ_MARANGA') { return '#2fc25b'; }
  if (type === 'BK_SV_MA_MAGDALENA_01') { return '#facc14'; }
  if (type === 'BK_SJ_SAN_JOSE') { return '#14E9FA'; }
};

export default function ChartGponBucket({data, loading, llave}) {
  if (loading) {
    return <div>cargando...</div>
  } else {
    return (
      <Chart height={250} data={data} autoFit padding={[20, 40, 20, 100]} key={llave}>
        <Legend visible={false}/>
        <Tooltip showMarkers={true}/>
        <Axis name="ordenes" />
        <Facet
          fields={['bucket']}
          type="rect"
          columnTitle={{
            offsetY: -15,
            style: {
              fontSize: 14,
              fontWeight: 300,
              fill: '#8d8d8d'
            }
          }}
          eachView={(view, facet) => {
            view.coordinate().transpose();

            if (facet.columnIndex === 0) {
              view.axis('estado', {
                tickLine: null,
                line: null,
              });
              view.axis('ordenes', false);
            } else {
              view.axis(false);
            }
            const color = getTypeColor(facet.columnValue);
            view
              .interval()
              .adjust('stack')
              .position('estado*ordenes')
              .color('type', [color, '#ebedf0'])
              .size(20)
              .label('ordenes*type', (value, type) => {
                if (type === 2) {
                  return null;
                }
                const offset = (value < 20) ? 10 : -4;
                return {
                  offset,
                };
              });
            view.interaction('element-active');
          }}
        />
      </Chart>
    );
  }
};