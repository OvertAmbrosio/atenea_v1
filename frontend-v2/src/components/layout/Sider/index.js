import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';

import MenuUsuario from './MenuUsuario';
import config from '../../../constants/config';

const { Sider } = Layout;

const Index = ({collapsed}) => {
  return (
    <Sider 
      width={256}
      theme="light" 
      breakpoint="lg"
      trigger={null} 
      collapsible 
      collapsed={collapsed} 
      className="sider"
    >
      <div className="brand">
      {!collapsed ? 
        <div className="full-logo">
          <img alt="full-logo" src={config.logoFull} />
        </div> 
        : 
        <div className="logo">
          <img alt="logo" src={config.logoPath} />
        </div>
            
      }
      </div>
      <div className="menu-container">
        <MenuUsuario/>
      </div>
    </Sider>
  )
};

Index.propTypes = {
  collapsed: PropTypes.bool
};

export default Index;
