import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Table, Typography } from 'antd';
import moment from 'moment';

import TagEstado from './TagEstado';

const { Text } = Typography;

function ModalInfancia({visible, abrir, loading, orden}) {

  const columnas = [
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      width: 120,
    },
    {
      title: 'Requerimiento',
      dataIndex: 'codigo_requerimiento',
      width: 120,
      render: (u) => u ? <Text copyable>{u}</Text> : '-'
    },
    {
      title: 'Tecnico',
      dataIndex: 'tecnico_liquidado',
      width: 180,
      render: (u) => u ? u.nombre + ' ' + u.apellidos : '-'
    },
    {
      title: 'Carnet',
      dataIndex: 'tecnico_liquidado',
      width: 180,
      render: (u) => u ? <Text copyable>{u.carnet}</Text> : '-'
    },
    {
      title: 'Gestor',
      dataIndex: 'tecnico_liquidado',
      width: 180,
      render: (u) => u && u.gestor && u.gestor.nombre ? u.gestor.nombre + ' ' + u.gestor.apellidos : '-'
    },
    {
      title: 'Estado Gestor',
      dataIndex: 'estado_gestor',
      width: 120,
      render: (e) => <TagEstado estado={e} />
    },
    {
      title: 'Fecha Registro',
      dataIndex: 'fecha_registro',
      width: 150,
      render: (f) => f ? moment(f).format('DD-MM-YYYY HH:mm') : '-'
    },
    {
      title: 'Fecha Liquidado',
      dataIndex: 'fecha_liquidado',
      width: 150,
      render: (f) => f ? moment(f).format('DD-MM-YYYY HH:mm') : '-'
    }
  ];

  return (
    <Modal
      title="Orden de Infancia"
      visible={visible}
      onCancel={abrir}
      onOk={abrir}
      width="90vw"
      destroyOnClose
      centered
    >
      <Table
        rowKey="_id"
        columns={columnas}
        dataSource={orden}
        loading={loading}
        size="small"
        pagination={false}
        scroll={{ x: '80vw' }}
      />
    </Modal>
  )
};

ModalInfancia.propTypes = {
  visible: PropTypes.bool,
  abrir: PropTypes.func,
  loading: PropTypes.bool,
  orden: PropTypes.array
};

export default ModalInfancia

