import React, { Fragment, useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Menu, Avatar, Typography } from 'antd';
import { PoweroffOutlined, SettingOutlined } from '@ant-design/icons';
import Cookie from "js-cookie";

import variables from '../../../constants/config';
import { AuthToken } from '../../../services/authToken';
import { logout } from '../../../services/apiUsuario';
import { rutas } from '../../../constants/listaRutas';
import capitalizar from '../../../libraries/capitalizar';

export default function OpcionesUsuario() { 
  const [usuario, setUsuario] = useState(null);
  const history = useHistory();
  
  useEffect(() => {
    const auth = new AuthToken(Cookie.get(variables.TOKEN_STORAGE_KEY));
    if (auth) {
      setUsuario(auth.decodedToken);
    }
  },[]);

  const cerrarSesion = async () => {
    await logout().then(async(response) => {//cerró sesion correctamente
      if (response.status !== 'error') {
        Cookie.remove(variables.TOKEN_STORAGE_KEY);
        history.push('/login');
      } else {
        window.location.replace('/login');
      };
    }).catch(error => {
      console.log(error);
      console.log('Error cerrando sesión.')
    })
  }

  return (
    <Menu key="user" mode="horizontal" >
      <Menu.SubMenu
        title={
          <Fragment>
            <span style={{ color: '#999', marginRight: 4 }}>
              <span>Hola,</span>
            </span>
            <span>{usuario&&capitalizar(usuario.nombre)}</span>
            <Avatar style={{ marginLeft: 8 }} src={usuario&&usuario.imagen} />
          </Fragment>
        }
      >
        <Menu.Item key="Configuraciones">
          <Typography.Text type="sucess">
            <Link to={rutas.perfilUsuario}>
              <SettingOutlined />
              Configuraciones
            </Link>
          </Typography.Text>
        </Menu.Item>
        <Menu.Item key="SignOut" onClick={cerrarSesion}>
          <Typography.Text type="danger">
            <PoweroffOutlined/>
            {/* <Trans>Sign out</Trans> */}Desconectar
          </Typography.Text>
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );
};

