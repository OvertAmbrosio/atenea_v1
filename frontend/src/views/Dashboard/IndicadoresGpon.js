import React, { useState, useEffect } from 'react'
// import * as uuid from 'uuid';

import TituloContent from '../../components/common/TituloContent';
import Contenedor from '../../components/common/Contenedor';
import IndicadorGponBucket from '../../components/dashboard/indicadoresGpon/IndicadorGponBucket';
import IndicadorGponGestor from '../../components/dashboard/indicadoresGpon/IndicadorGponGestor';
import variables from '../../constants/config';
// import IndicadorGponDevoluciones from '../../components/dashboard/indicadoresGpon/IndicadorGponDevoluciones';

export default function Dashboard() {
  const [averias, setAverias] = useState([]);
  const [altas, setAltas] = useState([]);
  const socket = window.io(variables.public);

  useEffect(() => {
    socket.on('connect', function() {
      socket.emit('suscribirseOrdenesGpon',{})
      socket.on('ordenesGpon', ({averias, altas}) => {
        const jsonAverias = new Array(JSON.parse(averias));
        const jsonAltas = new Array(JSON.parse(altas));
        if(jsonAverias && jsonAverias[0].length > 0) setAverias(jsonAverias[0]);
        if(jsonAltas && jsonAltas[0].length > 0) setAltas(jsonAltas[0]);
      });
    });
    return () => socket.close();
    // eslint-disable-next-line
  },[]);

  return (
    <div>
      <TituloContent titulo="Indicadores GPON" subtitulo="Dashboard"/>
      <Contenedor>
        {/* INDICADOR AVERIAS GPON */}
        <IndicadorGponBucket data={averias} titulo="Indicador Averias GPON" tipo="averias"/>
        {/* INDICADOR DE ALTAS GPON */}
        <IndicadorGponBucket data={altas} titulo="Indicador Altas GPON" tipo="altas"/>
        {/* INDICADOR DE GESTORES AVERIAS */}
        <IndicadorGponGestor data={averias} titulo="Indicador Gestores Gpon (Averias)"/>
        {/* INDICADOR DE GESTORES ALTAS */}
        <IndicadorGponGestor data={altas} titulo="Indicador Gestores Gpon (Altas)"/>
        {/* INDICADORES DEVOLUCIONES X GESTOR */}
        {/* <IndicadorGponDevoluciones/> */}
      </Contenedor>
    </div>
  )
};