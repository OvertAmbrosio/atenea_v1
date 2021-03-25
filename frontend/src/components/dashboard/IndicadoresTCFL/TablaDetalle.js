import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Chart, Tooltip, Legend, Facet } from "bizcharts";
import { Spin } from "antd";
import { green } from '@ant-design/colors';

import ModalDetalleOrden from "./ModalDetalleOrden";

export default function TablaDetalle({data=[], paddingLeft, height}) {
  const [loading, setLoading] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [ordenesDetalle, setOrdenesDetalle] = useState([]);
  const [horas, setHoras] = useState(0);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false)
    }, 80);
  },[data, modalDetalle]);

  const abrirDetalle = (data) => {
    if (data && data.data) {
      if (data.data.indexCode === "Plazo 72h") {
        setHoras(72);
      } else {
        setHoras(24);
      }
      setOrdenesDetalle(data.data.ordenes);
      abrirModalDetalle();
    };
  };

  const abrirModalDetalle = () => setModalDetalle(!modalDetalle);

  const indexNameColorMap = {
    "Averias 24h": {
      title: "Averias 24h",
      color: green[4],
    },
    "Plazo 72h": {
      title: "Plazo 72h",
      color: green[4],
    },
  };

  const typeNameMap = {
    plazo: 'Plazo',
    vencido: 'Vencido'
  };
  
  if (loading || !data || data.length < 1) {
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
        <Spin spinning tip="Cargando..." size="large"/>
      </div>
    )
  } else {
    return (
      <Chart
        autoFit
        data={data}
        height={height}
        padding={[20, 20, 20, paddingLeft]}
        appendPadding={[10]}
        onClick={({data}) => abrirDetalle(data)}
      >
        <Legend visible={true} itemName={{
          formatter: (text, item) => {
            return typeNameMap[text];
          }	
        }} />
        <Tooltip showMarkers={false} />
        <Facet
          fields={["indexCode"]}
          type="rect"
          columnTitle={{
            offsetY: -15,
            style: {
              fontSize: 14,
              fontWeight: 300,
              fill: "#505050",
            },
            formatter: (val) => {
              return indexNameColorMap[val].title;
            },
          }}
          eachView={(view, facet) => {
            view.coordinate().transpose();
  
            if (facet.columnIndex === 0) {
              view.axis("nombre", {
                tickLine: null,
                line: null,
              });
              view.axis("value", false);
            } else {
              view.axis(false);
            }
            const color = indexNameColorMap[facet.columnValue].color;
            view
              .interval()
              .adjust("stack")
              .position("nombre*value")
              .color("type", [color, "#FFE2DC"])
              .size(20)
              .label("value*type", (value, type) => {
                if (type === "vencido") {
                  return null;
                }
                const offset = value < 30 ? 10 : -4;
                return {
                  content: `${value}%`,
                  offset,
                };
              })
              .tooltip(
                "nombre*value*indexCode*type*ordenes",
                (nombre, value, indexCode, type, ordenes) => {
                  return {
                    title: nombre,
                    value: `${type} : ${ordenes.length}`,
                    name: indexCode,
                  };
                }
              );
            view.interaction("element-active");
          }}
        />
        <ModalDetalleOrden ordenes={ordenesDetalle} abrir={abrirModalDetalle} visible={modalDetalle} horas={horas} />
      </Chart>
       
    );
  };
};

TablaDetalle.propTypes = {
  data: PropTypes.array,
  paddingLeft: PropTypes.number,
  height: PropTypes.number
};
