import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Row, Checkbox, Tabs } from 'antd';
import moment from 'moment';

import { gponAltas, gponAverias, hfcAltas, hfcAverias } from '../../../constants/valoresToa';
import IndicadorPorcentaje from './IndicadorPorcentaje';
import { DatabaseOutlined, UsergroupAddOutlined, UserOutlined } from '@ant-design/icons';
import TablaDetalle from './TablaDetalle';

const { TabPane } = Tabs;

function Index({ordenes=[], hora}) {
  const [altas, setAltas] = useState({plazo:[], vencidas: [], porcentaje: 0});
  const [averias, setAverias] = useState({plazo:[], vencidas: [], porcentaje: 0});
  const [tipoAgenda, setTipoAgenda] = useState(false);
  const [bucketDetalle, setBucketDetalle] = useState([]);
  const [contrataDetalle, setContrataDetalle] = useState([]);
  const [gestorDetalle, setGestorDetalle] = useState([]);

  useEffect(() => {
    if (ordenes && ordenes.length > 0) {
      filtrarOrdenes();
      // filtrarBucket();
    } else {
      setAltas({plazo:[], vencidas: [], porcentaje: 0});
      setAverias({plazo:[], vencidas: [], porcentaje: 0});
    }
  //eslint-disable-next-line
  },[ordenes, tipoAgenda]);
  // && String(e.tipo_cita).toLowerCase() !== 'telefónica'
  function filtrarOrdenes() {
    const averiasActividad = [...hfcAverias, ...gponAverias];
    const altasActividad = [...hfcAltas, ...gponAltas];
    const todoOrdenes = [...averiasActividad, ...altasActividad];
    let ordenesAgendas = tipoAgenda ? 
      ordenes.filter((e) => todoOrdenes.includes(e.subtipo_actividad) && String(e.tipo_cita).toLowerCase() === "telefónica")
    : 
      ordenes.filter((e) => todoOrdenes.includes(e.subtipo_actividad));
    const averiasTCFL = obtenerTcfl(ordenesAgendas.filter((e) => averiasActividad.includes(e.subtipo_actividad)), 24);
    const altasTCFL = obtenerTcfl(ordenesAgendas.filter((e) => altasActividad.includes(e.subtipo_actividad)), 72);

    try {
      filtrarBucket(ordenesAgendas, averiasTCFL, altasTCFL);
      filtrarContrata(ordenesAgendas, averiasTCFL, altasTCFL);
      filtrarGestor(ordenesAgendas, averiasTCFL, altasTCFL);
    } catch (error) {
      console.log(error);
    };
    setAverias(averiasTCFL);
    setAltas(altasTCFL);
  };

  function obtenerTcfl(data, hora) {
    const plazo = data.filter((e) => moment(e.fecha_pre_no_realizado).diff(e.fecha_registro_legados, 'hour') < hora);
    const vencidas = data.filter((e) => moment(e.fecha_pre_no_realizado).diff(e.fecha_registro_legados, 'hour') >= hora);
    const porcentaje = Math.round((plazo.length*100) / (plazo.length + vencidas.length) );
    
    return {plazo, vencidas, porcentaje}
  };

  function filtrarBucket(data, averiasTCFL, altasTCFL) {
    let buckets = [];
    let bucketsChart = [];
    data.forEach((e) => {
      if (!buckets.includes(e.bucket)) {
        buckets.push(e.bucket)
      }
    });
    buckets.filter(e => e).forEach((e) => {
      let averiasPlazo = averiasTCFL.plazo.filter((obj) => obj && obj.bucket === e);
      let averiasVencidas = averiasTCFL.vencidas.filter((obj) => obj && obj.bucket === e);
      let altasPlazo = altasTCFL.plazo.filter((obj) => obj && obj.bucket === e);
      let altasVencidas = altasTCFL.vencidas.filter((obj) => obj && obj.bucket === e);
      
      bucketsChart.push(...generarObjeto(String(e).substring(6), averiasPlazo, averiasVencidas, altasPlazo, altasVencidas))
    })
    setBucketDetalle(bucketsChart);
  };

  function filtrarContrata(data, averiasTCFL, altasTCFL) {
    let contratas = [];
    let contratasChart = [];
    data.forEach((e) => {
      if (e.contrata && !contratas.includes(e.contrata.nombre)) {
        contratas.push(e.contrata.nombre)
      }
    });
    contratas.filter(e => e).forEach((e) => {
      let averiasPlazo = averiasTCFL.plazo.filter((obj) => obj && obj.contrata && obj.contrata.nombre === e);
      let averiasVencidas = averiasTCFL.vencidas.filter((obj) => obj && obj.contrata && obj.contrata.nombre === e);
      let altasPlazo = altasTCFL.plazo.filter((obj) => obj && obj.contrata && obj.contrata.nombre === e);
      let altasVencidas = altasTCFL.vencidas.filter((obj) => obj && obj.contrata && obj.contrata.nombre === e);
      
      contratasChart.push(...generarObjeto(e, averiasPlazo, averiasVencidas, altasPlazo, altasVencidas))
    })
    setContrataDetalle(contratasChart);
  };

  function filtrarGestor(data, averiasTCFL, altasTCFL) {
    let gestores = [];
    let gestoresChart = [];
    data.forEach((e) => {
      if (e.gestor && !gestores.includes(e.gestor.nombre)) {
        gestores.push(e.gestor.nombre)
      }
    });
    gestores.filter(e => e).forEach((e) => {
      let averiasPlazo = averiasTCFL.plazo.filter((obj) => obj && obj.gestor && obj.gestor.nombre === e);
      let averiasVencidas = averiasTCFL.vencidas.filter((obj) => obj && obj.gestor && obj.gestor.nombre === e);
      let altasPlazo = altasTCFL.plazo.filter((obj) => obj && obj.gestor && obj.gestor.nombre === e);
      let altasVencidas = altasTCFL.vencidas.filter((obj) => obj && obj.gestor && obj.gestor.nombre === e);
      
      gestoresChart.push(...generarObjeto(e, averiasPlazo, averiasVencidas, altasPlazo, altasVencidas))
    })
    setGestorDetalle(gestoresChart);
  };

  function generarObjeto(e, averiasPlazo, averiasVencidas, altasPlazo, altasVencidas) {
    return [{
      indexCode: "Averias 24h",
      nombre: e,
      type: "plazo",
      ordenes: averiasPlazo,
      value: Math.round((averiasPlazo.length * 100) / (averiasPlazo.length + averiasVencidas.length)),
    },{
      indexCode: "Averias 24h",
      nombre: e,
      type: "vencido",
      ordenes: averiasVencidas,
      value: Math.round((averiasVencidas.length * 100) / (averiasPlazo.length + averiasVencidas.length)),
    },{
      indexCode: "Plazo 72h",
      nombre: e,
      type: "plazo",
      ordenes: altasPlazo,
      value: Math.round((altasPlazo.length * 100) / (altasPlazo.length + altasVencidas.length)),
    },{
      indexCode: "Plazo 72h",
      nombre: e,
      type: "vencido",
      ordenes: altasVencidas,
      value: Math.round((altasVencidas.length * 100) / (altasPlazo.length + altasVencidas.length)),
    }]
  };

  return (
    <div style={{ marginTop: '.5rem' }}>
      <h3>Indicadores TCFL - {hora}</h3>
      <Checkbox checked={tipoAgenda} onChange={(e) => setTipoAgenda(e.target.checked)}/> Excluir Agendas
      <Row style={{ margin: '1rem 0' }}>
        <IndicadorPorcentaje hora={24} plazo={averias.plazo.length} vencidas={averias.vencidas.length} porcentaje={averias.porcentaje}/>
        <IndicadorPorcentaje hora={72} plazo={altas.plazo.length} vencidas={altas.vencidas.length} porcentaje={altas.porcentaje}/>
      </Row>
      <Tabs style={{paddingLeft: '1rem'}} animated={false}>
        <TabPane
          tab={
            <span>
              <DatabaseOutlined />
              Bucket
            </span>
          }
          key="1"
        >
          <TablaDetalle data={bucketDetalle} paddingLeft={120} height={350}/>
        </TabPane>
        <TabPane
          tab={
            <span>
              <UsergroupAddOutlined />
              Contrata
            </span>
          }
          key="2"
        >
           <TablaDetalle data={contrataDetalle} paddingLeft={190} height={350}/>
        </TabPane>
        <TabPane
          tab={
            <span>
              <UserOutlined />
              Gestor
            </span>
          }
          key="3"
        >
          <TablaDetalle data={gestorDetalle} paddingLeft={120} height={750}/>
        </TabPane>
      </Tabs>
    </div>
  )
};

Index.propTypes = {
  ordenes: PropTypes.array,
  hora: PropTypes.string
};

export default Index;

