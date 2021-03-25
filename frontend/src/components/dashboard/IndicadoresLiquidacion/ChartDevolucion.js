import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Axis, Chart, Coordinate, Interval } from 'bizcharts';
import { Empty } from 'antd';

import ModalDetalleOrden from '../IndicadoresTCFL/ModalDetalleOrden';

function ChartDevolucion({data=[], tipo=true}) {
  const [modalDetalle, setModalDetalle] = useState(false);
  const [ordenesDetalle, setOrdenesDetalle] = useState([]);

  const abrirDetalle = (data) => {
    if (data && data.data) {
      setOrdenesDetalle(data.data.ordenes);
      abrirModalDetalle();
    };
  };

  const abrirModalDetalle = () => setModalDetalle(!modalDetalle);

  if (!data || data.length < 1) {
    return (
      <div 
        style={{ 
          width: '100%', 
          height: 500,
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
        height={500} 
        padding={[0,50,20, tipo?150:190]}
        onClick={({data}) => abrirDetalle(data)}
        autoFit
      >
        <Coordinate transpose />
        <Axis
          name="cantidad"
        />
        <Axis name="cantidad" visible={false} />
        <Interval 
          adjust={[
            {
              type: 'stack',
            },
          ]}
          color={{
            fields: [ "estado" ],
            values: [ "#ff764a", "#ffa600" ],
          }}
          position={`nombre*cantidad*${tipo?"gestor":"motivo"}`}
          animate={{ enter: { duration: 500 } }}
          label={["total", (a) => {
            return {
              content: a?a:null,
            }
          }]}
          tooltip={[`${tipo?"gestor":"motivo"}*estado*cantidad`,]}
        />
         <ModalDetalleOrden ordenes={ordenesDetalle} abrir={abrirModalDetalle} visible={modalDetalle} horas={72} devolucion={true} />
      </Chart>
    )
  }
};

ChartDevolucion.propTypes = {
  data: PropTypes.array,
  tipo: PropTypes.bool
};

export default ChartDevolucion;

