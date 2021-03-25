import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Modal, Table, Tooltip } from 'antd';
import { EyeTwoTone } from '@ant-design/icons';
import moment from 'moment';

import TagEstado from '../TagEstado';
import { CargoTag } from '../../../gestionEmpleados/personal/EmpleadoTag';
import { getOrdenes } from '../../../../services/apiOrden';
import metodos from '../../../../constants/metodos';

function ModalRegistro({visible, abrir, requerimiento}) {
  const [registroOrden, setRegistroOrden] = useState([]);
  const [loadingRegistro, setLoadingRegistro] = useState(false);
  //Estados para la previsualización de las imagenes
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (requerimiento && visible) {
      cargarRegistroOrden();
    };
    return () => setRegistroOrden([]);
  //eslint-disable-next-line
  }, [requerimiento]);

  async function cargarRegistroOrden() {
    setLoadingRegistro(true);
    await getOrdenes(true, { metodo: metodos.ORDENES_BUSCAR_REGISTRO, requerimiento })
      .then(({data}) => setRegistroOrden  (data))
      .catch((err) => console.log(err))
      .finally(() => setLoadingRegistro(false));
  }

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
      width: 150,
      ellipsis: { 
        title: true
      },
      render: (u) => {
        if (u && u.nombre) {
          return <Tooltip>{`${u.nombre} ${u.apellidos}`}</Tooltip>
        } else {
          return '-'
        }
      }
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
      width: 150,
      ellipsis: { 
        title: true
      },
      render: (u) => {
        if (u && u.nombre) {
          return <Tooltip>{`${u.nombre} ${u.apellidos}`}</Tooltip>
        } else {
          return '-'
        }
      }
    },
    {
      title: 'Empleado Cargo',
      dataIndex: 'empleado_modificado',
      width: 150,
      render: (u) => u && u.cargo && u.cargo.nombre ? <CargoTag cargo={u.cargo.nombre} nivel={u.nivel} /> : '-'
    },
    {
      title: 'Contrata Modificada',
      dataIndex: 'contrata_modificado',
      width: 150,
      ellipsis: { 
        title: true
      },
      render: (u) => {
        if (u && u.nombre) {
          return <Tooltip>{u.nombre}</Tooltip>
        } else {
          return '-'
        }
      }
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
      render: (f) => f ? moment(f).format('DD/MM HH:mm') : '-'
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
        dataSource={registroOrden}
        loading={loadingRegistro}
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

ModalRegistro.propTypes = {
  visible: PropTypes.bool,
  abrir: PropTypes.func,
  requerimiento: PropTypes.string
};

export default ModalRegistro;

