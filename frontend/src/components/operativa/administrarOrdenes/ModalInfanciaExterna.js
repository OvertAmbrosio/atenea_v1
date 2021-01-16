import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Modal, Table, Tooltip, Typography } from 'antd';
import moment from 'moment';

const { Text } = Typography;

function ModalInfanciaExterna({visible, abrir, orden={}}) {
  const [dataOrden, setDataOrden] = useState([]);

  useEffect(() => {
    if (orden && orden.codigo_requerimiento) {
      setDataOrden([orden]);
    } else {
      setDataOrden([]);
    }
  },[orden]);
  // codigo_requerimiento
  // codigo_trabajo
  // codigo_cliente
  // nombre_cliente
  // codigo_ctr
  // fecha_liquidado
  // observacion_liquidado
  const columnas = [
   {
      title: 'Requerimiento',
      dataIndex: 'codigo_requerimiento',
      width: 120,
      render: (u) => u ? <Text copyable>{u}</Text> : '-'
    },
    {
      title: 'Orden Trabajo',
      dataIndex: 'codigo_trabajo',
      width: 120,
      render: (u) => u ? <Text copyable>{u}</Text> : '-'
    },
    {
      title: 'Codigo Cliente',
      dataIndex: 'codigo_cliente',
      width: 120,
      render: (u) => u ? <Text copyable>{u}</Text> : '-'
    },
    {
      title: 'Cliente',
      dataIndex: 'nombre_cliente',
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (c) => (
        <Tooltip placement="topLeft" title={c}>
          {c}
        </Tooltip>
      )
    },
    {
      title: 'CTR',
      dataIndex: 'codigo_ctr',
      width: 80,
    },
    {
      title: 'Fecha Liquidado',
      dataIndex: 'fecha_liquidado',
      width: 150,
      render: (f) => f ? moment(f).format('DD-MM-YYYY HH:mm') : '-'
    },
    {
      title: 'Observacion',
      dataIndex: 'observacion_liquidado',
      width: 200,
    },
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
        dataSource={dataOrden}
        size="small"
        pagination={false}
        scroll={{ x: '80vw' }}
      />
    </Modal>
  )
};

ModalInfanciaExterna.propTypes = {
  visible: PropTypes.bool,
  abrir: PropTypes.func,
  orden: PropTypes.object
};

export default ModalInfanciaExterna;

