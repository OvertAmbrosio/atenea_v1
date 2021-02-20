import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { FundOutlined } from '@ant-design/icons'

import Contenedor from '../../components/common/Contenedor';
import TituloVista from '../../components/common/TituloContent';
import { socket } from '../../services/socket';
import cogoToast from 'cogo-toast';
import TablaResumenTCFL from '../../components/dashboard/TablaResumenTCFL';
import { bajas } from '../../constants/valoresToa';

const { TabPane } = Tabs;

export default function ResumenTcfl() {
  const [averias, setAverias] = useState([]);
  const [altas, setAltas] = useState([]);

  useEffect(() => {
    socket.emit('obtenerOrdenes');
    
    socket.on('ordenesGraficos', ({averias, altas}) => {
      const jsonAverias = new Array(JSON.parse(averias));
      const jsonAltas = new Array(JSON.parse(altas));
      if(jsonAverias && jsonAverias[0] && jsonAverias[0].length > 0) setAverias(jsonAverias[0]);
      if(jsonAltas && jsonAltas[0] && jsonAltas[0].length > 0) setAltas(jsonAltas[0]);
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
      <TituloVista titulo="Resumen TCFL" subtitulo="Dashboard"/>
      <Contenedor>
        <Tabs style={{paddingLeft: '1rem'}} animated={false}>
          <TabPane
            tab={
              <span>
                <FundOutlined />
                Averias 24h
              </span>
            }
            key="1"
          >
            <TablaResumenTCFL data={averias.filter((e) => e && e.subtipo_actividad && !bajas.includes(e.subtipo_actividad))} horas={24}/>
          </TabPane>
          <TabPane
            tab={
              <span>
                <FundOutlined />
                Plazos 72h
              </span>
            }
            key="2"
          >
            <TablaResumenTCFL data={altas.filter((e) => e && e.subtipo_actividad && !bajas.includes(e.subtipo_actividad))} horas={72}/>
          </TabPane>
        </Tabs>
      </Contenedor>
    </div>
  )
}
