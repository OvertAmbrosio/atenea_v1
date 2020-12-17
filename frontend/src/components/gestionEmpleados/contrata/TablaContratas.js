import React, { useState, useEffect } from 'react';
import { Button, Table, Tag } from 'antd';
import { EditTwoTone, PlusOutlined, DeleteTwoTone } from '@ant-design/icons';
import moment from 'moment';

import Contenedor from '../../common/Contenedor';
import { getContratas, patchContrata, postContrata, putContrata } from '../../../services/apiContrata';
import { contratas } from '../../../constants/metodos';
import ModalContrata from './ModalContrata';
import colores from '../../../constants/colores';
import ModalEliminar from './ModalEliminar';

export default function TablaContratas() {
  const [loading, setLoading] = useState(false);
  const [dataContratas, setDataContratas] = useState([]);
  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [contrata, setContrata] = useState({});

  useEffect(() => {
    cargarContratas();
  },[]);

  async function cargarContratas() {
    setLoading(true);
    await getContratas(true, contratas.LISTA_TODO).then(({data}) => {
      setLoading(false);
      setDataContratas(data && data);
    }).catch((error) => {
      setLoading(false);
      console.log(error);
    })
  };

  async function crearContrata(data) {
    await postContrata(data)
      .then(async() => await cargarContratas())
      .catch((error) => {
        console.log(error);
        abrirModalCrear();
      })
  };

  async function editarContrata(data) {
    if (contrata._id) {
      await putContrata(contrata._id, data)
        .then(async() => await cargarContratas())
        .catch((error) => {
          console.log(error);
          abrirModalEditar();
        })
    }
  };

  async function eliminarContrata(id, data) {
    await patchContrata(id, data)
      .then(async() => await cargarContratas())
      .catch(error => {
        console.log(error);
        abrirModalEliminar();
      })
  }

  const abrirModalCrear = () => setModalCrear(!modalCrear);
  const abrirModalEditar = () => setModalEditar(!modalEditar);
  const abrirModalEliminar = () => setModalEliminar(!modalEliminar);

  const columnas = [
    {
      title: '#',
      width: 50,
      render: (_,__,i) => i+1
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      width: 250,
    },
    {
      title: 'Estado',
      dataIndex: 'activo',
      width: 150,
      render: (a) => {
        if (a) {
          return (<Tag color="success">Activo</Tag>)
        } else {
          return (<Tag color="error">Inactivo</Tag>)
        }
      }
    },
    {
      title: 'Fecha Inicio',
      dataIndex: 'fecha_incorporacion',
      width: 150,
      render: (f) => f?moment(f).format('DD-MM-YYYY'):'-'
    },
    {
      title: 'Fecha Baja',
      dataIndex: 'fecha_baja',
      width: 150,
      render: (f) => f ? moment(f).format('DD-MM-YYYY'): '-'
    },
    {
      title: 'Observación',
      dataIndex: 'observacion'
    },
    {
      title: 'Acciones',
      dataIndex: '_id',
      align: 'center',
      width: 100,
      render: (_, row) => (
        <span>
          <EditTwoTone
            title="Editar"
            twoToneColor={colores.warning} 
            style={{paddingRight:'8px', fontSize: '1.5rem'}}
            onClick={() => {
              abrirModalEditar();
              setContrata(row);
            }}
          />
          <DeleteTwoTone 
            title="Configuraciones"
            twoToneColor={colores.error} 
            style={{paddingRight:'8px', fontSize: '1.5rem'}}
            onClick={() => {
              abrirModalEliminar();
              setContrata(row);
            }}
          />
        </span>
      )
    }
  ];

  return (
    <Contenedor>
      <Table
        rowKey="_id"
        style={{ marginBottom: '1rem' }}
        className="tabla-personal"
        title={() => 
          <Button 
            icon={<PlusOutlined/>}
            onClick={abrirModalCrear}
          >
            Agregar
          </Button>
        }
        columns={columnas}
        dataSource={dataContratas}
        loading={loading}
        size="small"
        scroll={{ y: '65vh' }}
        pagination={false}
      />
      {/* MODAL PARA AGREGAR CONTRATA */}
      <ModalContrata
        visible={modalCrear}
        setVisible={setModalCrear}
        guardar={crearContrata}
        accion="crear"
      />
      {/* MODAL PARA EDITAR CONTRATA */}
      <ModalContrata
        visible={modalEditar}
        setVisible={setModalEditar}
        guardar={editarContrata}
        contrata={contrata}
        accion="editar"
      />
      {/* MODAL ELIMINAR CONTRATA */}
      <ModalEliminar
        visible={modalEliminar}
        setVisible={setModalEliminar}
        guardar={eliminarContrata}
        contrata={contrata}
      />
    </Contenedor>
  )
}
