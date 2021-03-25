import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Table, Typography, Tooltip } from 'antd';
import moment from 'moment';

import { getOrdenes } from '../../../../services/apiOrden';
import metodos from '../../../../constants/metodos';
import TagEstado from '../TagEstado';

const { Text } = Typography;

function ModalReiterada({abrir, visible, codigo_cliente}) {
  const [loading, setLoading] = useState(false);
  const [dataOrdenes, setDataOrdenes] = useState([]);

  useEffect(() => {
    if (codigo_cliente && String(codigo_cliente).length > 1) {
      buscarReiteradas();
    }
  // eslint-disable-next-line
  },[codigo_cliente]);

  async function buscarReiteradas() {
    setLoading(true);
    await getOrdenes(true, { metodo: metodos.ORDENES_OBTENER_REITERADAS, cliente: codigo_cliente }).then(({data}) => {
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
      title: 'CTR',
      dataIndex: 'codigo_ctr',
      width: 70,
    },
    {
      title: 'Descripcion CTR',
      dataIndex: 'descripcion_ctr',
      width: 180,
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
      dataIndex: 'tecnico_liquidado',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (t) => (
        <Tooltip placement="topLeft" title={t && t.contrata ? t.contrata.nombre:'-'}>
          {t && t.contrata ? t.contrata.nombre:'-'}
        </Tooltip>
      )
    },
    {
      title: 'Gestor',
      dataIndex: 'tecnico_liquidado',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (t) => (
        <Tooltip placement="topLeft" title={t && t.gestor ? t.gestor.nombre+' '+t.gestor.apellidos:'-'}>
          {t ? t.gestor.nombre+' '+t.gestor.apellidos:'-'}
        </Tooltip>
      )
    },
    {
      title: 'Tecnico',
      dataIndex: 'tecnico_liquidado',
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
    {
      title: 'Fecha Liquidacion',
      dataIndex: 'fecha_liquidado',
      width: 150,
      render: (fecha) => {
        if (fecha) {
          return moment(fecha).format('DD/MM/YY HH:mm');
        } else {
          return '-';
        }
      }
    },
    {
      title: 'Estado Liquidado',
      dataIndex: 'estado_liquidado',
      width: 150,
      render: (estado) => <TagEstado estado={estado}/>
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

