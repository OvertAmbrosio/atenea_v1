import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Select, Input, DatePicker } from 'antd';
import { socket } from '../../../../services/socket';
import metodos from '../../../../constants/metodos';
import cogoToast from 'cogo-toast';

const { Option } = Select;
const { TextArea } = Input;

function ModalAgendar({visible, abrir, gestores=[], ordenes=[], setLoading, usuario, tipo}) {

  const [gestorSeleccionado, setGestorSeleccionado] = useState(null);
  const [fechaCita, setFechaCita] = useState(null);
  const [observacion, setObservacion] = useState(null);

  useEffect(() => {
    setGestorSeleccionado(null);
    setFechaCita(null);
    setObservacion(null);
  }, [])

  const agendarOrden = () => {
    if (!gestorSeleccionado) return cogoToast.warn("Debes seleccionar un gestor.", { position: "top-right" });
    if (!fechaCita) return cogoToast.warn("Debes seleccionar una fecha.", { position: "top-right" });
    setLoading(true);
    socket.emit(metodos.ORDENES_SOCKET_AGENDAR, {
      tipo,
      usuario,
      ordenes,
      observacion,
      fechaCita: fechaCita.toDate(),
      gestor: gestorSeleccionado,
    });
    abrir()
  };

  return (
    <Modal
      title="Agendar Orden"
      width={400}
      visible={visible}
      onCancel={abrir}
      onOk={agendarOrden}
      afterClose={() => {
        setGestorSeleccionado(null);
        setFechaCita(null);
        setObservacion(null);
      }}
      destroyOnClose
      centered
    >
      <Select
        showSearch
        placeholder="Seleccionar Gestor"
        style={{ width: 300, marginBottom: '.5rem' }}
        onChange={(e) => setGestorSeleccionado(e)}
        defaultValue={gestorSeleccionado}
        filterOption={(input, option) => {
          return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      }
      >
      {
        gestores && gestores.length > 0 ? 
        gestores.map((b, i) => (
          <Option value={b._id} key={i}>{b.nombre}</Option>
        ))
        :
        <Option>Sin data</Option>
      }
      </Select>
      <DatePicker 
        value={fechaCita}
        placeholder="Seleccionar fecha de cita"
        style={{ width: 300, marginBottom: '.5rem' }}
        onChange={(fecha) => setFechaCita(fecha)} 
      />
      <TextArea 
        rows={4} 
        style={{ width: 300 }}
        defaultValue={observacion}
        placeholder="Observacion"
        onChange={(e) => setObservacion(e.target.value)}
      />
    </Modal>
  )
}

ModalAgendar.propTypes = {
  visible: PropTypes.bool,
  abrir: PropTypes.func,
  buckets: PropTypes.array,
  contratas: PropTypes.array,
  gestores: PropTypes.array,
  agendar: PropTypes.func
}

export default ModalAgendar

