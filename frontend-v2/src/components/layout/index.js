import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { Layout, Spin } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import Cookie from "js-cookie";

import Sider from './Sider/index';
import config from '../../constants/config';
import Notificaciones from './Header/Notificaciones';
import OpcionesUsuario from './Header/OpcionesUsuario';
import PrivateLayout from './PrivateLayout';
import { socket } from '../../services/socket';
import metodos from '../../constants/metodos';
import cogoToast from 'cogo-toast';
import { AuthToken } from '../../services/authToken';
import variables from '../../constants/config';

var anchoContenedor = '256px';

function Index({children, spinLoading}) {
  const [usuario] = useState(new AuthToken(Cookie.get(variables.TOKEN_STORAGE_KEY)).decodedToken);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (usuario) {
      //registrar al usuario y recibir el mensaje 
      socket.emit(metodos.REGISTRAR_CLIENTE, {id: usuario._id, nombre: usuario.nombre});
      //registrar de nuevo luego de conectar
      socket.on("connected", () => {
        console.log("cliente re conectado");
        socket.emit(metodos.REGISTRAR_CLIENTE, {id: usuario._id, nombre: usuario.nombre});
      })
      //socket para recibir las ordenes pendientes
      socket.on(metodos.CLIENTE_RECIBIR_MENSAJE, (data) => {
        if (data && data.status) {
          cogoToast[data.status](data.message, { position: "bottom-left" })
        };
      });
      socket.on("error", (data) => {
        console.log("error", data);
      })
    };   
  //eslint-disable-next-line
  }, [usuario])

  if (collapsed) {
    anchoContenedor = '80px'
  } else {
    anchoContenedor = '256px'
  }

  const styleContent = {
    minHeight: 'calc(100vh - 94px - 3rem)',
    marginTop: '.5rem',
    // margin: `1rem`,
    transition: 'margin .2s'
  };
  
  const styleFooter = {
    backgroundColor: 'white',
    width: `100%`,
    margin: `0px`,
    padding: '16px 16px 24px 10px',
    transition: 'margin .2s',
    clear: 'both',
    left: anchoContenedor,
    bottom: 0,
    right: 0
  };

  return (
    <Spin 
      spinning={spinLoading} 
      tip="Cargando Interfaz..." 
      size="large"
      className="spin-container"
    >
      <Layout>
        <Sider collapsed={collapsed}/>
        <Layout className="site-layout">
          <Layout.Header 
            style={{ minWidth: collapsed && 'calc(100vw - 95px)'}}
            className={classnames("header", {
              "collapsed": collapsed,
            })}
            id="layoutHeader"
          >
          <div className="button" onClick={() => setCollapsed(!collapsed)}>
            {
              collapsed ?
              <MenuUnfoldOutlined className="text-primary"/> : 
              <MenuFoldOutlined/>
            }
            </div>
            <div className="right-container">
              <Notificaciones/>
              <OpcionesUsuario/>
            </div>
          </Layout.Header>
          <Layout.Content
            className="site-layout-background"
            style={styleContent}
          >
            {children}
          </Layout.Content>
          <Layout.Footer style={styleFooter}>
            Atenea System v{config.version} - 2020&copy;
          </Layout.Footer>
        </Layout>
      </Layout>
    </Spin>
  )
};

export default PrivateLayout(Index)