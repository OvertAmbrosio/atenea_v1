import React from 'react';
import { Tabs } from 'antd';
import { CloudUploadOutlined, CheckCircleOutlined, ScheduleOutlined } from '@ant-design/icons'

import { averias } from '../../../constants/valores';
import TituloContent from '../../../components/common/TituloContent';
import Contenedor from '../../../components/common/Contenedor';
import ActualizarOrdenes from '../../../components/operativa/administrarOrdenes/ActualizarOrdenes';
import TablaOrdenes from '../../../components/operativa/administrarOrdenes/TablaOrdenes';

const { TabPane } = Tabs;

export default function AdministrarAverias() {
  return (
    <div>
      <TituloContent titulo="Administrar Ordenes" subtitulo="Operativa"/>
        <Contenedor>
          <Tabs style={{paddingLeft: '1rem'}} animated={false}>
            <TabPane
              tab={
                <span>
                  <CloudUploadOutlined />
                  Actualizar Ordenes
                </span>
              }
              key="1"
            >
              <ActualizarOrdenes
                tipoOrden={averias.TIPO}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <CheckCircleOutlined/>
                  Lista de Ordenes
                </span>
              }
              key="2"
            >
              <TablaOrdenes 
                tipo={averias.TIPO}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <ScheduleOutlined/>
                  Aprobar Ordenes
                </span>
              }
              key="3"
            >

            </TabPane>
          </Tabs>
        </Contenedor>
    </div>
  )
}
