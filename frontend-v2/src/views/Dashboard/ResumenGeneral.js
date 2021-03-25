import React, { useState, useEffect } from 'react';
import cogoToast from 'cogo-toast';
import moment from 'moment';

import { socket } from '../../services/socket';
import Contenedor from '../../components/common/Contenedor';
import TituloVista from '../../components/common/TituloContent';
import IndicadoresLiquidacion from '../../components/dashboard/IndicadoresLiquidacion';
import IndicadoresActividad from '../../components/dashboard/IndicadoresActividad';
import IndicadoresTCFL from '../../components/dashboard/IndicadoresTCFL';
import IndicadoresProduccion from '../../components/dashboard/IndicadoresProduccion';
import { estadosToa } from '../../constants/valoresToa';

export default function ResumenGeneral() {
  const [ordenes, setOrdenes] = useState([]);
  const [horaActualizado, setHoraActualizado] = useState('');

  useEffect(() => {
    socket.emit('obtenerOrdenes');
    
    socket.on('ordenesGraficos', ({averias, altas, hora}) => {
      const jsonAverias = new Array(JSON.parse(averias));
      const jsonAltas = new Array(JSON.parse(altas));
      if (hora && moment(new Date(hora)).isValid()) setHoraActualizado(moment(new Date(hora)).format('HH:mm'));
      if(jsonAverias && jsonAverias[0] && jsonAverias[0].length > 0
        && jsonAltas && jsonAltas[0] && jsonAltas[0].length > 0) setOrdenes([...jsonAverias[0], ...jsonAltas[0]]);
    });

    socket.on('error', (e) => {
      console.log(e);
      cogoToast.error('Error conectando al servidor.', { position: 'top-left' })
    });

    return () => {
      socket.off('ordenesGraficos');
    };
    // eslint-disable-next-line
  },[]);

  return (
    <div>
      <TituloVista titulo="Resumen General" subtitulo="Dashboard"/>
      <IndicadoresLiquidacion ordenes={ordenes} hora={horaActualizado}/>
      <Contenedor>
        <IndicadoresActividad ordenes={ordenes} hora={horaActualizado} />
      </Contenedor>
      <Contenedor>
        <IndicadoresTCFL 
          ordenes={ordenes.filter((e) => e.estado_toa === estadosToa.COMPLETADO)} 
          hora={horaActualizado}
        />
      </Contenedor>
      <Contenedor>
        <IndicadoresProduccion 
          ordenes={ordenes.filter((e) => e.estado_toa === estadosToa.COMPLETADO && e.contrata && e.contrata.nombre)}
          hora={horaActualizado}
        />
      </Contenedor>
    </div>
  )
}
