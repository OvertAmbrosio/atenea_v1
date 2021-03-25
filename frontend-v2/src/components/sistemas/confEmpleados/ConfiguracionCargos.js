import React, { useState, useEffect } from 'react';
import { Button, Popconfirm, Table } from 'antd';
import { DeleteTwoTone, EditTwoTone, LoadingOutlined, SaveOutlined } from '@ant-design/icons';

import colores from '../../../constants/colores';
import { getCargos, postCargo, putCargo } from '../../../services/apiCargos';
import ModalCargo from './ModalCargo';
import metodos from '../../../constants/metodos';

export default function ConfiguracionCargo() {
  const [listaCargos, setListaCargos] = useState([]);
  const [loadingCargos, setLoadingCargos] = useState(false);
  const [loadingCrear, setLoadingCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalCrear, setModalCrear] = useState(false);
  const [objCargo, setObjCargo] = useState({});

  useEffect(() => {
    listarCargos();
  },[]);

  async function listarCargos() {
    setLoadingCargos(true);
    return await getCargos(true).then(({data}) => {
      if (data && data.length > 0) {
        setListaCargos(data);
      }
    }).catch((err) => console.log(err)).finally(() => setLoadingCargos(false));
  };

  async function enviarCrearCargo(id, nombre, nivel) {
    return await postCargo({metodo: metodos.CARGO_CREAR, data: { nombre, nivel }})
      .then(async() => {
        abrirModalCrear()
        await listarCargos()
      }).catch((err) => console.log(err))
  };

  async function enviarEditarCargo(id, nombre, nivel) {
    return await putCargo(id, { metodo: metodos.CARGO_ACTUALIZAR, data: { nombre, nivel }})
      .then(async() => {
        abrirModalEditar()
        await listarCargos()
      }).catch((err) => console.log(err))
  };

  const abrirModalEditar = () => setModalEditar(!modalEditar);
  const abrirModalCrear = () => setModalCrear(!modalCrear);

  const editarCargo = (row) => {
    setObjCargo(row);
    abrirModalEditar();
  };

  const crearCargo = () => {
    abrirModalCrear();
  };

  const columnas = [
    {
      title: "Id",
      dataIndex: "_id",
      width: 130
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      width: 200
    },
    {
      title: "Nivel",
      dataIndex: "nivel",
    },
    {
      title: "Actualizar",
      dataIndex: "_id",
      align: "center",
      width: 100,
      render: (id, row) => <div>
        <EditTwoTone
          onClick={() => editarCargo(row)}
          style={{ fontSize: "1.2rem", cursor: "pointer", marginRight: ".5rem" }}
          twoToneColor={colores.warning}
        />
        <Popconfirm
          placement="topRight"
          title="Esta acción será permanente. ¿Deseas continuar?"
          // onConfirm={confirm}
          okText="Yes"
          cancelText="No"
        >
          <DeleteTwoTone
            style={{ fontSize: "1.2rem", cursor: "pointer" }}
            twoToneColor={colores.error}
          />
        </Popconfirm>
      </div>
    }
  ];

  return (
    <div>
      <h3 style={{ marginTop: '.5em' }}>Configuracion de Cargos</h3>
      <Table
        rowKey="_id"
        title={() => <div>
            <Button
              icon={ loadingCrear ? <LoadingOutlined sping/> : <SaveOutlined/> }
              onClick={crearCargo}
              size="small"
              type="primary"
            >
              Agregar
            </Button>
          </div>
        }
        dataSource={listaCargos}
        columns={columnas}
        loading={loadingCargos}
        size="small"
        pagination={false}
        style={{ marginBottom: '1rem'}}
      />
      <ModalCargo obj={objCargo} abrir={abrirModalEditar} visible={modalEditar} guardar={enviarEditarCargo}/>
      <ModalCargo abrir={abrirModalCrear} visible={modalCrear} guardar={enviarCrearCargo}/>
    </div>
  )
};
