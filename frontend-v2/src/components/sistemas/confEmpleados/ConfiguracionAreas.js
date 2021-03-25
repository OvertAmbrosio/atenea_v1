import React, { useState, useEffect } from 'react';
import { Button, Popconfirm, Table } from 'antd';
import { DeleteTwoTone, EditTwoTone, LoadingOutlined, SaveOutlined } from '@ant-design/icons';

import colores from '../../../constants/colores';
import { getAreas } from '../../../services/apiAreas';
import ModalArea from './ModalArea';

export default function ConfiguracionAreas() {
  const [listaAreas, setListaAreas] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingCrear, setLoadingCrear] = useState(false);
  const [modalArea, setModalArea] = useState(false);
  const [objArea, setObjArea] = useState({});

  useEffect(() => {
    listarAreas();
  },[]);

  async function listarAreas() {
    setLoadingAreas(true);
    return await getAreas(true).then(({data}) => {
      if (data && data.length > 0) {
        setListaAreas(data);
      }
    }).catch((err) => console.log(err)).finally(() => setLoadingAreas(false));
  };

  const abrirModalArea = () => setModalArea(!modalArea);

  const editarArea = (row) => {
    setObjArea(row);
    abrirModalArea();
  };

  const crearArea = (row) => {
    setObjArea({});
    abrirModalArea();
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
      width: 100
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
    },
    {
      title: "Actualizar",
      dataIndex: "_id",
      align: "center",
      width: 100,
      render: (id, row) => <div>
        <EditTwoTone
          onClick={() => editarArea(row)}
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
      <h3 style={{ marginTop: '.5em' }}>Configuracion de Areas</h3>
      <Table
        rowKey="_id"
        title={() => <div>
            <Button
              icon={ loadingCrear ? <LoadingOutlined sping/> : <SaveOutlined/> }
              onClick={crearArea}
              size="small"
              type="primary"
            >
              Agregar
            </Button>
          </div>
        }
        dataSource={listaAreas}
        columns={columnas}
        loading={loadingAreas}
        size="small"
        pagination={false}
        style={{ marginBottom: '1rem'}}
      />
      <ModalArea obj={objArea} abrir={abrirModalArea} visible={modalArea}/>
    </div>
  )
};
