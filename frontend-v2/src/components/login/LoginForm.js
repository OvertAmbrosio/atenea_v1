import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

export default function LoginForm() {
  const [validandoEmail, setValidandoEmail] = useState(false);
  const [validandoPassword, setValidandoPassword] = useState(false);
  const [emailMensaje, setEmailMensaje] = useState(null)
  const [passwordMensaje, setPasswordMensaje] = useState(null);

  return (
    <Form
      name="normal_login"
      className="login-form contenedor"
      initialValues={{remember: true,}}
      // onFinish={onFinish}
      onFieldsChange={(e, q) => {
        setEmailMensaje(null)
        setPasswordMensaje(null)
        if (!q[0].value || (q[0].errors).length !==0 ) {
          setValidandoEmail('error')
        } else {
          setValidandoEmail('success')
        }
        if (!q[1].value || (q[1].errors).length !==0 ) {
          setValidandoPassword('error')
        } else {
          setValidandoPassword('success')
        }
      }}
      onFinishFailed={({ values, errorFields, outOfDate }) => {
          console.log(values, errorFields, outOfDate);
        }
      }
    >
      <div className="logoForm"/>
      <Form.Item
        name="email"
        hasFeedback
        validateStatus={validandoEmail}
        extra={emailMensaje && 
          (<div className="ant-form-item-explain">
            <div>{emailMensaje}</div>
          </div>)
          }
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
        validateStatus={validandoPassword}
        extra={passwordMensaje && 
          (<div className="ant-form-item-explain">
            <div>{passwordMensaje}</div>
          </div>)
          }
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
  )
};

