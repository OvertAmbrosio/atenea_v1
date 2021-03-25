import React, { useState, useEffect } from 'react'
import { Table, Tag, Tooltip, Typography } from 'antd'

import Contenedor from '../../common/Contenedor'
import HeaderEmpleados from './HeaderEmpleados';
import { CargoTag, EstadoTag } from './EmpleadoTag';
import ModalEmpleado from './ModalEmpleado';
import { getEmpleados, postEmpleados, putEmpleados } from '../../../services/apiEmpleado';
import { getContratas } from '../../../services/apiContrata';
import { getAreas } from '../../../services/apiAreas';
import { getCargos } from '../../../services/apiCargos';
import { getTipoEmpleados } from '../../../services/apiTipoEmpleados';
import { getZonas } from '../../../services/apiZonas';
import metodos from '../../../constants/metodos';
import ModalDetalle from './ModalDetalle';
import { obtenerFiltroId } from '../../../libraries/obtenerFiltro';
import { EditTwoTone, SettingTwoTone } from '@ant-design/icons';
import colores from '../../../constants/colores';
import ModalConfiguracion from './ModalConfiguracion';

const { Text } = Typography;

export default function TablaEmpleados() {
  const [totalEmpleados, setTotalEmpleados] = useState([]);
  const [dataEmpleados, setDataEmpleados] = useState([]);
  const [objEmpleado, setObjEmpleado] = useState({});
  const [idEmpleado, setIdEmpleado] = useState(null);
  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalConfiguraciones, setModalConfiguraciones] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [listaContratas, setListaContratas] = useState([]);
  const [listaAreas, setListaAreas] = useState([]);
  const [listaCargos, setListaCargos] = useState([]);
  const [listaTipos, setListaTipos] = useState([]);
  const [listaZonas, setListaZonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtroCargos, setFiltroCargos] = useState([]);
  const [filtroTipos, setFiltroTipos] = useState([]);
  const [filtroAreas, setFiltroAreas] = useState([]);
  const [filtroContratas, setFiltroContratas] = useState([]);
  
  useEffect(() => {
    listarEmpleados();
    listarContratas();
    listarAreas();
    listarCargos();
    listarTipos();
    listarZonas();
  //eslint-disable-next-line
  },[]);

  async function listarEmpleados() {
    setLoading(true);
    await getEmpleados(
      true, { metodo: metodos.EMPLEADOS_LISTAR_TODO }
    ).then(({data}) => {
      if (data && data.length > 0) {
        setTotalEmpleados(data);
        setDataEmpleados(data);
        setFiltroCargos(obtenerFiltroId(data, "cargo", false));
        setFiltroTipos(obtenerFiltroId(data, "tipo_empleado", false));
        setFiltroAreas(obtenerFiltroId(data, "area", false));
        setFiltroContratas(obtenerFiltroId(data, "contrata", false));
      } else {
        setDataEmpleados([]);
      };
    }).catch((error) => console.log(error)).finally(() => setLoading(false))
  };

  async function listarContratas() {
    return await getContratas(false, metodos.CONTRATA_LISTAR_NOMBRES)
      .then(({data}) => setListaContratas(data))
      .catch((error) => console.log(error));
  };

  async function listarAreas() {
    return await getAreas(false)
      .then(({data}) => setListaAreas(data))
      .catch((error) => console.log(error));
  };

  async function listarCargos() {
    return await getCargos(false)
      .then(({data}) => setListaCargos(data))
      .catch((error) => console.log(error));
  };

  async function listarTipos() {
    return await getTipoEmpleados(false)
    .then(({data}) => setListaTipos(data))
    .catch((error) => console.log(error));
  };

  async function listarZonas() {
    return await getZonas(false)
    .then(({data}) => setListaZonas(data))
    .catch((error) => console.log(error));
  };

  async function guardarEmpleado({id, metodo, email, empleado}) {
    await postEmpleados({metodo, email, empleado})
      .then(() => abrirModalCrear())
      .then(async() => await listarEmpleados())
      .catch(error => console.log(error));
  };

  async function actualizarEmpleado({id, metodo, email, empleado}) {
    await putEmpleados(id, { metodo, email, empleado })
      .then(() => abrirModalEditar())
      .then(async() => await listarEmpleados())
      .catch(error => console.log(error));
  }

  const abrirModalCrear = () => setModalCrear(!modalCrear);
  const abrirModalEditar = () => setModalEditar(!modalEditar);
  const abrirModalDetalle = () => setModalDetalle(!modalDetalle);
  const abrirModalConfigurar = () => setModalConfiguraciones(!modalConfiguraciones);

  const verDetalleEmpleado = (empleado) => {
    // setEmpleadoObj(empleado);
    abrirModalDetalle();
  };

  const editarEmpleado  = (obj) => {
    setObjEmpleado(obj);
    abrirModalEditar();
  };

  const configurarEmpleado = (id) => {
    setIdEmpleado(id);
    abrirModalConfigurar();
  };

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
      dataIndex: 'cargo',
      width: 150,
      filters: filtroCargos,
      onFilter: (v,r) => {
        if (v === '-') {
          return !r.cargo
        } else if( r.cargo !== undefined) {
          return r.cargo._id.indexOf(v) === 0
        } else {
          return false
        }
      },
      render: (u) => <CargoTag nivel={u.nivel} cargo={u.nombre}/>
    },
    {
      title: 'Area',
      dataIndex: 'area',
      width: 150,
      align: "center",
      filters: filtroAreas,
      onFilter: (v,r) => {
        if (v === '-') {
          return !r.area
        } else if( r.area !== undefined) {
          return r.area._id.indexOf(v) === 0
        } else {
          return false
        }
      },
      render: (u) => <Tag color="#2db7f5">{u.nombre}</Tag>
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo_empleado',
      width: 150,
      align: "center",
      filters: filtroTipos,
      onFilter: (v,r) => {
        if (v === '-') {
          return !r.tipo_empleado
        } else if( r.tipo_empleado !== undefined) {
          return r.tipo_empleado._id.indexOf(v) === 0
        } else {
          return false
        }
      },
      render: (u) => <Tag color="#A442FE">{u.nombre}</Tag>
    },
    {
      title: 'Zonas',
      dataIndex: 'zonas',
      width: 150,
      render: (u) => {
        if (u && u.length > 0) {
          return (<div>
          {
            u.map((obj, i) => (<Tag key={i}>{obj.nombre}</Tag>))
          }
          </div>)
        } else { return "-"}
      }
    },
    {
      title: 'Contrata',
      dataIndex: 'contrata',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      filters: filtroContratas,
      onFilter: (v,r) => {
        if (v === '-') {
          return !r.contrata
        } else if( r.contrata !== undefined) {
          return r.contrata._id.indexOf(v) === 0
        } else {
          return false
        }
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
          return "-"
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
      fixed: "right",
      width: 100,
      render: (id, row) => <span>
        <EditTwoTone
          title="Editar"
          twoToneColor={colores.warning} 
          style={{paddingRight:'8px', fontSize: '1.5rem'}}
          onClick={() => editarEmpleado(row)}
        />
        <SettingTwoTone
          title="Configuraciones"
          style={{paddingRight:'8px', fontSize: '1.5rem'}}
          onClick={() => configurarEmpleado(id)}
        />
      </span>
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
        title={() => HeaderEmpleados(abrirModalCrear, totalEmpleados, setDataEmpleados)}
        columns={columnas}
        dataSource={dataEmpleados}
        loading={loading}
        size="small"
        scroll={{ x: '1250px', y: '65vh' }}
        pagination={{
          defaultPageSize: 50,
          pageSizeOptions: [50,100, 200]
        }}
      />
      {/* MODAL PARA CREAR EL NUEVO EMPLEADO */}
      <ModalEmpleado
        accion="crear"
        cargos={listaCargos}
        tipos={listaTipos}
        areas={listaAreas}
        zonas={listaZonas}
        contratas={listaContratas}
        visible={modalCrear}
        abrir={abrirModalCrear}
        guardar={guardarEmpleado}
      />
      {/* MODAL PARA EDITAR EL EMPLEADO */}
      <ModalEmpleado
        accion="editar"
        cargos={listaCargos}
        tipos={listaTipos}
        areas={listaAreas}
        zonas={listaZonas}
        contratas={listaContratas}
        visible={modalEditar}
        abrir={abrirModalEditar}
        empleado={objEmpleado}
        guardar={actualizarEmpleado}
      />
      {/* MODAL DETALLE DEL EMPLEADO */}
      <ModalDetalle
        visible={modalDetalle}
        abrirModal={abrirModalDetalle}
        empleado={idEmpleado}
      />
      {/* MODAL PARA CONFIGURAR */}
      <ModalConfiguracion
        visible={modalConfiguraciones}
        abrir={abrirModalConfigurar}
        listarEmpleados={listarEmpleados}
        id={idEmpleado}
      />
    </Contenedor>
  )
}
