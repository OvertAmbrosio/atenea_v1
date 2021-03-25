import React from 'react';
import { Tabs } from 'antd';
import { GroupOutlined, ClusterOutlined, CheckSquareOutlined } from '@ant-design/icons'

import TituloContent from '../../../components/common/TituloContent';
import Contenedor from '../../../components/common/Contenedor';
import TablaAsistenciasTecnicos from '../../../components/operativa/listaRutas/TablaAsistenciasTecnicos';
import TablaAsistenciasGestores from '../../../components/operativa/listaRutas/TablaAsistenciasGestores';
import TablaAsistenciasAuditores from '../../../components/operativa/listaRutas/TablaAsistenciaAuditor';

const { TabPane } = Tabs;

export default function Asistencias() {
  return (
    <div>
      <TituloContent titulo="Lista de Rutas" subtitulo="Operativa"/>
      <Contenedor>
        <Tabs style={{paddingLeft: '1rem'}} animated={false}>
          <TabPane
            tab={
              <span>
                <GroupOutlined />
                Auditores
              </span>
            }
            key="1"
          >
            <TablaAsistenciasAuditores/>
          </TabPane>
          <TabPane
            tab={
              <span>
                <ClusterOutlined />
                Gestores
              </span>
            }
            key="2"
          >
            <TablaAsistenciasGestores/>
          </TabPane>
          <TabPane
            tab={
              <span>
                <CheckSquareOutlined />
                Tecnicos
              </span>
            }
            key="3"
          >
            <TablaAsistenciasTecnicos/>
          </TabPane>
        </Tabs>
      </Contenedor>
    </div>
  )
}
