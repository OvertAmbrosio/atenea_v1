import React, { useState, useEffect } from 'react'
import { Table, Tooltip, Typography } from 'antd'

import Contenedor from '../../common/Contenedor'
import HeaderEmpleados from './HeaderEmpleados';
import { CargoTag, EstadoTag } from './EmpleadoTag';
import EmpleadoAcciones from './EmpleadoAcciones';
import ModalEmpleado from './ModalEmpleado';
import { getEmpleados, postEmpleados } from '../../../services/apiEmpleado';
import { getContratas } from '../../../services/apiContrata';
import { empleados, contratas } from '../../../constants/metodos';
import ModalDetalle from './ModalDetalle';

const { Text } = Typography;

export default function TablaEmpleados() {
  const [pageNumber, setPageNumber] = useState(1);
  const [limitNumber, setLimitNumber] = useState(20);
  const [totalDocs, setTotalDocs] = useState(1);
  const [dataEmpleados, setDataEmpleados] = useState([]);
  const [modalCrear, setModalCrear] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [empleadoObj, setEmpleadoObj] = useState({});
  const [listaContratas, setListaContratas] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    listarEmpleados();
    listarContratas();
  //eslint-disable-next-line
  },[pageNumber, limitNumber]);

  async function listarEmpleados() {
    setLoading(true);
    await getEmpleados(
      true, {
        metodo: empleados.LISTA_TODO,
        page:pageNumber, 
        limit:limitNumber
      }
    ).then(({data}) => {
      setDataEmpleados(data.docs);
      setTotalDocs(data.totalDocs)
      setLoading(false);
    }).catch((error) => {
      setLoading(false);
      console.log(error)
    });
  };

  async function listarContratas() {
    await getContratas(false, contratas.LISTA_NOMBRES)
      .then(({data}) => setListaContratas(data))
      .catch((error) => console.log(error));
  };

  async function guardarEmpleado(data) {
    await postEmpleados(data)
      .then(async() => await listarEmpleados())
      .catch(error => console.log(error));
  };

  const abrirModalCrear = () => setModalCrear(!modalCrear);
  const abrirModalDetalle = () => setModalDetalle(!modalDetalle);

  const verDetalleEmpleado = (empleado) => {
    setEmpleadoObj(empleado);
    abrirModalDetalle();
  }

  const columnas = [
    {
      title: '#',
      width: 50,
      render: (_,__,i) => i+1
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      width: 150
    },
    {
      title: 'Apellidos',
      dataIndex: 'apellidos',
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: apellidos => (
        <Tooltip placement="topLeft" title={apellidos}>
          {apellidos}
        </Tooltip>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'usuario',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (u) => (
        <Tooltip placement="topLeft" title={u && u.email}>
          {u && u.email}
        </Tooltip>
      )
    },
    {
      title: 'Cargo',
      dataIndex: 'usuario',
      width: 150,
      render: (u) => <CargoTag cargo={u.cargo}/>
    },
    {
      title: 'Contrata',
      dataIndex: 'contrata',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (c) => (
        <Tooltip placement="topLeft" title={c && c.nombre}>
          {c && c.nombre}
        </Tooltip>
      )
    },
    {
      title: 'Carnet',
      dataIndex: 'carnet',
      width: 150,
      render: (c) => {
        if (c) {
          return (<Text copyable>{c}</Text>)
        } else {
          return null
        }
      }
    },
    {
      title: 'Estado',
      dataIndex: 'estado_empresa',
      width: 150,
      render: (estado) => <EstadoTag estado={estado}/>
    },
    {
      title: 'Acciones',
      dataIndex: '_id',
      align: 'center',
      width: 100,
      render: (id, row) => <EmpleadoAcciones id={id} empleado={row} listarEmpleados={listarEmpleados} listaContratas={listaContratas}/>
    }
  ];

  return (
    <Contenedor>
      <Table
        rowKey="_id"
        onRow={(record) => {
          return {
            onDoubleClick: () => verDetalleEmpleado(record)
          }
        }}
        className="tabla-personal"
        title={() => HeaderEmpleados(abrirModalCrear, listarEmpleados, setDataEmpleados, setPageNumber, setTotalDocs)}
        columns={columnas}
        dataSource={dataEmpleados}
        loading={loading}
        size="small"
        scroll={{ x: '1250px', y: '65vh' }}
        pagination={{
          current: pageNumber,
          total: totalDocs,
          defaultPageSize: limitNumber,
          pageSizeOptions: [10,20,50,100],
          onChange: (page) => setPageNumber(page),
          onShowSizeChange: (_,limit) => setLimitNumber(limit)
        }}
      />
      {/* MODAL PARA CREAR EL NUEVO EMPLEADO */}
      <ModalEmpleado
        accion="crear"
        contratas={listaContratas}
        visible={modalCrear}
        setVisible={setModalCrear}
        guardar={guardarEmpleado}
      />
      {/* MODAL DETALLE DEL EMPLEADO */}
      <ModalDetalle
        visible={modalDetalle}
        abrirModal={abrirModalDetalle}
        empleado={empleadoObj}
      />
    </Contenedor>
  )
}
