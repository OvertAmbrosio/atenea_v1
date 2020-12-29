import React, { useState, useEffect, useRef } from 'react'

import TituloContent from '../../components/common/TituloContent';
import Contenedor from '../../components/common/Contenedor';
import IndicadorBucket from '../../components/dashboard/IndicadorBucket';
import IndicadorGestor from '../../components/dashboard/IndicadorGestor';
import IndicadorDevoluciones from '../../components/dashboard/IndicadorDevoluciones';
import variables from '../../constants/config';

export default function Dashboard() {
  const [averias, setAverias] = useState([]);
  const [altas, setAltas] = useState([]);
  const socket = window.io(variables.public);
  const indicadorRef1 = useRef(null);
  const indicadorRef2 = useRef(null);
  const indicadorRef3 = useRef(null);
  const indicadorRef4 = useRef(null);
  const indicadorRef5 = useRef(null);

  useEffect(() => {
    scrollAutomatico();
    socket.on('connect', function(s) {
      socket.on('ordenesGraficos', ({averias, altas}) => {
        const jsonAverias = new Array(JSON.parse(averias));
        const jsonAltas = new Array(JSON.parse(altas));
        if(jsonAverias && jsonAverias[0].length > 0) setAverias(jsonAverias[0]);
        if(jsonAltas && jsonAltas[0].length > 0) setAltas(jsonAltas[0]);
      });
      socket.emit('obtenerOrdenes')
    });
    return () => socket.close();
    // eslint-disable-next-line
  },[]);

  const executeScroll = (number) => {
    let arrayRefs = [indicadorRef1,indicadorRef2,indicadorRef3,indicadorRef4,indicadorRef5];
    if(arrayRefs[number].current) arrayRefs[number].current.scrollIntoView({block: 'center', behavior: 'smooth'})
  };

  const scrollAutomatico = () => {
    let i = 0;
    setInterval(() => {
      executeScroll(i);
      if (i === 4) {
        i = 0;
      } else {
        i= i+1
      }
    }, 30000);
  }

  return (
    <div>
      <TituloContent titulo="Indicadores HFC" subtitulo="Dashboard"/>
      <Contenedor>
        {/* INDICADOR AVERIAS HFC */}
        <div ref={indicadorRef1}>
          <IndicadorBucket data={averias} titulo="Indicador Averias HFC" tipo="averias" tecnologia={false}/>
        </div>
        {/* INDICADOR DE ALTAS HFC */}
        <div ref={indicadorRef2}>
          <IndicadorBucket data={altas} titulo="Indicador Altas HFC" tipo="altas" tecnologia={false}/>
        </div>
        {/* INDICADOR DE GESTORES AVERIAS */}
        <div ref={indicadorRef3}>
          <IndicadorGestor data={averias} titulo="Indicador Gestores HFC (Averias)" tecnologia={false}/>
        </div>
        {/* INDICADOR DE GESTORES ALTAS */}
        <div ref={indicadorRef4}>
          <IndicadorGestor data={altas} titulo="Indicador Gestores HFC (Altas)" tecnologia={false}/>
        </div>
        {/* INDICADORES DEVOLUCIONES X GESTOR */}
        <div ref={indicadorRef5}>
          <IndicadorDevoluciones data={altas} tecnologia={false}/>
        </div>
      </Contenedor>
    </div>
  )
};