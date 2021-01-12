import React, { useState, useEffect, useRef } from 'react';
import { Switch } from 'antd';
import cogoToast from 'cogo-toast';

import TituloContent from '../../components/common/TituloContent';
import Contenedor from '../../components/common/Contenedor';
import IndicadorBucket from '../../components/dashboard/IndicadorBucket';
import IndicadorContrata from '../../components/dashboard/IndicadorContrata';
import IndicadorGestor from '../../components/dashboard/IndicadorGestor';
import IndicadorDevoluciones from '../../components/dashboard/IndicadorDevoluciones';
import variables from '../../constants/config';

export default function Dashboard() {
  const [averias, setAverias] = useState([]);
  const [altas, setAltas] = useState([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const [idInterval, setIdInterval] = useState('');
  const socket = window.io(variables.socket, { transports: ['websocket'], secure: true, reconnection: true });
  const indicadorRef1 = useRef(null);
  const indicadorRef2 = useRef(null);
  const indicadorRef3 = useRef(null);
  const indicadorRef4 = useRef(null);
  const indicadorRef5 = useRef(null);
  const indicadorRef6 = useRef(null);
  const indicadorRef7 = useRef(null);

  useEffect(() => {
    socket.on('connect', function() {
      socket.on('ordenesGraficos', ({averias, altas}) => {
        const jsonAverias = new Array(JSON.parse(averias));
        const jsonAltas = new Array(JSON.parse(altas));
        if(jsonAverias && jsonAverias[0] && jsonAverias[0].length > 0) setAverias(jsonAverias[0]);
        if(jsonAltas && jsonAltas[0] && jsonAltas[0].length > 0) setAltas(jsonAltas[0]);
      });
      socket.emit('obtenerOrdenes')
    });
    socket.on('error', (e) => {
      console.log(e);
      cogoToast.error('Error conectando al servidor.', { position: 'top-left' })
    })
    return () => socket.close();
    // eslint-disable-next-line
  },[]);

  useEffect(() => {
    if (autoScroll) {
      scrollAutomatico();
    } else {
      clearInterval(idInterval);
    }
  // eslint-disable-next-line
  },[autoScroll])

  const executeScroll = (number) => {
    let arrayRefs = [indicadorRef1,indicadorRef2,indicadorRef3,indicadorRef4,indicadorRef5,indicadorRef6,indicadorRef7];
    if(arrayRefs[number].current) arrayRefs[number].current.scrollIntoView({block: 'center', behavior: 'smooth'})
  };

  const scrollAutomatico = () => {
    let i = 0;
    let id = setInterval(() => {
      executeScroll(i);
      if (i === 6) {
        i = 0;
      } else {
        i= i+1
      }
    }, 30000);

    setIdInterval(id);
  }

  return (
    <div>
      <TituloContent titulo="Indicadores GPON" subtitulo="Dashboard"/>
      <Contenedor>
        <p style={{ marginTop: '1rem' }}>Cambiar Automaticamente:</p>
        <Switch checked={autoScroll} onChange={(e) => setAutoScroll(e)}/>
        {/* INDICADOR AVERIAS GPON */}
        <div ref={indicadorRef1}>
          <IndicadorBucket data={averias} titulo="Indicador Averias GPON" tipo="averias" tecnologia={true}/>
        </div>
        
        {/* INDICADOR DE ALTAS GPON */}
        <div ref={indicadorRef2}>
          <IndicadorBucket data={altas} titulo="Indicador Altas GPON" tipo="altas" tecnologia={true}/>
        </div>
        {/* INDICADOR DE CONTRATAS AVERIAS */}
        <div ref={indicadorRef3}>
          <IndicadorContrata data={averias} titulo="Indicador Contratas GPON (Averias)" tecnologia={true}/>
        </div>
        {/* INDICADOR DE CONTRATAS ALTAS */}
        <div ref={indicadorRef4}>
          <IndicadorContrata data={altas} titulo="Indicador Contratas GPON (Altas)" tecnologia={true}/>
        </div>
        {/* INDICADOR DE GESTORES AVERIAS */}
        <div ref={indicadorRef5}>
          <IndicadorGestor data={averias} titulo="Indicador Gestores GPON (Averias)" tecnologia={true}/>
        </div>
        {/* INDICADOR DE GESTORES ALTAS */}
        <div ref={indicadorRef6}>
          <IndicadorGestor data={altas} titulo="Indicador Gestores GPON (Altas)" tecnologia={true}/>
        </div>
        {/* INDICADORES DEVOLUCIONES X GESTOR */}
        <div ref={indicadorRef7}>
          <IndicadorDevoluciones data={altas} titulo="Indicador Devoluciones GPON" tecnologia={true}/>
        </div>
      </Contenedor>
    </div>
  )
};