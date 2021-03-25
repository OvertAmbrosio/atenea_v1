import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Select, DatePicker, Space } from 'antd';
import metodos from '../../../constants/metodos';
import { patchEmpleados } from '../../../services/apiEmpleado';

const { Option } = Select;

function ModalEstado({visible, setVisible, listarEmpleados, id}) {
  const [estado, setEstado] = useState(1);
  const [fechaBaja, setFechaBaja] = useState('');

  async function onOk() {
    await patchEmpleados(true, { 
      id, 
      metodo: metodos.EMPLEADOS_EDITAR_ESTADO_EMPRESA,
      fecha_baja: fechaBaja, 
      estado_empresa: estado
    }).then(async () => {
        setVisible(false);
        await listarEmpleados();
      }).catch((e) => console.log(e));
  };

  const cambiarFecha = (_,b) => setFechaBaja(b);

  const cambiarEstado = (v) => setEstado(v);

  return (
    <Modal
      title="Estado Empresa"
      visible={visible}
      width={300}
      onOk={onOk}
      onCancel={() => setVisible(false)}
      centered
    >
      <p style={{ fontSize: '13px', color: 'rgba(0,0,0,.55)' }}>
        *Un usuario "Activo" tiene la cuenta habilitada y aparece en las listas del personal (ordenes, inventario, etc.)
      </p>
      <p style={{ fontSize: '13px', color: 'rgba(0,0,0,.55)' }}>
        *Un usuario "Suspendido" no podrá iniciar sesión en el sistema, pero seguirá apareciendo en las listas del personal (ordenes, inventario, etc.)
      </p>
      <p style={{ fontSize: '13px', color: 'rgba(0,0,0,.55)' }}>
        *Un usuario "Inactivo" no podrá iniciar sesión en el sistema y desaparecerá por completo de las listas del sistema (usuario de baja)  
      </p>      
      <Space direction="vertical">
        Seleccionar: 
        <Select 
          defaultValue={estado}
          onChange={cambiarEstado}
          style={{ width: 150 }}
        >
          <Option value={1}>Activo</Option>
          <Option value={2}>Suspendido</Option>
          <Option value={3}>Inactivo</Option>
        </Select>
        Fecha de suspensión / baja:
        <DatePicker onChange={cambiarFecha} />
      </Space>
    </Modal>
  )
}

ModalEstado.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  listarEmpleados: PropTypes.func,
  id: PropTypes.string
}

export default ModalEstado

