import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { CheckCircleOutlined, UnorderedListOutlined, InfoCircleOutlined } from '@ant-design/icons';

import Contenedor from '../../../components/common/Contenedor';
import TituloVista from '../../../components/common/TituloContent';
import OrdenesPendientesGestor from '../../../components/operativa/gestionarOrdenes/OrdenesPendientesGestor';
import { empleados } from '../../../constants/metodos';
import { getEmpleados } from '../../../services/apiEmpleado';
import OrdenesLiquidadas from '../../../components/operativa/administrarOrdenes/OrdenesLiquidadas';
import OrdenesSinAsignar from '../../../components/operativa/gestionarOrdenes/OrdenesSinAsignar';

const { TabPane } = Tabs;

export default function ListaOrdenes() {
  const [listaGestores, setListaGestores] = useState([]);
  const [listaTecnicos, setListaTecnicos] = useState([]);

  useEffect(() => {
    cargarGestores();
    cargarTecnicos();
  }, []);

  async function cargarGestores() {
    await getEmpleados(false, { metodo: empleados.LISTA_GESTORES })
      .then(({data}) => setListaGestores(data ? data : []))
      .catch((err) => console.log(err))
  };

  async function cargarTecnicos() {
    return await getEmpleados(false, { metodo: empleados.LISTA_TECNICOS_GLOBAL })
      .then(({data}) => {
        if(data) setListaTecnicos(data);
      }).catch((err) => console.log(err))
  };

  return (
    <div>
      <TituloVista titulo="Lista de Ordenes" subtitulo="Gestionar Ordenes"/>
      <Contenedor>
        <Tabs style={{paddingLeft: '1rem'}} animated={false}>
          <TabPane
            tab={
              <span>
                <UnorderedListOutlined />
                Ordenes Pendientes
              </span>
            }
            key="1"
          >
            <OrdenesPendientesGestor gestores={listaGestores} tecnicos={listaTecnicos}/>
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
            <OrdenesLiquidadas tipo={null} gestor={true}/>
          </TabPane>
          <TabPane
            tab={
              <span>
                <InfoCircleOutlined/>
                Ordenes Sin Asignar
              </span>
            }
            key="3"
          >
            <OrdenesSinAsignar gestores={listaGestores} tecnicos={listaTecnicos}/>
          </TabPane>
        </Tabs>
      </Contenedor>
    </div>
  )
}
