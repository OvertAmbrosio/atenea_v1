import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Table, Typography, Tooltip } from 'antd';
import moment from 'moment';

import { getOrdenes } from '../../../services/apiOrden';
import { ordenes } from '../../../constants/metodos';

const { Text } = Typography;

function ModalReiterada({abrir, visible, codigo_cliente}) {
  const [loading, setLoading] = useState(false);
  const [dataOrdenes, setDataOrdenes] = useState([]);

  useEffect(() => {
    if (codigo_cliente) {
      buscarReiteradas();
    }
  // eslint-disable-next-line
  },[codigo_cliente]);

  async function buscarReiteradas() {
    setLoading(true);
    await getOrdenes(true, { metodo: ordenes.BUSCAR_REITERADA, codigo_cliente }).then(({data}) => {
      if (data) {
        setDataOrdenes(data);
      }
    }).catch((e) => console.log(e)).finally(() => setLoading(false));
  };

  const columnas = [
    {
      title: '#',
      width: 50,
      render: (_,__,i) => i+1
    },
    {
      title: 'Requerimiento',
      dataIndex: 'codigo_requerimiento',
      width: 120,
      render: (req) => <Text copyable>{req}</Text>
    },
    {
      title: 'Cliente',
      dataIndex: 'nombre_cliente',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (cliente) => (
        <Tooltip placement="topLeft" title={cliente}>
          {cliente}
        </Tooltip>
      )
    },
    {
      title: 'Contrata',
      dataIndex: 'contrata',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (c) => (
        <Tooltip placement="topLeft" title={c ? c.nombre:'-'}>
          {c ? c.nombre:'-'}
        </Tooltip>
      )
    },
    {
      title: 'Gestor',
      dataIndex: 'gestor',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (g) => (
        <Tooltip placement="topLeft" title={g ? g.nombre+' '+g.apellidos:'-'}>
          {g ? g.nombre+' '+g.apellidos:'-'}
        </Tooltip>
      )
    },
    {
      title: 'Tecnico',
      dataIndex: 'tecnico',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (t) => (
        <Tooltip placement="topLeft" title={t ? t.nombre+' '+t.apellidos:'-'}>
          {t ? t.nombre+' '+t.apellidos:'-'}
        </Tooltip>
      )
    },
    {
      title: 'Fecha Registro',
      dataIndex: 'fecha_registro',
      width: 150,
      render: (fecha) => {
        if (fecha) {
          return moment(fecha).format('DD/MM/YY HH:mm');
        } else {
          return '-';
        }
      }
    },
  ]

  return (
    <Modal
      title="Lista de Reiteradas"
      visible={visible}
      onCancel={abrir}
      onOk={abrir}
      width='90vw'
      centered
    >
      <Table
        rowKey="_id"
        dataSource={dataOrdenes}
        columns={columnas}
        loading={loading}
        size="small"
        scroll={{ y: '65vh' }}
        pagination={{
          defaultPageSize: 50
        }}
      />
    </Modal>
  )
}

ModalReiterada.propTypes = {
  abrir: PropTypes.func,
  visible: PropTypes.bool,
  codigo_cliente: PropTypes.string
}

export default ModalReiterada

