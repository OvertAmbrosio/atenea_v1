import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import ResumenOrdenes from './ResumenOrdenes';
import { tipoOrdenes } from '../../../constants/tipoOrden';
import { bajas, estadosToa } from '../../../constants/valoresToa';
import Contenedor from '../../common/Contenedor';
import ChartProduccion from '../ChartProduccion';

function Index({ordenes=[], hora}) {
  const [dataGestoresLiquidados, setDataGestoresLiquidados] = useState([]);

  useEffect(() => {
    ordenesGestores();
  //eslint-disable-next-line
  },[ordenes]);

  const style_row = {
    margin: '0 24px 1rem',
    borderRadius: '.3rem'
    // minHeight: '68vh'
  };

  function ordenesGestores() {
    if (ordenes && ordenes.length > 0) {
      
      let completadas = ordenes.filter((e) => e && e.gestor_liquidado_toa && e.estado === estadosToa.COMPLETADO);
      if (completadas.length > 0) {
        let gestores = [];
        let completo = [];
        let listaOrdenada = [];
        completadas.forEach((e) => {
          if (e && e.gestor_liquidado_toa && !gestores.includes(e.gestor_liquidado_toa.nombre)) {
            gestores.push(e.gestor_liquidado_toa.nombre);
            completo.push(`${e.gestor_liquidado_toa.nombre} ${e.gestor_liquidado_toa.apellidos}`)
          };
        })
        gestores.forEach((gestor, i) => {
          listaOrdenada.push({
            nombre: gestor,
            gestor: completo[i],
            cantidad: completadas.filter((e) => e && e.gestor_liquidado_toa && e.gestor_liquidado_toa.nombre === gestor).length
          })
        })
        setDataGestoresLiquidados(listaOrdenada);
      } else {
        setDataGestoresLiquidados([]);
      }
    }
  };
  
  return (
    <div>
      <Row style={style_row}>
        <ResumenOrdenes 
          columnas={11} 
          titulo="Averias" 
          ordenes={ordenes.filter((e) => e && e.tipo === tipoOrdenes.AVERIAS)}
        />
        <Col sm={1}></Col>
        <ResumenOrdenes 
          columnas={12} 
          titulo="Altas" 
          ordenes={ordenes.filter((e) => e && e.tipo === tipoOrdenes.ALTAS && !bajas.includes(e.subtipo_actividad))}
        />
      </Row>
      <Contenedor>
        <div style={{ marginTop: '.5rem' }}>
          <h3>Indicadores de Liquidación (Gestor) - {hora}</h3><br/>
          <ChartProduccion data={dataGestoresLiquidados} field="gestor" height={500}/>
        </div>
      </Contenedor>
    </div>
  )
};

Index.propTypes = {
  ordenes: PropTypes.array,
  hora: PropTypes.string
};

export default Index;

