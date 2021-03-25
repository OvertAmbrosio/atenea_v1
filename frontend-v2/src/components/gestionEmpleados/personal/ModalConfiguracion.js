import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { Button, Modal } from 'antd';
import { 
  LockOutlined, 
  CloseCircleOutlined, 
  CaretUpOutlined,
  UserOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import { patchEmpleados } from '../../../services/apiEmpleado';
import ModalPermisos from './ModalPermisos';
import metodos from '../../../constants/metodos';
import ModalEstado from './ModalEstado';

function ModalConfiguracion({visible, abrir, id, listarEmpleados}) {
  const [modalPermisos, setModalPermisos] = useState(false);
  const [modalEstados, setModalEstados] = useState(false);

  async function actualizarEmpleado(metodo) {
    await patchEmpleados(true, { id, metodo })
    .then(() => {
      listarEmpleados();
      abrir();
    })
    .catch((error) => console.log(error))
  };

  const abrirModalPermisos = () => setModalPermisos(!modalPermisos);
  const abrirModalEstado = () => setModalEstados(!modalEstados);

  const onOk = async () => {
    await listarEmpleados();
    abrir()
  }

  return (
    <Modal
      title="Configuraciones"
      visible={visible}
      width={250}
      onOk={onOk}
      onCancel={abrir}
      centered
    >
      <Button 
        block
        icon={<LockOutlined/>}
        style={{ marginBottom: '.5rem' }}
        onClick={() => actualizarEmpleado(metodos.EMPLEADOS_RESET_PASS)}
      >Reiniciar Contraseña</Button>
      <Button 
        block
        icon={<CloseCircleOutlined/>}
        style={{ marginBottom: '.5rem' }}
        onClick={() => actualizarEmpleado(metodos.EMPLEADOS_CERRAR_SESION)}
      >Cerrar Sessión</Button>
      <Button 
        block
        icon={<CaretUpOutlined/>}
        style={{ marginBottom: '.5rem' }}
        onClick={abrirModalPermisos}
      >Permisos</Button>
      <Button 
        block
        icon={<UserOutlined/>}
        style={{ marginBottom: '.5rem' }}
        onClick={() => actualizarEmpleado(metodos.EMPLEADOS_ACTIVAR_CUENTA)}
      >Activar Cuenta</Button>
      <Button 
        block
        danger
        icon={<ExclamationCircleOutlined/>}
        style={{ marginBottom: '.5rem' }}
        onClick={abrirModalEstado}
      >Cambiar Estado</Button>
      {/* MODAL PARA CAMBIAR LOS PERMISOS DEL USUARIO */}
      <ModalPermisos 
        visible={modalPermisos} 
        setVisible={setModalPermisos}
        listarEmpleados={listarEmpleados}
        id={id}
      />
      {/* MODAL PARA CAMBIAR EL ESTADO DEL EMPLEADO EN LA EMPRESA */}
      <ModalEstado
        visible={modalEstados}
        setVisible={setModalEstados}
        listarEmpleados={listarEmpleados}
        id={id}
      />

    </Modal>
  )
};

ModalConfiguracion.propTypes = {
  visible: PropTypes.bool,
  abrir: PropTypes.func,
  id: PropTypes.string,
  listarEmpleados: PropTypes.func
}

export default ModalConfiguracion

