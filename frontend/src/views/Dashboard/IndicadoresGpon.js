import React, { useState, useEffect, useRef } from 'react'

import TituloContent from '../../components/common/TituloContent';
import Contenedor from '../../components/common/Contenedor';
import IndicadorGponBucket from '../../components/dashboard/indicadoresGpon/IndicadorGponBucket';
import IndicadorGponGestor from '../../components/dashboard/indicadoresGpon/IndicadorGponGestor';
import IndicadorGponDevoluciones from '../../components/dashboard/indicadoresGpon/IndicadorGponDevoluciones';
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
      socket.on('ordenesGpon', ({averias, altas}) => {
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
    }, 15000);
  }

  return (
    <div>
      <TituloContent titulo="Indicadores GPON" subtitulo="Dashboard"/>
      <Contenedor>
        {/* INDICADOR AVERIAS GPON */}
        <div ref={indicadorRef1}>
          <IndicadorGponBucket data={averias} titulo="Indicador Averias GPON" tipo="averias"/>
        </div>
        {/* INDICADOR DE ALTAS GPON */}
        <div ref={indicadorRef2}>
          <IndicadorGponBucket data={altas} titulo="Indicador Altas GPON" tipo="altas"/>
        </div>
        {/* INDICADOR DE GESTORES AVERIAS */}
        <div ref={indicadorRef3}>
          <IndicadorGponGestor data={averias} titulo="Indicador Gestores Gpon (Averias)"/>
        </div>
        {/* INDICADOR DE GESTORES ALTAS */}
        <div ref={indicadorRef4}>
          <IndicadorGponGestor data={altas} titulo="Indicador Gestores Gpon (Altas)"/>
        </div>
        {/* INDICADORES DEVOLUCIONES X GESTOR */}
        <div ref={indicadorRef5}>
          <IndicadorGponDevoluciones data={altas}/>
        </div>
        <button onClick={executeScroll}>prueba</button>
      </Contenedor>
    </div>
  )
};