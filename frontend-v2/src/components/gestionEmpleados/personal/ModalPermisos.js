import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Select } from 'antd';

import { patchEmpleados } from '../../../services/apiEmpleado';
import metodos from '../../../constants/metodos';

// const { Option } = Select;

function ModalPermisos({visible, setVisible, listarEmpleados, id}) {
  const [cargo, setCargo] = useState(4);

  async function actualizarCargo() {
    await patchEmpleados(true, { id, metodo: metodos.EMPLEADOS_ACTUALIZAR_PERMISOS, cargo } )
      .then(() => setVisible(!visible))
      .catch((error) => {
        setVisible(false);
        console.log(error);
      })
  };

  const cambiarCargo = (value) => setCargo(value);

  return (
    <Modal
      title="Actualizar Cargo"
      visible={visible}
      width={300}
      onOk={actualizarCargo}
      onCancel={() => setVisible(false)}
      centered
    >
      <p style={{ fontSize: '13px', color: 'rgba(0,0,0,.55)' }}>
        *Recuerda que no es posible otorgar un cargo superior 
        al tuyo y que todo cambio quedará registrado en el 
        sistema.
      </p>
      <p>Seleccionar Cargo:</p>
      <Select
        defaultValue={cargo}
        onChange={cambiarCargo}
        style={{ width: 180 }}
      >
        {/* <Option value={cargos.LIDER_GESTION}>Lider de Gestion</Option>
        <Option value={cargos.ASISTENTE_LOGISTICA}>Asistente de Logistica</Option>
        <Option value={cargos.JEFE_CONTRATA}>Jefe de contrata</Option>
        <Option value={cargos.GESTOR}>Gestor</Option>
        <Option value={cargos.ALMACENERO}>Almacenero</Option>
        <Option value={cargos.AUDITOR}>Auditor</Option>
        <Option value={cargos.TECNICO}>Tecnico</Option> */}
      </Select>
    </Modal>
  )
}

ModalPermisos.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  listarEmpleados: PropTypes.func,
  id: PropTypes.string
}

export default ModalPermisos

