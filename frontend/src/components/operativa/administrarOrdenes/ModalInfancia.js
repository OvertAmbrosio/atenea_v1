import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Table } from 'antd';
import moment from 'moment';
import TagEstado from './TagEstado';

function ModalInfancia({visible, abrir, loading, orden}) {

  const columnas = [
    {
      title: '#',
      width: 50,
      render: (_,__,i) => i+1
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      width: 120,
    },
    {
      title: 'Tecnico',
      dataIndex: 'tecnico',
      width: 180,
      render: (u) => u ? u.nombre + ' ' + u.apellidos : '-'
    },
    {
      title: 'Estado Gestor',
      dataIndex: 'estado_gestor',
      width: 120,
      render: (e) => <TagEstado estado={e} />
    },
    {
      title: 'Estado Liquidacion',
      dataIndex: 'estado_liquidado',
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

