import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { ClusterOutlined, CheckSquareOutlined } from '@ant-design/icons'

import TituloContent from '../../components/common/TituloContent';
import Contenedor from '../../components/common/Contenedor';
import TablaTecnicos from '../../components/operativa/listaRutas/TablaTecnicos';
import { getEmpleados } from '../../services/apiEmpleado';
import { empleados } from '../../constants/metodos';
import TablaAsistencias from '../../components/operativa/listaRutas/TablaAsistencias';

const { TabPane } = Tabs;

export default function ListaRutas() {
  const [listaGestores, setListaGestores] = useState([]);
  const [loadingGestores, setLoadingGestores] = useState(false);
  const [listaAuditores, setListaAuditores] = useState([]);
  const [loadingAuditores, setLoadingAuditores] = useState(false);

  useEffect(() => {
    cargarGestores();
    cargarAuditores();
  },[]);

  async function cargarGestores() {
    setLoadingGestores(true);
    await getEmpleados(false, { metodo: empleados.LISTA_GESTORES }).then(({data}) => {
      if(data) setListaGestores([...data, { _id: '-', nombre: '-', apellidos: '' }]);
      return;
    }).catch((err) => console.log(err)).finally(() => setLoadingGestores(false));
  };

  async function cargarAuditores() {
    setLoadingAuditores(true);
    await getEmpleados(false, { metodo: empleados.LISTA_AUDITORES}).then(({data}) => {
      if(data) setListaAuditores(data);
      return;
    }).catch((err) => console.log(err)).finally(() => setLoadingAuditores(false));
  }

  return (
    <div>
      <TituloContent titulo="Lista de Rutas" subtitulo="Operativa"/>
      <Contenedor>
        <Tabs style={{paddingLeft: '1rem'}} animated={false}>
          <TabPane
            tab={
              <span>
                <ClusterOutlined />
                Asignar Rutas
              </span>
            }
            key="1"
          >
            <TablaTecnicos
              gestores={listaGestores}
              loadingGestores={loadingGestores}
              auditores={listaAuditores}
              loadingAuditores={loadingAuditores}
            />
          </TabPane>
          <TabPane
            tab={
              <span>
                <CheckSquareOutlined />
                Asistencia
              </span>
            }
            key="2"
          >
            <TablaAsistencias/>
          </TabPane>
        </Tabs>
      </Contenedor>
    </div>
  )
}
