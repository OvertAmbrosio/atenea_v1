import React, { useState, useEffect } from 'react';
import { getEmpleados, patchEmpleados } from '../../../../services/apiEmpleado';
import metodos from '../../../../constants/metodos';
import { Table, Tag, Tooltip, Typography } from 'antd';
import { CheckSquareTwoTone } from '@ant-design/icons';
import { obtenerFiltroId } from '../../../../libraries/obtenerFiltro';
import ModalAsignar from './ModalAsignar';

const { Text } = Typography;

export default function TablaRutasApoyo() {
  const [listaSemilleros, setListaSemilleros] = useState([]);
  const [listaTecnicos, setListaTecnicos] = useState([]);
  const [loadingSemilleros, setLoadingSemilleros] = useState(false);
  const [filtroCargo, setFiltroCargo] = useState([]);
  const [filtroTecnico, setFiltroTecnico] = useState([]);
  const [modalAsignar, setModalAsignar] = useState(false);
  const [IdSemillero, setIdSemillero] = useState(null);

  useEffect(() => {
    cargarSemilleros();
    cargarTecnicos();
  },[]);

  async function cargarTecnicos(){
    return await getEmpleados(false, { metodo: metodos.EMPLEADOS_LISTAR_TECNICOS })
      .then(({data}) => setListaTecnicos(data))
      .catch((err) => console.log(err));
  };

  async function cargarSemilleros() {
    setLoadingSemilleros(true);
    return await getEmpleados(true, { metodo: metodos.EMPLEADOS_LISTAR_APOYO })
      .then(({data}) => {
        if (data && data.length > 0) {
          setListaSemilleros(data);
          setFiltroCargo(obtenerFiltroId(data, "cargo", false));
          setFiltroTecnico(obtenerFiltroId(data, "tecnico", true))
        } else {
          setListaSemilleros([]);
        }
      }).catch((err) => console.log(err)).finally(() => setLoadingSemilleros(false));
  };

  async function asignarTecnico(tecnico){
    return await patchEmpleados(true, { metodo: metodos.EMPLEADOS_ACTUALIZAR_RUTA, tecnicos: [IdSemillero], tecnico })
      .then(() => listaSemilleros())
      .catch((err) => console.log(err))
  };

  const asignarEmpleado = (id) => {
    setIdSemillero(id);
    abrirModalAsignar();
  };

  const abrirModalAsignar = () => setModalAsignar(!modalAsignar);

  const columnas = [
    {
      title: "#",
      width: 60,
      render: (_,__, i) => i+1
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      width: 150,
      ellipsis: {
        title: true
      },
      render: (t) => (
        <Tooltip placement="topLeft" title={t}>{t}</Tooltip>
      )
    },
    {
      title: "Apellidos",
      dataIndex: "apellidos",
      width: 150,
      ellipsis: {
        title: true
      },
      render: (t) => (
        <Tooltip placement="topLeft" title={t}>{t}</Tooltip>
      )
    },
    {
      title: "Cargo",
      dataIndex: "cargo",
      width: 100,
      filters : filtroCargo,
      onFilter: (v,r) => r.cargo._id.indexOf(v) === 0,
      render: (c) => <Tag>{c.nombre}</Tag>
    },
    {
      title: "Tecnico",
      dataIndex: "tecnico",
      width: 150,
      filters: filtroTecnico,
      onFilter: (v,r) => {
        if (v === '-') {
          return !r.tecnico
        }else if (r && r.tecnico && r.tecnico._id) {
          return r.tecnico._id.indexOf(v) === 0
        } else {
          return false
        }
      },
      ellipsis: {
        title: true
      },
      render: (t) => (
        <Tooltip placement="topLeft" title={t && t.apellidos}>{t && t.apellidos}</Tooltip>
      )
    },
    {
      title: "Tecnico Carnet",
      dataIndex: "tecnico",
      width: 150,
      align: "center",
      render: (t) => <Text>{t && t.carnet}</Text>
    },
    {
      title: "Asignar",
      dataIndex: "_id",
      width: 70,
      align: "center",
      fixed: "right",
      render: (id) => <CheckSquareTwoTone onClick={() => asignarEmpleado(id)} style={{ cursor: "pointer", fontSize:"1.5rem" }} />
    }
  ]

  return (
    <div>
      <Table
        rowKey="_id"
        size="small"
        columns={columnas}
        dataSource={listaSemilleros}
        loading={loadingSemilleros}
        pagination={{
          defaultPageSize: 50,
          pageSizeOptions: [50,100,200]
        }}
        scroll={{ x: "75vw", y: "75vh" }}
      />
      {/* MODAL PARA ASIGNAR LA RUTA AL TECNICO */}
      <ModalAsignar tecnicos={listaTecnicos} abrir={abrirModalAsignar} visible={modalAsignar} guardar={asignarTecnico}/>
    </div>
  )
};

