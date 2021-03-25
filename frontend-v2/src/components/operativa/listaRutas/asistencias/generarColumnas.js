import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, SolutionOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Popover, Tag, Tooltip } from "antd";
import moment from "moment";
import { niveles } from "../../../../constants/cargos";
import colores from "../../../../constants/colores";
import estadoEmpleado from "../../../../constants/estadoEmpleado";
import { CargoTag } from "../../../gestionEmpleados/personal/EmpleadoTag";
import EstadoAsistenciaTag from './EstadoAsistenciaTag';
/**
 * @param {object} data
 * @param {number} data.nivel
 * @param {array} data.dias
 * @param {boolean} data.gestor
 * @param {function} data.editar 
 * @param {function} data.registro 
 * @param {function} data.listar
 * @param {object} data.filtros
 * @param {array} data.filtros.filtroGestores
 * @param {array} data.filtros.filtroAuditores
 * @param {array} data.filtros.filtroContratas
 * @returns {array}
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default function({nivel, dias, gestor, editar, registro, listar, filtros}) {
  if (nivel === niveles.OPERATIVO){
    return columnasTecnico(dias, gestor, editar, registro, listar, filtros);
  } else if (nivel === niveles.FUERA_SISTEMA) {
    return columnasSemilleros(dias, editar, registro, listar, filtros);
  } else {
    return columnasDefault(dias, editar, registro, listar);
  }
};

function columnasDefault(listaDias, editar, registro, listar) {
  const aux = [
    {
      title: '#',
      width: 50,
      align: 'center',
      render: (_,__,i) => i+1
    }, 
    {
      title: 'Nombre',
      width: 200,
      ellipsis: {
        title: true
      },
      dataIndex: "empleado",
      render: (empleado) => {
        const nombre = empleado && empleado.nombre ? empleado.nombre+' '+empleado.apellidos : '-' 
        return <Tooltip title={nombre}>{nombre}</Tooltip>
      }
    },
    {
      title: 'Cargo',
      width: 120,
      align: 'center',
      dataIndex: "cargo",
      render: (cargo) => {
        const nivel = cargo ? cargo.nivel : '-' 
        const nombre = cargo ? cargo.nombre : '-' 
        return <CargoTag nivel={nivel} cargo={nombre}/>
      }
    },
  ];

  if (listaDias && listaDias.length > 0 ) {
    aux.push(...listaDias.map((d) => ({
      title: d,
      dataIndex: d,
      width: 60,
      align: 'center',
      render: (a, row) => {
        if (a && a.estado) {
          return (
            <Dropdown overlay={
                <Menu>
                  <Menu.Item key="0" icon={<EditOutlined/>} onClick={() => editar(row[d]._id)}>
                    <span>Editar</span>
                  </Menu.Item>
                  <Menu.Item key="1" icon={<SolutionOutlined/>} onClick={() => registro(a.historial_registro, d)}>
                    <span>Registro</span>
                  </Menu.Item>
                </Menu>
              } 
              trigger={['click']}
            >
              <button className="boton-none">
                <EstadoAsistenciaTag actualizar={listar} row={row} fecha={d} estado={a.estado}/>
              </button>
            </Dropdown>
          )
        } else {
          return (<EstadoAsistenciaTag actualizar={listar} row={row} fecha={d} estado={a && a.estado_empresa ? a.estado_empresa : row.estado_empresa === estadoEmpleado.INACTIVO ? 'BAJA' : '-'}/>)
        };
      }
    })))
    return aux;
  } else {
    console.log(aux);
    return aux;
  }
};

function columnasTecnico(listaDias, gestor, editar, registro, listar, {filtroGestores=[], filtroAuditores=[], filtroContratas=[]}) {
  const hoy = moment().format('DD-MM');
  const aux = [
    {
      title: '#',
      width: 50,
      align: 'center',
      render: (_,__,i) => i+1
    }, 
    {
      title: 'Tecnico',
      width: 200,
      ellipsis: {
        title: true
      },
      dataIndex: "empleado",
      render: (empleado) => {
        const nombre = empleado && empleado.nombre ? empleado.nombre+' '+empleado.apellidos : '-' 
        return <Tooltip title={nombre}>{nombre}</Tooltip>
      }
    },
    {
      title: 'En Ruta',
      dataIndex: hoy,
      width: 100,
      align: 'center',
      filters: [{text:'Ok', value: true},{text:'No', value: false}],
      onFilter: (c, record) => {
        if (record[hoy]) {
          if(!record[hoy].iniciado && !c) return true
          return record[hoy].iniciado === c
        } else {
          return false;
        }
      },
      render: (e) => {
        if (e) {
          if (e.iniciado) {
            return (<Popover content={e.fecha_iniciado?moment(e.fecha_iniciado).format('HH:mm'):'-'} title="Fecha Iniciado" trigger="click">
              <button className="boton-none">
                <Tag color={colores.success}><CheckCircleOutlined/></Tag>
              </button>
            </Popover>)
          } else {
            return <Tag color={colores.error}><CloseCircleOutlined/></Tag>
          }
        } else {
          return <Tag color="error">BAJA</Tag>
        }
      }
    }
  ];

  const aux2 = [
    {
      title: 'Gestor',
      dataIndex: 'gestor',
      filters: filtroGestores,
      onFilter: (c, record) => {
        if (record.gestor && c) {
          return record.gestor._id.indexOf(c) === 0;
        } else {
          return false;
        }
      },
      ellipsis: true,
      width: 200,
      render: (e) => {
        const nombre = e && e.nombre ? e.nombre+' '+e.apellidos : '-' 
        return <Tooltip title={nombre}>{nombre}</Tooltip>
      }
    }, 
    {
      title: 'Auditor',
      dataIndex: 'auditor',
      filters: filtroAuditores,
      onFilter: (c, record) => {
        if (record.auditor && c) {
          return record.auditor._id.indexOf(c) === 0;
        } else {
          return false;
        }
      },
      ellipsis: true,
      width: 200,
      render: (e) => {
        const nombre = e && e.nombre ? e.nombre+' '+e.apellidos : '-' 
        return <Tooltip title={nombre}>{nombre}</Tooltip>
      }
    }, {
      title: 'Contrata',
      dataIndex: 'contrata',
      filters: filtroContratas,
      onFilter: (c, record) => {
        if (record && record.contrata && c) {
          return record.contrata._id.indexOf(c) === 0;
        } else {
          return false;
        }
      },
      ellipsis: true,
      width: 200,
      render: (e) => {
        const nombre = e && e.nombre ? e.nombre : "-"
        return <Tooltip title={nombre}>{nombre}</Tooltip>
      }
    }
  ]

  if (!gestor) aux.splice(2,0,...aux2) 

  if (listaDias && listaDias.length > 0 ) {
    aux.push(...listaDias.map((d) => ({
      title: d,
      dataIndex: d,
      width: 60,
      align: 'center',
      render: (a, row) => {
        if (a && a.estado) {
          return (
            <Dropdown overlay={
                <Menu>
                  <Menu.Item key="0" icon={<EditOutlined/>} onClick={() => editar(row[d]._id)}>
                    <span>Editar</span>
                  </Menu.Item>
                  <Menu.Item key="1" icon={<SolutionOutlined/>} onClick={() => registro(a.historial_registro, d)}>
                    <span>Registro</span>
                  </Menu.Item>
                </Menu>
              } 
              trigger={['click']}
            >
              <button className="boton-none">
                <EstadoAsistenciaTag actualizar={listar} row={row} fecha={d} estado={a.estado}/>
              </button>
            </Dropdown>
          )
        } else {
          return (<EstadoAsistenciaTag actualizar={listar} row={row} fecha={d} estado={a && a.estado_empresa ? a.estado_empresa : row.estado_empresa === estadoEmpleado.INACTIVO ? 'BAJA' : '-'}/>)
        };
      }
    })))
    return aux;
  } else {
    return aux;
  }
};

function columnasSemilleros(listaDias, editar, registro, listar) {
  const aux = [
    {
      title: '#',
      width: 50,
      align: 'center',
      render: (_,__,i) => i+1
    }, 
    {
      title: 'Nombre',
      width: 200,
      ellipsis: {
        title: true
      },
      dataIndex: "empleado",
      render: (empleado) => {
        const nombre = empleado && empleado.nombre ? empleado.nombre+' '+empleado.apellidos : '-' 
        return <Tooltip title={nombre}>{nombre}</Tooltip>
      }
    },
    {
      title: 'Cargo',
      width: 120,
      align: 'center',
      dataIndex: "cargo",
      render: (cargo) => {
        const nivel = cargo ? cargo.nivel : '-' 
        const nombre = cargo ? cargo.nombre : '-' 
        return <CargoTag nivel={nivel} cargo={nombre}/>
      }
    },
    {
      title: 'Tecnico',
      width: 200,
      ellipsis: {
        title: true
      },
      dataIndex: "tecnico",
      render: (tecnico) => {
        const nombre = tecnico && tecnico.nombre ? tecnico.nombre+' '+tecnico.apellidos : '-' 
        return <Tooltip title={nombre}>{nombre}</Tooltip>
      }
    },
  ];

  if (listaDias && listaDias.length > 0 ) {
    aux.push(...listaDias.map((d) => ({
      title: d,
      dataIndex: d,
      width: 60,
      align: 'center',
      render: (a, row) => {
        if (a && a.estado) {
          return (
            <Dropdown overlay={
                <Menu>
                  <Menu.Item key="0" icon={<EditOutlined/>} onClick={() => editar(row[d]._id)}>
                    <span>Editar</span>
                  </Menu.Item>
                  <Menu.Item key="1" icon={<SolutionOutlined/>} onClick={() => registro(a.historial_registro, d)}>
                    <span>Registro</span>
                  </Menu.Item>
                </Menu>
              } 
              trigger={['click']}
            >
              <button className="boton-none">
                <EstadoAsistenciaTag actualizar={listar} row={row} fecha={d} estado={a.estado}/>
              </button>
            </Dropdown>
          )
        } else {
          return (<EstadoAsistenciaTag actualizar={listar} row={row} fecha={d} estado={a && a.estado_empresa ? a.estado_empresa : row.estado_empresa === estadoEmpleado.INACTIVO ? 'BAJA' : '-'}/>)
        };
      }
    })))
    return aux;
  } else {
    console.log(aux);
    return aux;
  }
};