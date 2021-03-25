import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Select, Input, Typography } from 'antd'
import { LoadingOutlined, SaveOutlined } from '@ant-design/icons';
import moment from 'moment';

import estadoAsistencia from '../../../constants/estadoAsistencia';
import { postAsistencias } from '../../../services/apiAsistencia';
import cogoToast from 'cogo-toast';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

function ModalCrearAsistencia({actualizar, row, fecha, visible, abrir}) {
  const [loadingCrear, setLoadingCrear] = useState(false);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
  const [observacion, setObservacion] = useState(null);

  useEffect(() => {
    setEstadoSeleccionado(null);
    setObservacion(null);
  }, [])

  async function guardar() {
    if (moment(fecha).isValid() && row.idEmpleado && estadoSeleccionado) {
      setLoadingCrear(true);
      return await postAsistencias({id: row.idEmpleado, tipo: row.tipo, estado: estadoSeleccionado, fecha: fecha, observacion})
        .catch((err) => console.log(err))
        .finally(() => {
          setLoadingCrear(false);
          abrir()
          actualizar()
        })
    } else {
      cogoToast.warn('No hay una fecha valida o no se encontró el id', { position: 'top-right' })
      console.log(fecha, row);
    }
  };

  return (
    <Modal
      title="Actualizar el estado de la asistencia"
      onCancel={abrir}
      visible={visible}
      width={350}
      centered
      destroyOnClose
      footer={[
        <Button key="back" onClick={abrir}>
          Cancelar
        </Button>,
        <Button 
          icon={loadingCrear ? <LoadingOutlined spin/> : <SaveOutlined/>} 
          disabled={loadingCrear}
          key="submit" 
          type="primary" 
          onClick={guardar}
        >
          Aceptar
        </Button>,
      ]}
    >
      {
        moment(fecha).isValid() ?
        <Text type="secondary">Fecha: {moment(fecha).format('DD-MM-YY')}</Text>:
        <Text type="danger">Fecha Invalida.</Text>
      }<br/><br/>
      <p>Seleccionar Estado:</p>
      <Select
        placeholder="Estado"
        defaultValue={estadoSeleccionado}
        onChange={e => setEstadoSeleccionado(e)} 
        style={{ width: 300, marginBottom: '.5rem', marginRight: '.5rem' }}
      >
        <Option value={estadoAsistencia.ASISTIO}>Asistió</Option>
        <Option value={estadoAsistencia.FALTA}>Falta</Option>
        <Option value={estadoAsistencia.TARDANZA}>Tardanza</Option>
        <Option value={estadoAsistencia.DESCANSO}>Descanso</Option>
        <Option value={estadoAsistencia.GUARDIA}>Guardia</Option>
        <Option value={estadoAsistencia.PERMISO}>Permiso</Option>
        <Option value={estadoAsistencia.DESCANSO_MEDICO}>Descanso Médico</Option>
        <Option value={estadoAsistencia.EXAMEN_MEDICO}>Examen Médico</Option>
        <Option value={estadoAsistencia.SUSPENDIDO}>Suspendido</Option>
        <Option value={estadoAsistencia.VACACIONES}>Vacaciones</Option>
        <Option value={estadoAsistencia.BAJA}>Baja</Option>
      </Select>
      <p>Observación:</p>
      <TextArea
        placeholder="Observación..."
        rows={4}
        value={observacion}
        onChange={(e) => setObservacion(e.target.value)}
      />
    </Modal>
  )
}

ModalCrearAsistencia.propTypes = {
  actualizar: PropTypes.func,
  row: PropTypes.object,
  fecha: PropTypes.any,
  visible: PropTypes.bool,
  abrir: PropTypes.func
}

export default ModalCrearAsistencia

