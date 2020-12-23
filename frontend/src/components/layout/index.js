import React, { useState } from 'react';
import classnames from 'classnames';
import { Layout, Spin } from 'antd';
import Sider from './Sider/index';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';

import config from '../../constants/config';
import Notificaciones from './Header/Notificaciones';
import OpcionesUsuario from './Header/OpcionesUsuario';
import PrivateLayout from './PrivateLayout';

var anchoContenedor = '256px';

function Index({children, spinLoading, cargo}) {
  const [collapsed, setCollapsed] = useState(false);

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
  }
  
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
  }

  return (
    <Spin 
      spinning={spinLoading} 
      tip="Cargando Interfaz..." 
      size="large"
      className="spin-container"
    >
      <Layout>
        <Sider collapsed={collapsed} cargo={cargo}/>
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