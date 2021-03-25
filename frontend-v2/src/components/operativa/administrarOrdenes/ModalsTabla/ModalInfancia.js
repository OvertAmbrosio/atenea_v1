import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Table, Typography } from 'antd';
import moment from 'moment';

import TagEstado from '../TagEstado';
import { getOrdenes } from '../../../../services/apiOrden';
import metodos from '../../../../constants/metodos';

const { Text } = Typography;

function ModalInfancia({visible, abrir, requerimiento}) {
  const [objetoInfancia, setObjetoInfancia] = useState([]);
  const [loadingInfancia, setLoadingInfancia] = useState(false);

  useEffect(() => {
    if (requerimiento && String(requerimiento).length > 1) {
      cargarInfancia();
    };
  //eslint-disable-next-line
  },[requerimiento]);

  async function cargarInfancia() {
    setLoadingInfancia(true);
    return await getOrdenes(true, { metodo: metodos.ORDENES_OBTENER_INFANCIA, requerimiento })
      .then(({data}) => {
        if (data) setObjetoInfancia([data])
      })
      .catch((err) => console.log(err)).finally(() => setLoadingInfancia(false));
  };

  const columnas = [
    {
      title: 'Requerimiento',
      dataIndex: 'codigo_requerimiento',
      width: 120,
      render: (u) => u ? <Text copyable>{u}</Text> : '-'
    },
    {
      title: 'CTR',
      dataIndex: 'codigo_ctr',
      width: 80,
    },
    {
      title: 'Tecnico',
      dataIndex: 'tecnico_liquidado',
      width: 180,
      render: (u, row) => u ? u.nombre + ' ' + u.apellidos : row.carnet_liquidado ? row.carnet_liquidado : '-'
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
        columns={columnas}
        dataSource={objetoInfancia}
        loading={loadingInfancia}
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
  requerimiento: PropTypes.string
};

export default ModalInfancia

