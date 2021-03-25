import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Table, Tag, Typography } from 'antd';
import moment from 'moment';

const { Text } = Typography;

function ModalDetalleOrden({ordenes=[], visible, abrir, horas}) {

  const columnasDetalle = [
    {
      title: '#',
      width: 40,
      align: 'center',
      render: (_,__,i) => i+1
    },
    {
      title: 'Requerimiento',
      dataIndex: 'requerimiento',
      width: 115,
      align: 'center',
      render: (r) => <Text copyable>{r}</Text>
    },
    {
      title: 'Cliente',
      dataIndex: 'codigo_cliente',
      width: 100,
      align: 'center',
      render: (r) => <Text copyable>{r}</Text>
    },
    {
      title: 'Gestor',
      dataIndex: 'gestor',
      width: 180,
      ellipsis: true,
      render: (t) => t && t.nombre ? <Text>{`${t.nombre} ${t.apellidos}`}</Text> : '-'
    },
    {
      title: 'Tecnico',
      dataIndex: 'tecnico',
      width: 180,
      ellipsis: true,
      render: (t) => t && t.nombre ? <Text>{`${t.nombre} ${t.apellidos}`}</Text> : '-'
    },
    {
      title: 'Carnet',
      dataIndex: 'carnet',
      width: 80,
      align: 'center'
    },
    {
      title: 'Actividad',
      dataIndex: 'subtipo_actividad',
      width: 220,
    },
    {
      title: 'Tipo de Cita',
      dataIndex: 'tipo_cita',
      width: 150,
    },
    {
      title: 'Fecha Registro',
      dataIndex: 'fecha_registro_legados',
      width: 120,
      align: 'center',
      render: (f) => moment(f).format('DD/MM/YY HH:mm')
    },
    {
      title: 'Fecha Liquidado',
      dataIndex: 'fecha_pre_no_realizado',
      width: 120,
      align: 'center',
      render: (f) => moment(f).format('DD/MM/YY HH:mm')
    },
    {
      title: 'Horas',
      dataIndex: 'fecha_registro_legados',
      width: 60,
      align: 'center',
      render: (f, row) => {
        let a = moment(row.fecha_pre_no_realizado).diff(f, 'hour');
        if (a < horas) {
          return <Tag color="success">{a}</Tag>
        } else {
          return <Tag color="error">{a}</Tag>
        }
      }
    }
  ];

  return (
    <Modal
      title="Lista de Ordenes"
      visible={visible}
      onOk={abrir}
      onCancel={abrir}
      footer={false}
      width="85vw"
      centered
    >
      <Table
        rowKey="requerimiento"
        dataSource={ordenes}
        columns={columnasDetalle}
        pagination={{
          pageSize: 50
        }}
        size="small"
        bordered
        scroll={{ y: '60vh', x: '80vw' }}
      />
    </Modal>
  )
};

ModalDetalleOrden.propTypes = {
  ordenes: PropTypes.array,
  visible: PropTypes.bool,
  abrir: PropTypes.func,
  horas: PropTypes.number
};

export default ModalDetalleOrden;

