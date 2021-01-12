import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { CloudUploadOutlined, CheckCircleOutlined, ScheduleOutlined } from '@ant-design/icons'

import { tipoOrdenes } from '../../../constants/tipoOrden';
import { empleados, contratas } from '../../../constants/metodos';
import { getEmpleados } from '../../../services/apiEmpleado';
import { getContratas } from '../../../services/apiContrata';
import TituloContent from '../../../components/common/TituloContent';
import Contenedor from '../../../components/common/Contenedor';
import ActualizarOrdenes from '../../../components/operativa/administrarOrdenes/ActualizarOrdenes';
import ListarOrdenes from '../../../components/operativa/administrarOrdenes/ListarOrdenes';


const { TabPane } = Tabs;

export default function AdministrarAverias() {
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
      <TituloContent titulo="Administrar Averias Hfc" subtitulo="Operativa"/>
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
                tipoOrden={tipoOrdenes.AVERIAS}
                tecnicos={listaTecnicos}
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
              <ListarOrdenes 
                contratas={listaContratas}
                gestores={listaGestores}
                tecnicos={listaTecnicos}
                tipo={tipoOrdenes.AVERIAS}
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
