import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Input, InputNumber, Modal } from 'antd';

function ModalCargo({obj={}, visible, abrir, guardar}) {
  const [id, setId] = useState(null);
  const [nombre, setNombre] = useState(null);
  const [nivel, setNivel] = useState(null);

  useEffect(() => {
    setId(null);
    setNombre(null);
    setNivel(null);
  //eslint-disable-next-line
  },[]);

  useEffect(() => {
    if (obj && obj.nombre) {
      setId(obj._id)
      setNombre(obj.nombre);
      setNivel(obj.nivel);
    }
  //eslint-disable-next-line
  },[obj])

  async function guardarCambios() {
    return await guardar(id, nombre, nivel)
  };

  return (
    <Modal
      visible={visible}
      onOk={guardarCambios}
      onCancel={abrir}
      width={350}
      centered
      destroyOnClose
    >
      <h3>Nombre</h3>
      <Input 
        value={nombre}
        size="small"
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre"
      /><br/><br/>
      <h3>Nivel</h3>
      <InputNumber
        value={nivel}
        size="small"
        onChange={(e) => setNivel(e)}
        placeholder="Nivel"
      />
    </Modal>
  )
};

ModalCargo.propTypes = {
  obj: PropTypes.object,
  visible: PropTypes.bool,
  abrir: PropTypes.func,
  guardar: PropTypes.func
};

export default ModalCargo;

