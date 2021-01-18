import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Modal, Select, Input, DatePicker, Button } from 'antd'

const { Option } = Select;
const { TextArea } = Input;

function ModalAgendarTecnico({visible, abrir, buckets=[], tecnicos=[], agendar}) {
  const [bucketSeleccionado, setBucketSeleccionado] = useState(null);
  const [contrataSeleccionada, setContrataSeleccionada] = useState(null);
  const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState(null);
  const [fechaCita, setFechaCita] = useState(null);
  const [observacion, setObservacion] = useState(null);
  const [loadingAgendar, setLoadingAgendar] = useState(false);

  useEffect(() => {
    setBucketSeleccionado(null);
    setContrataSeleccionada(null);
    setTecnicoSeleccionado(null);
    setFechaCita(null);
    setObservacion(null);
  }, [])

  const agendarOrden = async () => {
    setLoadingAgendar(true)
    await agendar(bucketSeleccionado, contrataSeleccionada, tecnicoSeleccionado, fechaCita, observacion);
    setLoadingAgendar(false);
    abrir();
  };

  const seleccionarTecnico = (i) => {
    setContrataSeleccionada(tecnicos[i].contrata._id);
    setTecnicoSeleccionado(tecnicos[i]._id)
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
        showSearch
        placeholder="Seleccionar Tecnico"
        style={{ width: 300, marginBottom: '.5rem' }}
        onChange={(e) => seleccionarTecnico(e)}
        defaultValue={tecnicoSeleccionado}
        filterOption={(input, option) => {
          return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      }
      >
      {
        tecnicos && tecnicos.length > 0 ? 
        tecnicos.map((b, i) => (
          <Option value={i} key={i}>{b && b.nombre + ' ' + b.apellidos}</Option>
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

ModalAgendarTecnico.propTypes = {
  visible: PropTypes.bool,
  abrir: PropTypes.func,
  buckets: PropTypes.array,
  tecnicos: PropTypes.array,
  agendar: PropTypes.func
};

export default ModalAgendarTecnico

