import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Modal, Select } from 'antd';

const { Option } = Select;
 
function ModalAsignar({tecnicos=[], abrir, visible, guardar}) {
  const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState(null);

  async function asignarTecnico() {
    await guardar(tecnicoSeleccionado);
    abrir();
  };

  return (
    <Modal
      title="Asignar Técnico"
      width={450}
      visible={visible}
      onOk={asignarTecnico}
      onCancel={abrir}
      afterClose={() => setTecnicoSeleccionado(null)}
      centered
    > 
      <Select 
        placeholder="Seleccionar Técnico"
        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 }
        style={{ width: 400 }}
        value={tecnicoSeleccionado}
        onChange={(e) => setTecnicoSeleccionado(e)}
        showSearch
      >
      {
        tecnicos && tecnicos.length > 0 ? tecnicos.map((e, i) => (
          <Option key={i} value={e._id}>{`${e.nombre} ${e.apellidos}`}</Option>
        )):null
      }
      </Select>

    </Modal>
  )
}

ModalAsignar.propTypes = {
  tecnicos: PropTypes.array,
  abrir: PropTypes.func,
  visible: PropTypes.bool,
  guardar: PropTypes.func
}

export default ModalAsignar

