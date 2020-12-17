import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Input, DatePicker } from 'antd';
import moment from 'moment';



function ModalContrata({visible, setVisible, accion, guardar, contrata={}}) {
  const [nombre, setNombre] = useState(null);
  const [ruc, setRuc] = useState(null);
  const [fecha_incorporacion, setFecha_incorporacion] = useState(null);
  const [observacion, setObservacion] = useState(null)

  useEffect(() => {
    if (contrata.nombre) {
      setNombre(contrata.nombre);
      setRuc(contrata.ruc);
      setFecha_incorporacion(contrata.fecha_incorporacion);
      setObservacion(contrata.observacion);
    }
  // eslint-disable-next-line
  },[contrata]);

  const limpiarEstados = async () => {
    setNombre(null);
    setRuc(null);
    setFecha_incorporacion(null);
    setObservacion(null);
    setVisible(false);
  };

  const onOk = async () => {
    await guardar({nombre, ruc, 
      fecha_incorporacion: fecha_incorporacion && fecha_incorporacion, 
      observacion: observacion && observacion
    }, contrata.id);
    limpiarEstados();
  }

  return (
    <Modal
      width={270}
      cancelText="Cancelar"
      okText="Guardar"
      title={accion === 'crear' ? 'Crear Contrata':'Editar Contrata'}
      visible={visible}
      onOk={onOk}
      onCancel={limpiarEstados}
      destroyOnClose={true}
      centered
    >
        <p>Nombre de Contrata:</p>
        <Input
          placeholder="Nombre de Contrata" 
          defaultValue={nombre} 
          onChange={e => setNombre(e.target.value)}
        /><br/><br/>
        <p>RUC:</p>
        <Input 
          placeholder="RUC" 
          defaultValue={ruc} 
          onChange={e => setRuc(e.target.value)}
        /><br/><br/>
        <p>Fecha de Incorporación:</p>
        <DatePicker
          defaultValue={fecha_incorporacion && moment.utc(fecha_incorporacion)} 
          onChange={(_, date) => setFecha_incorporacion(date)}
        /><br/><br/>
        <p>Observacion:</p>
        <Input
          placeholder="Observacion" 
          defaultValue={observacion} 
          onChange={e => setObservacion(e.target.value)}
        /><br/><br/>
    </Modal>
  )
}

ModalContrata.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  accion: PropTypes.string,
  guardar: PropTypes.func,
  contrata: PropTypes.object,
}

export default ModalContrata

