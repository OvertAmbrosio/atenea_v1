import React, { useState, useEffect, useRef } from 'react';
import { Button, Col, DatePicker, Input, Popover, Row, Space, Statistic, Table, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';

import { getAsistencias, patchAsistencia } from '../../../services/apiAsistencia';
import { asistencias } from '../../../constants/metodos';
import estadoEmpleado from '../../../constants/estadoEmpleado';
import colores from '../../../constants/colores';
import { ordenarAsistencia } from '../../../libraries/ordenarAsistencias';
import EstadoTag from './EstadoTag';
import { obtenerFiltroId } from '../../../libraries/obtenerFiltro';
import ModalEditarAsistencia from './ModalEditarAsistencia';
import ExcelAsistenciaTecnico from '../../excelExports/ExcelAsistenciaTecnico'
import cogoToast from 'cogo-toast';
import Highlighter from 'react-highlight-words';

export default function TablaAsistenciasTecnicos() {
  const [diaInicio, setDiaInicio] = useState(null);
  const [diaFin, setDiaFin] = useState(null);
  const [diasSemana, setDiasSemana] = useState([]);
  const [columnas, setColumnas] = useState(null);
  const [dataAsistencias, setDataAsistencias] = useState([]);
  const [loadingAsistencia, setLoadingAsistencia] = useState(false);
  const [loadingActualizar, setLoadingActualizar] = useState(false);
  const [filtroGestores, setFiltroGestores] = useState([]);
  const [filtroAuditores, setFiltroAuditores] = useState([]);
  const [filtroContrata, setFiltroContrata] = useState([])
  const [rutasAverias, setRutasAverias] = useState({total:0,activas:0});
  const [rutasAltas, setRutasAltas] = useState({total:0,activas:0});
  const [rutasGpon, setRutasGpon] = useState({total:0,activas:0});
  const [modalEditar, setModalEditar] = useState(false);
  const [idAsistencia, setIdAsistencia] = useState(null);
  //busqueda
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [columnaBusqueda, setColumnaBusqueda] = useState('');
  let inputBusqueda = useRef(null)

  useEffect(() => {
    cambiarSemana(moment())
  //eslint-disable-next-line
  }, [])

  useEffect(() => {
    listarAsistencias()
  //eslint-disable-next-line
  }, [diaInicio, diaFin])
  
  useEffect(() => {
    generarColumnas();
  //eslint-disable-next-line
  }, [diasSemana, filtroGestores]);

  async function listarAsistencias() {
    if (diaInicio && diaFin) {
      setLoadingAsistencia(true);
      await getAsistencias({
        metodo: asistencias.LISTAR_TODO,
        tipo: 'tecnico',
        fecha_inicio: diaInicio,
        fecha_fin: diaFin
      }).then(async({data}) => {
        return await ordenarAsistencia(data.filter((e) => e.tecnico !== null))
      }).then((resultado) => {
        if (resultado && resultado.length > 0) {
          setDataAsistencias(resultado);
          setFiltroGestores(obtenerFiltroId(resultado, 'gestor', true));
          setFiltroAuditores(obtenerFiltroId(resultado, 'auditor', true));
          setFiltroContrata(obtenerFiltroId(resultado, 'contrata', true));
          setRutasAverias(rutasAtivas(resultado.filter((e) => e.estado_empresa === estadoEmpleado.ACTIVO && e.tipo_negocio === 'averias' && ['hfc','gpon'].includes(e.sub_tipo_negocio))));
          setRutasAltas(rutasAtivas(resultado.filter((e) => e.estado_empresa === estadoEmpleado.ACTIVO && e.tipo_negocio === 'altas' && ['hfc','gpon'].includes(e.sub_tipo_negocio))));
          setRutasGpon(rutasAtivas(resultado.filter((e) => e.estado_empresa === estadoEmpleado.ACTIVO && e.sub_tipo_negocio === 'gpon' && e.tipo_negocio === 'altas')))
        } else {
          cogoToast.warn('No se encontraron registros.', { position: 'top-right' });
        }
      }).catch((err) => console.log(err)).finally(() => setLoadingAsistencia(false));
    } else {
      cogoToast.warn('Debes seleccionar un rango de fechas primero.', { position: 'top-right' });
    }
  };

  async function actualizarAsistencia(estado, observacion) {
    setLoadingActualizar(true);
    return await patchAsistencia({id: idAsistencia, estado, observacion})
      .catch((err) => console.log(err))
      .finally(() => {
        setLoadingActualizar(false);
        setModalEditar(false);
        listarAsistencias();
      });
  };

  const abrirModalEditar = () => setModalEditar(!modalEditar);

  const editarAsistencia = (id) => {
    abrirModalEditar();
    setIdAsistencia(id);
  };

  function cambiarSemana(dia) {
    if (dia) {
      let weekStart = dia.clone().startOf('week');
      let weekEnd = dia.clone().endOf('week');
      setDiaInicio(moment(weekStart).format('YYYY-MM-DD'));
      setDiaFin(moment(weekEnd).format('YYYY-MM-DD'))
      let days = [];
      for (let i = 0; i <= 6; i++) {
        days.push(moment(weekStart).add(i, 'days').format("DD-MM"));
      };
      setDiasSemana(days);
    } else {
      setDiaInicio(null);
      setDiaFin(null);
    }
  };

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            inputBusqueda = node;
          }}
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reiniciar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => {
      console.log(value);
      return ( record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '')
    }
     ,
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => inputBusqueda.select(), 100);
      }
    },
    render: (nombre, row) =>
      columnaBusqueda === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[textoBusqueda]}
          autoEscape
          textToHighlight={nombre ? nombre.toString() + ' ' + (row.apellidos ? row.apellidos : '') : ''}
        />
      ) : (
        nombre + ' ' + (row.apellidos ? row.apellidos : '')
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setTextoBusqueda(selectedKeys[0]);
    setColumnaBusqueda(dataIndex);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setTextoBusqueda('');
  };

  function generarColumnas() {
    let hoy = moment().format('DD-MM');
    if (diasSemana.length > 0) {
      const firstColumn = [{
        title: '#',
        width: 50,
        align: 'center',
        render: (_,__,i) => i+1
      },{
        title: 'Tecnico',
        dataIndex: 'nombre',
        width: 250,
        ellipsis: true,
        ...getColumnSearchProps('nombre'),
      }, {
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
        render: (e) => e.nombre ? e.nombre + ' ' + e.apellidos : '-'
      }, {
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
        render: (e) => e.nombre ? e.nombre + ' ' + e.apellidos : '-'
      }, {
        title: 'Contrata',
        dataIndex: 'contrata',
        filters: filtroContrata,
        onFilter: (c, record) => {
          if (record && record.contrata && c) {
            return record.contrata._id.indexOf(c) === 0;
          } else {
            return false;
          }
        },
        ellipsis: true,
        width: 200,
        render: (e) => e && e.nombre ? e.nombre : '-'
      }, {
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
                <button className="boton-none"><Tag color={colores.success}><CheckCircleOutlined/></Tag></button>
              </Popover>)
            } else {
              return <Tag color={colores.error}><CloseCircleOutlined/></Tag>
            }
          } else {
            return <Tag color="error">BAJA</Tag>
          }
        }
      }]
      const columnsAux = diasSemana.map((e) => {
        return ({
          title: e,
          width: 60,
          align: 'center',
          dataIndex: e,
          render: (a, row) => {
            if (a && a.estado && a.observacion) {
              return (
                <Popover 
                  content={
                    <div>
                      <p>{a.observacion}</p>
                      <Button type="primary" onClick={() => editarAsistencia(row[e]._id)} size="small">Editar</Button>
                    </div>
                  } 
                  title="Observaciones" 
                  placement="topRight"
                  trigger="click"
                  destroyTooltipOnHide
                >
                  <button className="boton-none"><EstadoTag actualizar={listarAsistencias} row={row} fecha={e} estado={a.estado}/></button>
                </Popover>
              )
            } else {
              return (<EstadoTag actualizar={listarAsistencias} row={row} fecha={e} estado={a && a.estado_empresa ? a.estado_empresa : row.estado_empresa === estadoEmpleado.INACTIVO ? 'BAJA' : '-'}/>)
            };
          }
        })
      })
      setColumnas([
        ...firstColumn,
        ...columnsAux
      ])
    } else {
      setColumnas([]);
    }
  };
  //funcion para contar las rutas activas
  function rutasAtivas(data) {
    let total = 0;
    let activas = 0;
    let hoy = moment().format('DD-MM');
    if (data.length > 0) {
      data.forEach((e) => {
        if (e[hoy] && e[hoy].estado) {
          total = total +1;
          if (e[hoy].iniciado) activas = activas +1;
        }
      });
    };
    return ({total, activas})
  };

  const columnasDefecto = [
    {
      title: '#',
      width: 50,
      align: 'center',
      render: (_,__,i) => i+1
    }, 
    {
      title: 'Tecnico',
      width: 200
    },
    {
      title: 'Gestor',
      width: 200
    },
    {
      title: 'Fecha',
      width: 100
    }
  ];

  return (
    <div>
      <Row>
        <Col sm={24} style={{ marginBottom: '.5rem' }}>
          <p style={{ color: 'rgba(0,0,0,0.45)' }}>Seleccionar Fecha:</p>
          <DatePicker 
            onChange={cambiarSemana}
            defaultValue={moment()}
            picker="week" 
            style={{ marginRight: '.5rem' }}
          />
          <Button disabled={loadingAsistencia} icon={loadingAsistencia ? <LoadingOutlined spin/>:<ReloadOutlined/>} onClick={listarAsistencias}>Actualizar</Button>
        </Col>
        <Col sm={6} style={{ marginBottom: '1rem', marginRight: '.5rem' }}>
          <Statistic 
            title="Semana selecionada" 
            value={diaInicio && diaFin ? `${moment(diaInicio).format('DD-MM')} / ${moment(diaFin).format('DD-MM')}`:'-'}
          />
        </Col>
        <Col sm={4} style={{ marginBottom: '1rem', marginRight: '.5rem' }}>
          <Statistic 
            title="Rutas Activas (Averias)" 
            value={rutasAverias.activas} 
            suffix={`/ ${rutasAverias.total}`}
          />
        </Col>
        <Col sm={4} style={{ marginBottom: '1rem', marginRight: '.5rem' }}>
          <Statistic 
            title="Rutas Activas (Altas)" 
            value={rutasAltas.activas} 
            suffix={`/ ${rutasAltas.total}`}
          />
        </Col>
        <Col sm={4} style={{ marginBottom: '1rem', marginRight: '.5rem' }}>
          <Statistic 
            title="Rutas Activas (GPON)" 
            value={rutasGpon.activas} 
            suffix={`/ ${rutasGpon.total}`}
          />
        </Col>
      </Row>
      <Table
        rowKey="_id"
        size="small"
        loading={loadingAsistencia}
        columns={columnas !== null && columnas.length !== 0 ? columnas : columnasDefecto}
        dataSource={dataAsistencias}
        pagination={{
          defaultPageSize: 50
        }}
        scroll={{ x: '1100px', y: '70vh' }}
        footer={() => <ExcelAsistenciaTecnico data={dataAsistencias} dias={diasSemana} nombre="tecnico"/>}
      />
      {/* MODAL PARA EDITAR LA ASISTENCIA */}
      <ModalEditarAsistencia visible={modalEditar} abrir={abrirModalEditar} loadingActualizar={loadingActualizar} actualizar={actualizarAsistencia} />
    </div>
  )
};

