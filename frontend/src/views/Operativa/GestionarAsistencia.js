import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Popover, Row, Table, Tag } from 'antd';
import React, { useState, useEffect } from 'react';
import moment from 'moment';

import Contenedor from '../../components/common/Contenedor';
import TituloVista from '../../components/common/TituloContent';
import EstadoTag from '../../components/operativa/listaRutas/EstadoTag';
import { asistencias } from '../../constants/metodos';
import { obtenerFiltroId } from '../../libraries/obtenerFiltro';
import { ordenarAsistencia } from '../../libraries/ordenarAsistencias';
import { getAsistencias, patchAsistencia } from '../../services/apiAsistencia';
import colores from '../../constants/colores';
import ModalEditarAsistencia from '../../components/operativa/listaRutas/ModalEditarAsistencia';

const columnasDefecto = [
  {
    title: '#',
    width: 50,
    align: 'center',
    render: (_,__,i) => i+1
  }, 
  {
    title: 'Tecnico',
    dataIndex: 'tecnico',
    width: 200
  },
  {
    title: 'Gestor',
    dataIndex: 'gestor',
    width: 200
  },
  {
    title: 'Fecha',
    dataIndex: 'fecha',
    width: 100
  }
];

export default function GestionarAsistencia() {
  const [dataAsistencias, setDataAsistencias] = useState([]);
  const [loadingAsistencia, setLoadingAsistencia] = useState(false);
  const [loadingActualizar, setLoadingActualizar] = useState(false);
  const [columnas, setColumnas] = useState(null);
  const [diasSemana, setDiasSemana] = useState([]);
  const [diaInicio, setDiaInicio] = useState(null);
  const [diaFin, setDiaFin] = useState(null);
  const [filtroGestores, setFiltroGestores] = useState([]);
  const [filtroAuditores, setFiltroAuditores] = useState([]);
  const [modalEditar, setModalEditar] = useState(false);
  const [idAsistencia, setIdAsistencia] = useState(null);

  useEffect(() => {
    cambiarSemana(moment())
  //eslint-disable-next-line
  }, []);

  useEffect(() => {
    listarAsistencias()
  //eslint-disable-next-line
  }, [diaInicio, diaFin])

  useEffect(() => {
    generarColumnas();
  //eslint-disable-next-line
  }, [diasSemana, filtroGestores])

  async function actualizarAsistencia(estado, observacion) {
    setLoadingActualizar(true);
    console.log(estado);
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

  async function listarAsistencias() {
    if (diaInicio && diaFin) {
      setLoadingAsistencia(true);
      await getAsistencias({
        metodo: asistencias.LISTAR_GESTOR,
        fecha_inicio: diaInicio,
        fecha_fin: diaFin
      }).then(async({data}) => {
        return await ordenarAsistencia(data.filter((e) => e.tecnico !== null))
      }).then((resultado) => {
        if (resultado && resultado.length > 0) {
          setDataAsistencias(resultado);
          setFiltroGestores(obtenerFiltroId(resultado, 'gestor', true));
          setFiltroAuditores( obtenerFiltroId(resultado, 'auditor', true));
        }
      }).catch((err) => console.log(err)).finally(() => setLoadingAsistencia(false));
    };
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
        width: 300,
        render: (e, row) => row.nombre + ' ' + row.apellidos
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
        width: 250,
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
        width: 250,
        render: (e) => e.nombre ? e.nombre + ' ' + e.apellidos : '-'
      }, {
        title: 'En Ruta',
        dataIndex: hoy,
        width: 150,
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
              return (<Popover content={e.fecha_iniciado?moment(e.fecha_iniciado).format('HH:mm'):'-'} title="Observaciones" trigger="click">
                <button className="boton-none"><Tag color={colores.success}><CheckCircleOutlined/></Tag></button>
              </Popover>)
            } else {
              return <Tag color={colores.error}><CloseCircleOutlined/></Tag>
            }
          } else {
            return <Tag color={colores.error}>No</Tag>
          }
        }
      }]
      const columnsAux = diasSemana.map((e) => {
        return ({
          title: e,
          width: 100,
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
                  <button className="boton-none"><EstadoTag estado={a.estado}/></button>
                </Popover>
              )
            } else {
              return (<EstadoTag estado={a && a.estado ? a.estado :'-'}/>)
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

  return (
    <div>
      <TituloVista titulo="Asistencia" subtitulo="Gestion de Rutas"/>
      <Contenedor>
        <Row style={{ marginTop: '1rem', marginBottom: '.5rem' }}>
          <h1><p>Tabla de Asistencias:</p></h1>
          <Col sm={24} style={{ marginBottom: '.5rem' }}>
            <p style={{ color: 'rgba(0,0,0,0.45)' }}>Seleccionar Fecha:</p>
            <DatePicker 
              onChange={cambiarSemana} 
              picker="week" 
              style={{ marginRight: '.5rem' }}
            />
            <Button disabled={loadingAsistencia} icon={loadingAsistencia ? <LoadingOutlined spin/>:<ReloadOutlined/>} onClick={listarAsistencias}>Actualizar</Button>
          </Col>
        </Row>
        <Table
          rowKey="_id"
          size="small"
          loading={loadingAsistencia}
          columns={columnas !== null && columnas.length !== 0 ? columnas : columnasDefecto}
          dataSource={dataAsistencias}
          pagination={false}
          scroll={{x: '80vw'}}
          style={{ marginBottom: '.5rem' }}
        />
      </Contenedor>
      {/* MODAL PARA EDITAR LA ASISTENCIA */}
      <ModalEditarAsistencia visible={modalEditar} abrir={abrirModalEditar} loadingActualizar={loadingActualizar} actualizar={actualizarAsistencia} />
    </div>
  )
}
