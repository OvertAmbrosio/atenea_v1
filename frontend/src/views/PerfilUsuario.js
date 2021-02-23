import React, { useState, useEffect } from 'react';
import { Avatar, Button, Col, DatePicker, Image, Input, Radio, Row, Select, Space, Spin } from 'antd';
import moment from 'moment';

import Contenedor from '../components/common/Contenedor';
import TituloVista from '../components/common/TituloContent';
import { getEmpleados, patchEmpleados, putEmpleados } from '../services/apiEmpleado';
import { empleados } from '../constants/metodos';
import { avatares } from '../constants/avatares';
import cogoToast from 'cogo-toast';


const { Option } = Select;

export default function PerfilUsuario() {
  const [loadingUsuario, setLoadingUsuario] = useState(false);
  const [loadingActualizar, setLoadingActualizar] = useState(false);
  const [loadingContraseña, setLoadingContraseña] = useState(false);
  const [usuarioObj, setUsuarioObj] = useState({});
  const [password, setPassword] = useState(null);
  const [newPassword1, setNewPassword1] = useState(null);
  const [newPassword2, setNewPassword2] = useState(null);

  useEffect(() => {
    cargarPerfil();
  },[]);

  async function cargarPerfil() {
    setLoadingUsuario(true);
    return await getEmpleados( true, { metodo: empleados.PERFIL_USUARIO })
      .then(({data}) => {
        if (data) { setUsuarioObj(data); } 
        else { setUsuarioObj({}); };
      }).catch((err) => console.log(err)).finally(() => setLoadingUsuario(false));
  };

  async function actualizarPerfil() {
    if (usuarioObj._id) {
      setLoadingActualizar(true);
      return await putEmpleados( usuarioObj._id, usuarioObj )
        .catch((e) => console.log(e))
        .finally(() => setLoadingActualizar(false));
    } else {
      cogoToast.warn('No se encontró el id del usuario.', { position: 'top-right' });
    };
  };

  async function actualizarContraseña() {
    if (usuarioObj._id) {
      setLoadingContraseña(true);
      return await patchEmpleados(true, { id: usuarioObj._id, metodo: empleados.ACTUALIZAR_CONTRASEÑA, password, newPassword1, newPassword2 })
        .catch((e) => console.log(e))
        .finally(() => {
          limpiarInputs()
          setLoadingContraseña(false)
        });
    } else {
      cogoToast.warn('No se encontró el id del usuario.', { position: 'top-right' });
    };
  };

  const cambiarInput = (field, value) => {
    setUsuarioObj({
      ...usuarioObj,
      [field]: value
    })
  };

  const limpiarInputs = () => {
    setPassword(null);
    setNewPassword1(null);
    setNewPassword2(null);
  };

  return (
    <div>
      <TituloVista titulo="Datos de Usuario" subtitulo="Perfil"/>
      <Contenedor>
        {
          loadingUsuario ? <div style={{ margin: '2rem', justifyContent: 'center', display: 'flex' }}><Spin spinning size="large"/></div> :
          <div style={{ margin: '1rem .5rem' }}>
            <h3>Editar Datos Personales:</h3>
            <Row style={{ margin: '1rem 0' }}>
              <Col sm={12}>
                <Space direction="vertical">
                  <Input 
                    addonBefore="Nombre:" 
                    placeholder="Nombre" 
                    style={{ width: '400px' }} 
                    value={usuarioObj.nombre ? usuarioObj.nombre : null}
                    onChange={(e) => cambiarInput('nombre', e.currentTarget.value)}
                  />
                  <Input 
                    addonBefore="Apellidos:" 
                    placeholder="Apellidos" 
                    style={{ width: '400px', marginBottom: '.5rem' }}
                    value={usuarioObj.apellidos ? usuarioObj.apellidos : null}
                    onChange={(e) => cambiarInput('apellidos', e.currentTarget.value)}
                  />
                  <Input 
                    addonBefore="Correo:" 
                    placeholder="Correo" 
                    style={{ width: '400px', marginBottom: '.5rem' }}
                    value={ usuarioObj.usuario && usuarioObj.usuario.email ? usuarioObj.usuario.email : null }
                    onChange={(e) => setUsuarioObj({...usuarioObj, usuario: { ...usuarioObj.usuario, email: e.target.value }})}
                  />
                  <Input 
                    onChange={(e) => cambiarInput('nacionalidad', e.currentTarget.value)} 
                    value={usuarioObj.nacionalidad ? usuarioObj.nacionalidad : null}
                    addonBefore="Nacionalidad" 
                    placeholder="Nacionalidad" 
                    style={{ width: '400px' }}
                  />
                </Space>
              </Col>
              <Col sm={12}>
                <Space direction="vertical">
                  <span>Fecha de Nacimiento:</span>
                  <DatePicker 
                    placeholder="Fecha de Nacimiento" 
                    style={{ width: '400px' }}
                    value={usuarioObj.fecha_nacimiento ? moment(usuarioObj.fecha_nacimiento) : null}
                    onChange={(_, e) => cambiarInput('fecha_nacimiento', e)}
                  />
                  <span>Tipo de Documento:</span>
                  <Select onChange={(e) => cambiarInput('tipo_documento', e)} value={usuarioObj.tipo_documento ? usuarioObj.tipo_documento : null} style={{ width: '400px' }} placeholder="Seleccionar tipo de Documento">
                    <Option value="DNI">DNI</Option>
                    <Option value="Otro">Otros</Option>
                  </Select>
                  <Input 
                    onChange={(e) => cambiarInput('numero_documento', e.currentTarget.value)} 
                    value={usuarioObj.numero_documento ? usuarioObj.numero_documento : null}
                    addonBefore="Número de Documento" 
                    placeholder="Numero de Documento" 
                    style={{ width: '400px' }}
                  />
                </Space>
              </Col>
            </Row>
            <Row style={{ marginBottom: '3rem' }}>
              <span>Imagen de Perfil:</span><br/>
              <Radio.Group 
                value={usuarioObj.usuario && usuarioObj.usuario.imagen ? usuarioObj.usuario.imagen : null} 
                onChange={(e) => setUsuarioObj({...usuarioObj, usuario: { ...usuarioObj.usuario, imagen: e.target.value }})}
              >
              {avatares.map((img, i) => (
                <Radio value={img} key={i} style={{ margin: '.5rem' }}>
                  <Avatar
                    size={{ xs: 20, sm: 28, md: 36, lg: 60, xl: 76, xxl: 90 }}
                    src={<Image src={img}/>}
                  />,
                </Radio>
              ))
              }
              </Radio.Group>
            </Row>
            <Button onClick={actualizarPerfil} type="primary" loading={loadingActualizar}>Guardar</Button>
          </div>
        }
      </Contenedor>
      <Contenedor>
        <div style={{ margin: '1rem .5rem' }}>
          <h3>Cambiar Constraseña:</h3>
          <Space direction="vertical">
            <span>Contraseña actual:</span>
            <Input.Password required style={{ width: 300 }} onChange={(e) => setPassword(e.currentTarget.value)} value={password}/><br/>
            <span>Nueva contraseña:</span>
            <Input.Password required style={{ width: 300 }} onChange={(e) => setNewPassword1(e.currentTarget.value)} value={newPassword1}/><br/>
            <span>Repetir contraseña:</span>
            <Input.Password required style={{ width: 300 }} onChange={(e) => setNewPassword2(e.currentTarget.value)} value={newPassword2}/><br/>
          </Space>
        </div>
        <Button style={{ marginBottom: '1rem' }} type="primary" onClick={actualizarContraseña} loading={loadingContraseña}>Guardar</Button>
      </Contenedor>
    </div>
  );
};

