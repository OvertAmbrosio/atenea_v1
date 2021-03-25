import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Select, Input } from 'antd';

import { listaEstadosGestor } from '../../../../constants/valoresOrdenes';
import capitalizar from '../../../../libraries/capitalizar';
import { socket } from '../../../../services/socket';
import metodos from '../../../../constants/metodos';
import cogoToast from 'cogo-toast';

const { Option } = Select;
const { TextArea } = Input;

function ModalEstado({tipo, visible, abrir, ordenes=[], usuario, setLoading}) {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
  const [observacion, setObservacion] = useState(null);

  useEffect(() => {
    setEstadoSeleccionado(null);
    setObservacion(null);
  }, []);

  async function actualizarOrden() {
    if (estadoSeleccionado) {
      setLoading(true);
      socket.emit(metodos.ORDENES_SOCKET_ESTADO, {
        tipo, usuario, ordenes,
        estado: estadoSeleccionado, observacion
      });
      abrir()
    } else {
      cogoToast.warn("Necesitar seleccionar un estado.")
    };    
  };

  return (
    <Modal
      title="Editar estado de la orden"
      visible={visible}
      onOk={actualizarOrden}
      onCancel={abrir}
      width={300}
      afterClose={() => {
        setEstadoSeleccionado(null);
        setObservacion(null);
      }}
      destroyOnClose
      centered
    >
      <Select 
        placeholder="Seleccionar estado"
        defaultValue={estadoSeleccionado} 
        onChange={e => setEstadoSeleccionado(e)}
        style={{ width: 250, marginBottom: '.5rem' }}
      >
        <Option value={listaEstadosGestor.PENDIENTE}>{capitalizar(listaEstadosGestor.PENDIENTE)}</Option>
        <Option value={listaEstadosGestor.ASIGNADO}>{capitalizar(listaEstadosGestor.ASIGNADO)}</Option>
        <Option value={listaEstadosGestor.AGENDADO}>{capitalizar(listaEstadosGestor.AGENDADO)}</Option>
        <Option value={listaEstadosGestor.INICIADO}>{capitalizar(listaEstadosGestor.INICIADO)}</Option>
        {/* <Option value={listaEstadosGestor.LIQUIDADO}>{capitalizar(listaEstadosGestor.LIQUIDADO)}</Option> */}
        <Option value={listaEstadosGestor.SUSPENDIDO}>{capitalizar(listaEstadosGestor.SUSPENDIDO)}</Option>
        <Option value={listaEstadosGestor.CANCELADO}>{capitalizar(listaEstadosGestor.CANCELADO)}</Option>
        <Option value={listaEstadosGestor.NO_REALIZADO}>No Realizado</Option>
        <Option value={listaEstadosGestor.PEXT}>{capitalizar(listaEstadosGestor.PEXT)}</Option>
        <Option value={listaEstadosGestor.REMEDY}>{capitalizar(listaEstadosGestor.REMEDY)}</Option>
      </Select>
      <TextArea
        placeholder="Observacion"
        defaultValue={observacion}
        rows={4}
        onChange={(e) => setObservacion(e.target.value)}
        style={{ marginBottom: '.5rem' }}
      />
    </Modal>
  )
};

ModalEstado.propTypes = {
  tipo: PropTypes.string,
  visible: PropTypes.bool,
  abrir: PropTypes.func,
  ordenes: PropTypes.array,
  usuario: PropTypes.object,
  setLoading: PropTypes.func,
};

export default ModalEstado;

