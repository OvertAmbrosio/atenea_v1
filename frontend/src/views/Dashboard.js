import React, { useState } from 'react';

import TituloContent from '../components/common/TituloContent';
import Contenedor from '../components/common/Contenedor';
import IndicadorGponAverias from '../components/dashboard/IndicadorGponAverias';
import IndicadorGponAltas from '../components/dashboard/IndicadorGponAltas';
import IndicadorGponGestor from '../components/dashboard/IndicadorGponGestor';
import Prueba from '../components/dashboard/Prueba';

export default function Dashboard() {
  const [cambiar, setCambiar] = useState(0)

  return (
    <div>
      <TituloContent titulo="Dashboard" subtitulo="Indicadores"/>
      <Contenedor>
        {/* INDICADOR AVERIAS GPON */}
        <IndicadorGponAverias prueba={cambiar%2 === 1 ? cambiar:0 }/>
        {/* INDICADOR DE ALTAS GPON */}
        <IndicadorGponAltas prueba={cambiar%2 === 0 ? cambiar:0}/>
        {/* INDICADOR DE GESTORES */}
        <IndicadorGponGestor prueba={cambiar%2 === 0 ? cambiar:0}/>
        {/* <Prueba/> */}
        <button onClick={() => setCambiar(cambiar+1)}>hola</button>
        <Prueba/>
      </Contenedor>
    </div>
  )
};