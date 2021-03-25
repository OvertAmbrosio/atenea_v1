import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Modal, Radio, Space } from 'antd';


function ModalEliminar({visible, setVisible, guardar, contrata={}}) {
  const [activo, setActivo] = useState(true);
  const [fecha_baja, setFecha_baja] = useState(null);

  async function onOk() {
    if (contrata._id) {
      await guardar(contrata._id, { activo, fecha_baja });
      limpiarModal();
    } else {  
      console.log('objeto contrata vacio.')
    }
  };

  const cambiarEstado = (e) => setActivo(e.target.value);
  const cambiarFecha = (_,f) => setFecha_baja(f);

  const limpiarModal = () => {
    setActivo(true);
    setFecha_baja(null);
    setVisible(false);
  };

  return (
    <Modal
      width={250}
      cancelText="Cancelar"
      okText="Guardar"
      title="Desactivar Contrata"
      visible={visible}
      onOk={onOk}
      onCancel={limpiarModal}
      destroyOnClose={true}
      centered
    >
      <Space direction="vertical">
        <p style={{ fontSize: '13px', color: 'rgba(0,0,0,.55)' }}>
          *La contrata no se eliminará de la base de datos, pero si dejará de aparecer en las listas del sistema.
        </p>
        Seleccionar estado:
        <Radio.Group onChange={cambiarEstado} value={activo}>
          <Radio value={true}>Activo</Radio>
          <Radio value={false}>Inactivo</Radio>
        </Radio.Group>
        Seleccionar fecha de baja:
        <DatePicker onChange={cambiarFecha}/>
      </Space>
    </Modal>
  )
};

ModalEliminar.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  guardar: PropTypes.func,
  contrata: PropTypes.object
};

export default ModalEliminar;

