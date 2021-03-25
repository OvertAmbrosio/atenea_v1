import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { CheckCircleOutlined, UnorderedListOutlined, InfoCircleOutlined } from '@ant-design/icons';
import Cookie from "js-cookie";

import Contenedor from '../../../components/common/Contenedor';
import TituloVista from '../../../components/common/TituloContent';
import OrdenesPendientesGestor from '../../../components/operativa/gestionarOrdenes/OrdenesPendientesGestor';
import metodos from '../../../constants/metodos';
import { getEmpleados } from '../../../services/apiEmpleado';
import OrdenesLiquidadas from '../../../components/operativa/administrarOrdenes/OrdenesLiquidadas';
import OrdenesSinAsignar from '../../../components/operativa/gestionarOrdenes/OrdenesSinAsignar';
import cogoToast from 'cogo-toast';
import { socket } from '../../../services/socket';
import { AuthToken } from '../../../services/authToken';
import variables from '../../../constants/config';
import { estadosToa } from '../../../constants/valoresToa';

const { TabPane } = Tabs;

const estadoPendiente = [
  String(estadosToa.INICIADO).toLowerCase(), 
  String(estadosToa.SUSPENDIDO).toLowerCase(), 
  String(estadosToa.PENDIENTE).toLowerCase()
]

export default function ListaOrdenes() {
  const [usuario] = useState(new AuthToken(Cookie.get(variables.TOKEN_STORAGE_KEY)).decodedToken);
  const [ordenesPendientes, setOrdenesPendientes] = useState([]);
  const [ordenesCerradas, setOrdenesCerradas] = useState([]);
  const [listaOrdenes, setListaOrdenes] = useState([]);
  const [listaGestores, setListaGestores] = useState([]);
  const [listaTecnicos, setListaTecnicos] = useState([]);

  useEffect(() => {
    cargarGestores();
    cargarTecnicos();
    socket.emit(metodos.UNIR_SALA_GESTOR_PENDIENTES, usuario);
    cogoToast.loading("Conectando con el servidor...", { position: "bottom-left" })
    socket.on(metodos.ORDENES_SOCKET_PENDIENTES, ({data}) => {
      cogoToast.success("Base de datos actualizada.", { position: "bottom-left" });
      if (data && data.length > 0) {
        setOrdenesPendientes(data.filter((e) => estadoPendiente.includes(e.estado_toa)));
        setOrdenesCerradas(data.filter((e) => !estadoPendiente.includes(e.estado_toa)));
      };      
    })
    socket.on('disconnect', () => {
      console.log("desconectado por inactividad");
      cogoToast.loading("Reconectando al servidor...", { position: "bottom-left" });
      socket.emit(metodos.UNIR_SALA_GESTOR_PENDIENTES, usuario);
    })
  //eslint-disable-next-line
  }, []);

  async function cargarGestores() {
    await getEmpleados(false, { metodo: metodos.EMPLEADOS_LISTAR_GESTORES })
      .then(({data}) => setListaGestores(data ? data : []))
      .catch((err) => console.log(err))
  };

  async function cargarTecnicos() {
    return await getEmpleados(false, { metodo: metodos.EMPLEADOS_LISTAR_TECNICOS })
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
            <OrdenesPendientesGestor 
              ordenes={ordenesPendientes} 
              gestores={listaGestores} 
              tecnicos={listaTecnicos}
            />
          </TabPane>
          <TabPane
            tab={
              <span>
                <InfoCircleOutlined/>
                Ordenes En Proceso  
              </span>
            }
            key="2"
          >
            <OrdenesSinAsignar gestores={listaGestores} tecnicos={listaTecnicos}/>
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
            <OrdenesLiquidadas tipo={null} gestor={true}/>
          </TabPane>
          
        </Tabs>
      </Contenedor>
    </div>
  )
}
