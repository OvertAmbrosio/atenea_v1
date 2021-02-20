import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { CloudUploadOutlined, CheckCircleOutlined, ScheduleOutlined, UnorderedListOutlined, BugOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

import { tipoOrdenes } from '../../../constants/tipoOrden';
import { empleados, contratas } from '../../../constants/metodos';
import { getEmpleados } from '../../../services/apiEmpleado';
import { getContratas } from '../../../services/apiContrata';
import TituloContent from '../../../components/common/TituloContent';
import Contenedor from '../../../components/common/Contenedor';
import ActualizarOrdenes from '../../../components/operativa/administrarOrdenes/ActualizarOrdenes';
import OrdenesPendientes from '../../../components/operativa/administrarOrdenes/OrdenesPendientes';
import OrdenesLiquidadas from '../../../components/operativa/administrarOrdenes/OrdenesLiquidadas';
import OrdenesExternas from '../../../components/operativa/administrarOrdenes/OrdenesExternas';
import OrdenesAnuladas from '../../../components/operativa/administrarOrdenes/OrdenesAnuladas';


const { TabPane } = Tabs;

export default function AdministrarAltas() {
  const [listaContratas, setListaContratas] = useState([]);
  const [listaGestores, setListaGestores] = useState([]);
  const [listaTecnicos, setListaTecnicos] = useState([]);

  useEffect(() => {
    cargarContratas();
    cargarGestores();
    cargarTecnicos();
  },[]);

  async function cargarContratas() {
    await getContratas(false, contratas.LISTA_NOMBRES)
      .then(({data}) => setListaContratas(data ? data : []))
      .catch((err) => console.log(err))
  };

  async function cargarGestores() {
    await getEmpleados(false, { metodo: empleados.LISTA_GESTORES })
      .then(({data}) => setListaGestores(data ? data : []))
      .catch((err) => console.log(err))
  };

  async function cargarTecnicos() {
    await getEmpleados(false, { metodo: empleados.LISTA_TECNICOS_GLOBAL })
      .then(({data}) => setListaTecnicos(data ? data : []))
      .catch((err) => console.log(err))
  };

  return (
    <div>
      <TituloContent titulo="Administrar Altas Hfc" subtitulo="Operativa"/>
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
                tipoOrden={tipoOrdenes.ALTAS}
                tecnicos={listaTecnicos}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <UnorderedListOutlined />
                  Ordenes Pendientes
                </span>
              }
              key="2"
            >
              <OrdenesPendientes 
                contratas={listaContratas}
                gestores={listaGestores}
                tecnicos={listaTecnicos}
                tipo={tipoOrdenes.ALTAS}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <CheckCircleOutlined/>
                  Ordenes Liquidadas
                </span>
              }
              key="3"
            >
              <OrdenesLiquidadas tipo={tipoOrdenes.ALTAS}/>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <ExclamationCircleOutlined />
                  Ordenes Anuladas
                </span>
              }
              key="4"
            >
              <OrdenesAnuladas tipo={tipoOrdenes.ALTAS}/>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <BugOutlined />
                  Otras Bandejas
                </span>
              }
              key="5"
            >
              <OrdenesExternas tipo={tipoOrdenes.ALTAS}/>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <ScheduleOutlined/>
                  Aprobar Ordenes
                </span>
              }
              key="6"
            >

            </TabPane>
          </Tabs>
        </Contenedor>
    </div>
  )
}
