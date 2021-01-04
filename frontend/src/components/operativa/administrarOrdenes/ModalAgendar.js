import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Modal, Select, Input, DatePicker, Button } from 'antd'

const { Option } = Select;
const { TextArea } = Input;

function ModalAgendar({visible, abrir, buckets=[], contratas=[], gestores=[], agendar}) {
  const [bucketSeleccionado, setBucketSeleccionado] = useState(null);
  const [contrataSeleccionada, setContrataSeleccionada] = useState(null);
  const [gestorSeleccionado, setGestorSeleccionado] = useState(null);
  const [fechaCita, setFechaCita] = useState(null);
  const [observacion, setObservacion] = useState(null);
  const [loadingAgendar, setLoadingAgendar] = useState(false);

  useEffect(() => {
    setBucketSeleccionado(null);
    setContrataSeleccionada(null);
    setGestorSeleccionado(null);
    setFechaCita(null);
    setObservacion(null);
  }, [])

  const agendarOrden = async () => {
    setLoadingAgendar(true)
    await agendar(bucketSeleccionado, contrataSeleccionada, gestorSeleccionado, fechaCita, observacion);
    setLoadingAgendar(false);
    abrir();
  };

  return (
    <Modal
      title="Agendar Orden"
      width={400}
      visible={visible}
      onCancel={abrir}
      onOk={agendarOrden}
      confirmLoading
      destroyOnClose
      centered
      footer={[
        <Button key="back" onClick={abrir}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" loading={loadingAgendar} onClick={agendarOrden}>
          Aceptar
        </Button>,
      ]}
    >
      <Select
        placeholder="Seleccionar Bucket"
        style={{ width: 300, marginBottom: '.5rem' }}
        onChange={(e) => setBucketSeleccionado(e)}
        defaultValue={bucketSeleccionado}
      >
      {
        buckets && buckets.length > 0 ? 
        buckets.map((b, i) => (
          <Option value={b.value} key={i}>{b.text}</Option>
        ))
        :
        <Option>Sin data</Option>
      }
      </Select>
      <Select
        placeholder="Seleccionar Contrata"
        style={{ width: 300, marginBottom: '.5rem' }}
        onChange={(e) => setContrataSeleccionada(e)}
        defaultValue={contrataSeleccionada}
      >
      {
        contratas && contratas.length > 0 ? 
        contratas.map((c, i) => (
          <Option value={c._id} key={i}>{c.nombre}</Option>
        ))
        :
        <Option>Sin data</Option>
      }
      </Select>
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
        placeholder="Seleccionar fecha de cita"
        style={{ width: 300, marginBottom: '.5rem' }}
        onChange={(e) => setFechaCita(e.utc().format('YYYY-MM-DD HH:mm'))} 
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

