import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Modal, Table } from 'antd';
import { EyeTwoTone } from '@ant-design/icons';
import moment from 'moment';

import TagEstado from './TagEstado';
import { CargoTag } from '../../gestionEmpleados/personal/EmpleadoTag';

function ModalDetalle({visible, abrir, loading, registros}) {
  //Estados para la previsualización de las imagenes
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const modalPreview = () => setPreviewVisible(!previewVisible);

  // funcion para cargar la previsualización de la imagen seleccionada
  const imagenPreview = async (url) => {
    if (url) {
      setPreviewVisible(true)
      setPreviewImage(url);
    }
  };

  const columnas = [
    {
      title: '#',
      width: 50,
      render: (_,__,i) => i+1
    },
    {
      title: 'Usuario',
      dataIndex: 'usuario_entrada',
      width: 180,
      render: (u) => u ? u.nombre + ' ' + u.apellidos : '-'
    },
    {
      title: 'Estado Orden',
      dataIndex: 'estado_orden',
      width: 120,
      render: (e) => <TagEstado estado={e} />
    },
    {
      title: 'Empleado Modificado',
      dataIndex: 'empleado_modificado',
      width: 200,
      render: (u) => u ? u.nombre + ' ' + u.apellidos : '-'
    },
    {
      title: 'Empleado Tipo',
      dataIndex: 'empleado_modificado',
      width: 150,
      render: (u) => u && u.usuario && u.usuario.cargo ? <CargoTag cargo={u.usuario.cargo} /> : '-'
    },
    {
      title: 'Contrata Modificado',
      dataIndex: 'contrata_modificado',
      width: 150,
      render: (c) => c ? c.nombre : '-'
    },
    {
      title: 'Observacion',
      dataIndex: 'observacion',
      width: 300,
    },
    {
      title: 'Fecha Entrada',
      dataIndex: 'fecha_entrada',
      width: 150,
      render: (f) => f ? moment(f).format('DD-MM-YYYY HH:mm') : '-'
    },
    {
      title: 'Imagenes',
      dataIndex: 'imagenes',
      width: 100,
      render: (img) => {
        if (img && img.length > 0) {
          return (
            img.map((e,i) => 
              <EyeTwoTone 
                key={i} 
                onClick={() => imagenPreview(e.url)}
                style={{ marginRight: '.5rem', marginBottom: '.5rem', fontSize: '1.2rem' }} 
              />
            )
          )
        }
      }
    }
  ];

  return (
    <Modal
      title="Historial de Notas"
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
        dataSource={registros}
        loading={loading}
        size="small"
        pagination={false}
        scroll={{ x: '80vw' }}
      />
      <Modal visible={previewVisible} footer={null} onCancel={modalPreview}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Modal>
  )
};

ModalDetalle.propTypes = {
  visible: PropTypes.bool,
  abrir: PropTypes.func,
  loading: PropTypes.bool,
  registros: PropTypes.array
};

export default ModalDetalle;

