import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Select, Input, Radio } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

function ModalAsignar({visible, abrir, gestores=[], tecnicos=[], asignar}) {
  const [gestorSeleccionado, setGestorSeleccionado] = useState(null);
  const [tecnicoIndexSeleccionado, setTecnicoIndexSeleccionado] = useState(null);
  const [observacion, setObservacion] = useState(null);
  const [tipoAsignar, setTipoAsignar] = useState(1)

  useEffect(() => {
    setGestorSeleccionado(null);
    setTecnicoIndexSeleccionado(null);
  },[]);

  const asignarOrden = async () => {
    if (tipoAsignar === 1 && gestorSeleccionado) {
      await asignar({gestor: gestorSeleccionado, observacion});
    } else if(tipoAsignar === 2 && tecnicoIndexSeleccionado && tecnicos.length > 0) {
      const index = tecnicoIndexSeleccionado;
      const aux = {
        tecnico: tecnicos[index] ? tecnicos[index]._id: null,
        auditor: tecnicos[index] && tecnicos[index].auditor ? tecnicos[index].auditor._id : null,
        gestor: tecnicos[index] && tecnicos[index].gestor ? tecnicos[index].gestor._id : null,
        contrata: tecnicos[index] && tecnicos[index].contrata ? tecnicos[index].contrata._id : null,
        observacion
      };
      await asignar(aux);
    };
  };

  return (
    <Modal
      title="Asignar Orden"
      visible={visible}
      onCancel={abrir}
      onOk={asignarOrden}
      width={500}
      destroyOnClose
      centered
    >
      <p>Asignar por Gestor o Técnico:</p>
      <Radio.Group onChange={(e) => setTipoAsignar(e.target.value)} defaultValue={tipoAsignar} style={{ marginBottom: '1rem' }}>
        <Radio value={1}>Gestor</Radio>
        <Radio value={2}>Tecnico</Radio>
      </Radio.Group>
      {
        tipoAsignar === 1 ? 
        (<Select
          showSearch
          defaultValue={gestorSeleccionado}
          placeholder="Seleccionar Gestor"
          style={{ width: 350, marginBottom: '.5rem' }}
          onChange={(e) => setGestorSeleccionado(e)}
          filterOption={(input, option) => {
            return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        }
        >
          {
            gestores && gestores.length > 0 ? 
            gestores.map((g) => (
              <Option value={g._id} key={g._id}>{g.nombre}{` `}{g.apellidos}</Option>
            ))
            :<Option>No data</Option>
          }
        </Select>)
        :
        (<Select
          showSearch
          defaultValue={tecnicoIndexSeleccionado}
          placeholder="Seleccionar Tecnico"
          style={{ width: 350, marginBottom: '.5rem' }}
          onChange={(e) => setTecnicoIndexSeleccionado(e)}
          filterOption={(input, option) => {
            return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        }
        >
          {
            tecnicos && tecnicos.length > 0 ? 
            tecnicos.map((t,i) => (
              <Option value={i} key={t._id}>{t.nombre}{` `}{t.apellidos}</Option>
            ))
            :<Option>No data</Option>
          }
        </Select>)
      }
      <TextArea 
        placeholder="Observación"
        onChange={(e) => setObservacion(e.target.value)}
        rows={4} 
        style={{ width: 350 }}
      />
    </Modal>
  )
}

ModalAsignar.propTypes = {
  visible: PropTypes.bool,
  abrir: PropTypes.func,
  gestores: PropTypes.array,
  tecnicos: PropTypes.array,
  asignar: PropTypes.func
}

export default ModalAsignar

