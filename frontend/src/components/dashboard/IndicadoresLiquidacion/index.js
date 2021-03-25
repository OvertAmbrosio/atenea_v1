import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Space, Switch } from 'antd';
import ResumenOrdenes from './ResumenOrdenes';
import { tipoOrdenes } from '../../../constants/tipoOrden';
import { bajas, estadosToa, gponAltas, hfcAltas, hfcRutinas } from '../../../constants/valoresToa';
import Contenedor from '../../common/Contenedor';
import ChartProduccion from '../ChartProduccion';
import ChartDevolucion from './ChartDevolucion';

function Index({ordenes=[], hora}) {
  const [dataGestoresLiquidados, setDataGestoresLiquidados] = useState([]);
  const [dataGestoresDevueltas, setDataGestoresDevueltas] = useState([]);
  const [checkTipo, setCheckTipo] = useState(true);

  useEffect(() => {
    ordenesGestoresLiquidadas();
    if (checkTipo) {
      ordenesGestoresDevoluciones();
    } else {
      ordenesMotivoDevoluciones();
    };
  //eslint-disable-next-line
  },[ordenes]);

  useEffect(() => {
    if (checkTipo) {
      ordenesGestoresDevoluciones();
    } else {
      ordenesMotivoDevoluciones();
    };
  //eslint-disable-next-line
  },[checkTipo])

  function ordenesGestoresLiquidadas() {
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
            ordenes: completadas.filter((e) => e && e.gestor_liquidado_toa && e.gestor_liquidado_toa.nombre === gestor),
            cantidad: completadas.filter((e) => e && e.gestor_liquidado_toa && e.gestor_liquidado_toa.nombre === gestor).length
          })
        })
        setDataGestoresLiquidados(listaOrdenada);
      } else {
        setDataGestoresLiquidados([]);
      }
    }
  };

  function ordenesGestoresDevoluciones() {
    if (ordenes && ordenes.length > 0) {
      let altas = [...hfcAltas,...gponAltas,...hfcRutinas,...hfcAltas];
      let devueltas = ordenes.filter((e) => e && e.gestor && [estadosToa.CANCELADO, estadosToa.NO_REALIZADA].includes(e.estado) && altas.includes(e.subtipo_actividad));
      if (devueltas.length > 0) {
        let gestores = [];
        let completo = [];
        let listaOrdenada = [];
        devueltas.forEach((e) => {
          if (e && e.gestor && !gestores.includes(e.gestor.nombre)) {
            gestores.push(e.gestor.nombre);
            completo.push(`${e.gestor.nombre} ${e.gestor.apellidos}`)
          };
        })
        gestores.forEach((gestor, i) => {
          listaOrdenada.push({
            nombre: gestor,
            gestor: completo[i],
            estado: estadosToa.CANCELADO,
            total: null,
            ordenes: devueltas.filter((e) => e && e.gestor && e.gestor.nombre === gestor && e.estado_toa === estadosToa.CANCELADO),
            cantidad: devueltas.filter((e) => e && e.gestor && e.gestor.nombre === gestor && e.estado_toa === estadosToa.CANCELADO).length
          },{
            nombre: gestor,
            gestor: completo[i],
            estado: estadosToa.NO_REALIZADA,
            total: devueltas.filter((e) => e && e.gestor && e.gestor.nombre === gestor).length,
            ordenes: devueltas.filter((e) => e && e.gestor && e.gestor.nombre === gestor && e.estado_toa === estadosToa.NO_REALIZADA),
            cantidad: devueltas.filter((e) => e && e.gestor && e.gestor.nombre === gestor && e.estado_toa === estadosToa.NO_REALIZADA).length
          })
        })
        setDataGestoresDevueltas(listaOrdenada);
      } else {
        setDataGestoresDevueltas([]);
      }
    };
  };

  function ordenesMotivoDevoluciones() {
    if (ordenes && ordenes.length > 0) {
      let altas = [...hfcAltas,...gponAltas,...hfcRutinas,...hfcAltas];
      let devueltas = ordenes.filter((e) => e && e.gestor && [estadosToa.CANCELADO, estadosToa.NO_REALIZADA].includes(e.estado) && altas.includes(e.subtipo_actividad));
      if (devueltas.length > 0) {
        let motivos = [];
        let listaOrdenada = [];
        devueltas.forEach((e) => {
          if (e && e.gestor && !motivos.includes(e.motivo_no_realizado)) {
            motivos.push(e.motivo_no_realizado);
          };
        })
        motivos.forEach((motivo, i) => {
          listaOrdenada.push({
            nombre: String(motivo).substring(9,motivo.length).replace('-',''),
            motivo,
            estado: estadosToa.CANCELADO,
            total: null,
            ordenes: devueltas.filter((e) => e && e.motivo_no_realizado === motivo && e.estado_toa === estadosToa.CANCELADO),
            cantidad: devueltas.filter((e) => e && e.motivo_no_realizado === motivo && e.estado_toa === estadosToa.CANCELADO).length
          },{
            nombre: String(motivo).substring(9,motivo.length).replace('-',''),
            motivo,
            estado: estadosToa.NO_REALIZADA,
            total: devueltas.filter((e) => e && e.motivo_no_realizado === motivo).length,
            ordenes: devueltas.filter((e) => e && e.motivo_no_realizado === motivo && e.estado_toa === estadosToa.NO_REALIZADA),
            cantidad: devueltas.filter((e) => e && e.motivo_no_realizado === motivo && e.estado_toa === estadosToa.NO_REALIZADA).length
          })
        })
        setDataGestoresDevueltas(listaOrdenada);
      } else {
        setDataGestoresDevueltas([]);
      }
    }
  };
  
  return (
    <div>
      <Row >
        <Col sm={12} >
          <Contenedor>
            <ResumenOrdenes 
              titulo="Averias" 
              ordenes={ordenes.filter((e) => e && e.tipo === tipoOrdenes.AVERIAS)}
            />
          </Contenedor>
        </Col>
        <Col sm={12}>
          <Contenedor>
            <ResumenOrdenes
              titulo="Altas" 
              ordenes={ordenes.filter((e) => e && e.tipo === tipoOrdenes.ALTAS && !bajas.includes(e.subtipo_actividad))}
            />
         </Contenedor>
        </Col>
      </Row>
      <Contenedor>
        <Row>
          <Space direction="vertical" />
          <Col sm={12}>
            <div style={{ marginTop: '.5rem', marginBottom: '1rem' }}>
              <h3>Indicadores de Liquidación (Gestor)</h3>
              <ChartProduccion data={dataGestoresLiquidados} field="gestor" height={500}/>
            </div>
          </Col>
          <Col sm={12}>
            <div style={{ marginTop: '.5rem', marginBottom: '1rem' }}>
              <h3>Indicadores de Devolución (Altas/Rutinas) - {` `}
                <Switch 
                  size="small"
                  checkedChildren="Gestor" 
                  unCheckedChildren="Motivo"
                  onChange={(e) => setCheckTipo(e)}
                  checked={checkTipo} 
                />
              </h3>
              <ChartDevolucion data={dataGestoresDevueltas} tipo={checkTipo}/>
            </div>
          </Col>
        </Row>
      
      </Contenedor>
    </div>
  )
};

Index.propTypes = {
  ordenes: PropTypes.array,
  hora: PropTypes.string
};

export default Index;

