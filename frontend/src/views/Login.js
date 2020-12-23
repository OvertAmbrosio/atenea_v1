import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Cookie from "js-cookie";
import { Col, Row, Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons'

import { login } from '../services/apiUsuario';
import variables from '../constants/config';
import { rutas } from '../constants/listaRutas';
import { AuthToken } from '../services/authToken';

export default function Login() {
  const history = useHistory();

  useEffect(() => {
    const auth = new AuthToken(Cookie.get(variables.TOKEN_STORAGE_KEY));
    if (auth.isValid) {
      history.push(rutas.indicadoresGpon);
    };
  },[history]);

  async function enviarFormulario(values) {
    await login(values).then((data) => {
      if (data.data && !data.errors) {
        Cookie.set(variables.TOKEN_STORAGE_KEY, data.data);
        history.push(rutas.indicadoresGpon);
      }
    }).catch((error) => {
      console.log('error');
      console.log(error);
    })
  };

  return (
    <div>
      <Row type="flex" justify="space-around" align="middle" style={{backgroundColor: 'rgb(242, 242, 247)', height: '100vh'}}>
        <Col xs={20} sm={12} md={8} lg={6} xl={5}>
          <div className="contenedor-padre">
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{remember: true}}
              onFinish={enviarFormulario}
            >
              <div className="logoForm"/>
              <Form.Item
                name="username"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: '¡Se necesita una correo!'
                  },
                  {
                    type: 'email',
                    message: '¡Ingresa un email válido!'
                  }
                ]}
              >
                <Input
                  autoComplete="current-email"
                  type="email"
                  prefix={<UserOutlined className="site-form-item-icon" />} 
                  placeholder="Correo" />
              </Form.Item>
              <Form.Item
                name="password"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: '¡Se necesita una contraseña válida!',
                  },
                  {
                    min: 6,
                    message: '¡La contraseña debe tener mas de 6 carácteres!',
                  }
                ]}
              >
                <Input.Password
                  autoComplete="current-password"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Contraseña"
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  Acceder
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  )
}