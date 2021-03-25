import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';

import TituloContent from '../../../components/common/TituloContent';
import Contenedor from '../../../components/common/Contenedor';
import TablaRutasOperativas from '../../../components/operativa/listaRutas/asignarRutas/TablaRutasOperativas';
import { getEmpleados } from '../../../services/apiEmpleado';
import metodos from '../../../constants/metodos';
import { GlobalOutlined, PartitionOutlined } from '@ant-design/icons';
import TablaRutasApoyo from '../../../components/operativa/listaRutas/asignarRutas/TablaRutasApoyo';

const { TabPane } = Tabs;

export default function AsignarRutas() {
  const [listaGestores, setListaGestores] = useState([]);
  const [loadingGestores, setLoadingGestores] = useState(false);
  const [listaAuditores, setListaAuditores] = useState([]);
  const [loadingAuditores, setLoadingAuditores] = useState(false);
  const [listaSupervisores, setListaSupervisores] = useState([]);
  const [loadingSupervisores, setLoadingSupervisores] = useState(false);

  useEffect(() => {
    cargarGestores();
    cargarAuditores();
    cargarSupervisores();
  },[]);

  async function cargarGestores() {
    setLoadingGestores(true);
    await getEmpleados(false, { metodo: metodos.EMPLEADOS_LISTAR_GESTORES }).then(({data}) => {
      if(data) setListaGestores([...data, { _id: '-', nombre: '-', apellidos: '' }]);
      return;
    }).catch((err) => console.log(err)).finally(() => setLoadingGestores(false));
  };

  async function cargarAuditores() {
    setLoadingAuditores(true);
    await getEmpleados(false, { metodo: metodos.EMPLEADOS_LISTAR_AUDITORES } ).then(({data}) => {
      if(data) setListaAuditores(data);
      return;
    }).catch((err) => console.log(err)).finally(() => setLoadingAuditores(false));
  };

  async function cargarSupervisores() {
    setLoadingSupervisores(true);
    await getEmpleados(false, {metodo: metodos.EMPLEADOS_LISTAR_SUPERVISORES}).then(({data}) => {
      if(data) setListaSupervisores(data);
      return;
    }).catch((err) => console.log(err)).finally(() => setLoadingSupervisores(false));
  };

  return (
    <div>
      <TituloContent titulo="Asignar Rutas" subtitulo="Lista Rutas"/>
      <Contenedor>
        <Tabs style={{paddingLeft: '1rem'}} animated={false}>
          <TabPane
            tab={
              <span>
                <GlobalOutlined />
                Rutas Operativas
              </span>
            }
            key="1"
          >
            <TablaRutasOperativas
              gestores={listaGestores}
              loadingGestores={loadingGestores}
              auditores={listaAuditores}
              loadingAuditores={loadingAuditores}
              supervisores={listaSupervisores}
              loadingSupervisores={loadingSupervisores}
            />
          </TabPane>
          <TabPane
            tab={
              <span>
                <PartitionOutlined />
                Rutas de Apoyo 
              </span>
            }
            key="2"
          >
            <TablaRutasApoyo/>
          </TabPane>
        </Tabs>
      </Contenedor>
    </div>
  )
}
