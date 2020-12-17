import React from 'react';
import PropTypes from 'prop-types';
import { Descriptions, Modal, Typography } from 'antd';
import moment from 'moment';

const { Text } = Typography;

function ModalDetalle({visible, abrirModal, empleado={}}) {
  return (
    <Modal
      width={450}
      cancelText="Cancelar"
      okText="Aceptar"
      title="Detalle del Usuario"
      visible={visible}
      onOk={abrirModal}
      onCancel={abrirModal}
      destroyOnClose={true}
      centered
    >
      <Descriptions layout="vertical" bordered size="small" column={2}>
        {empleado.gestor&&(<Descriptions.Item label="Gestor:">{empleado.gestor.nombre && empleado.gestor.nombre}</Descriptions.Item>)}
        <Descriptions.Item label="Tipo de Doc.:">{empleado.tipo_documento}</Descriptions.Item>
        <Descriptions.Item label="Numero de Doc.:">
          <Text copyable>{empleado.numero_documento}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Fecha de Nacimiento:">{empleado.fecha_nacimiento && moment(empleado.fecha_nacimiento).format('DD-MM-YYYY')}</Descriptions.Item>
        {empleado.fecha_ingreso&&(<Descriptions.Item label="Fecha de Ingreso">{moment(empleado.fecha_ingreso).format('DD-MM-YYYY')}</Descriptions.Item>)}
        {empleado.fecha_baja&&(<Descriptions.Item label="Fecha de Baja">{moment(empleado.fecha_baja).format('DD-MM-YYYY')}</Descriptions.Item>)}
        <Descriptions.Item label="Nacionalidad">{empleado.nacionalidad?empleado.nacionalidad:'-'}</Descriptions.Item>
        <Descriptions.Item label="Observación" span={2}>{empleado.observacion}</Descriptions.Item>
      </Descriptions>
    </Modal>
  )
}

ModalDetalle.propTypes = {
  visible: PropTypes.bool,
  abrirModal: PropTypes.func,
  empleado: PropTypes.object
}

export default ModalDetalle

