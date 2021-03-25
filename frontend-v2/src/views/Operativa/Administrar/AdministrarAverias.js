import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { CloudUploadOutlined, CheckCircleOutlined, UnorderedListOutlined, BugOutlined } from '@ant-design/icons';
import Cookie from "js-cookie";

import { tipoOrdenes } from '../../../constants/tipoOrden';
import metodos from '../../../constants/metodos';
import { getEmpleados } from '../../../services/apiEmpleado';
import { getContratas } from '../../../services/apiContrata';
import { getZonas } from '../../../services/apiZonas';
import TituloContent from '../../../components/common/TituloContent';
import Contenedor from '../../../components/common/Contenedor';
import ActualizarOrdenes from '../../../components/operativa/administrarOrdenes/ActualizarOrdenes';
import OrdenesPendientes from '../../../components/operativa/administrarOrdenes/OrdenesPendientes';
import OrdenesLiquidadas from '../../../components/operativa/administrarOrdenes/OrdenesLiquidadas';
import OrdenesExternas from '../../../components/operativa/administrarOrdenes/OrdenesExternas';
import variables from '../../../constants/config';
import { AuthToken } from '../../../services/authToken';

const { TabPane } = Tabs;

export default function AdministrarAverias() {
  const [usuario] = useState(new AuthToken(Cookie.get(variables.TOKEN_STORAGE_KEY)).decodedToken);
  const [listaContratas, setListaContratas] = useState([]);
  const [listaGestores, setListaGestores] = useState([]);
  const [listaTecnicos, setListaTecnicos] = useState([]);
  const [listaZonas, setListaZonas] = useState([]);
  const [listaNodos, setListaNodos] = useState([]);

  useEffect(() => {
    cargarZonas();
    cargarContratas();
    cargarGestores();
    cargarTecnicos();
  //eslint-disable-next-line
  },[]);

  async function cargarContratas() {
    await getContratas(false, metodos.CONTRATA_LISTAR_NOMBRES)
      .then(({data}) => setListaContratas(data ? data : []))
      .catch((err) => console.log(err))
  };

  async function cargarGestores() {
    await getEmpleados(false, { metodo: metodos.EMPLEADOS_LISTAR_GESTORES } )
      .then(({data}) => setListaGestores(data ? data : []))
      .catch((err) => console.log(err))
  };

  async function cargarTecnicos() {
    await getEmpleados(false, { metodo: metodos.EMPLEADOS_LISTAR_TECNICOS } )
      .then(({data}) => setListaTecnicos(data ? data : []))
      .catch((err) => console.log(err))
  };

  async function cargarZonas() {
    await getZonas().then(({data}) => {
      if (usuario && usuario.zonas && usuario.zonas.length > 0 && data) {
        const zonasUser = data.filter((e) => usuario.zonas.includes(e._id))
        setListaZonas(zonasUser);
        setListaNodos(usuario.nodos)
      }
    })
  };

  return (
    <div>
      <TituloContent titulo="Administrar Averias Hfc" subtitulo="Operativa"/>
        <Contenedor>
          <Tabs style={{paddingLeft: '1rem'}} animated={false} defaultActiveKey="1">
            <TabPane
              tab={
                <span>
                  <CloudUploadOutlined />
                  Actualizar Ordenes
                </span>
              }
              key="0"
            >
              <div>
                <ActualizarOrdenes
                  tipoOrden={tipoOrdenes.AVERIAS}
                  tecnicos={listaTecnicos}
                />
              </div>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <UnorderedListOutlined />
                  Ordenes Pendientes
                </span>
              }
              key="1"
            >
              <OrdenesPendientes 
                usuario={usuario}
                contratas={listaContratas}
                gestores={listaGestores}
                tecnicos={listaTecnicos}
                zonas={listaZonas && listaZonas.length > 0 ? listaZonas : []}
                nodos={listaNodos}
                tipo={tipoOrdenes.AVERIAS}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <BugOutlined />
                  Otras Bandejas
                </span>
              }
              key="3"
            >
              <OrdenesExternas tipo={tipoOrdenes.AVERIAS}/>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <CheckCircleOutlined/>
                  Ordenes Liquidadas
                </span>
              }
              key="2"
            >
              <OrdenesLiquidadas tipo={tipoOrdenes.AVERIAS}/>
            </TabPane>
           
            {/* <TabPane
              tab={
                <span>
                  <ScheduleOutlined/>
                  Aprobar Ordenes
                </span>
              }
              key="4"
            >

            </TabPane> */}
          </Tabs>
        </Contenedor>
    </div>
  )
}
