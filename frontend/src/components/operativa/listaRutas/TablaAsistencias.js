import React, { useState, useEffect } from 'react';
import { Button, Col, DatePicker, Popover, Row, Statistic, Table, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import moment from 'moment';

import { getAsistencias } from '../../../services/apiAsistencia';
import { asistencias } from '../../../constants/metodos';
import colores from '../../../constants/colores';
import ordenarAsistencia from '../../../libraries/ordenarAsistencias';
import EstadoTag from './EstadoTag';
import { obtenerFiltroId } from '../../../libraries/obtenerFiltro';

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
]

export default function TablaAsistencias() {
  const [diaInicio, setDiaInicio] = useState(null);
  const [diaFin, setDiaFin] = useState(null);
  const [diasSemana, setDiasSemana] = useState([]);
  const [columnas, setColumnas] = useState(columnasDefecto);
  const [dataAsistencias, setDataAsistencias] = useState([]);
  const [loadingAsistencia, setLoadingAsistencia] = useState(false);
  const [filtroGestores, setFiltroGestores] = useState([]);
  const [filtroAuditores, setFiltroAuditores] = useState([]);
  const [rutas, setRutas] = useState({total:0,activas:0});

  useEffect(() => {
    generarColumnas();
  //eslint-disable-next-line
  }, [diasSemana, filtroGestores])

  async function listarAsistencias() {
    if (diaInicio && diaFin) {
      setLoadingAsistencia(true);
      await getAsistencias({
        metodo: asistencias.LISTAR_TODO,
        page: 1,
        limit: 20,
        fecha_inicio: diaInicio,
        fecha_fin: diaFin
      }).then(async({data}) => {
        return await ordenarAsistencia(data.filter((e) => e.tecnico !== null))
      }).then((resultado) => {
        setDataAsistencias(resultado);
        obtenerFiltroId(resultado, 'gestor', true).then((f) => setFiltroGestores(f));
        obtenerFiltroId(resultado, 'auditor', true).then((f) => setFiltroAuditores(f));
        rutasAtivas(resultado)
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
        render: (e) => e.nombre ? e.nombre : '-'
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
        render: (e) => e.nombre ? e.nombre : '-'
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
          render: (a) => {
            if (a && a.estado && a.observacion && a.observacion !== '-') {
              return (<Popover content={a.observacion} title="Observaciones" trigger="click">
                <button className="boton-none"><EstadoTag estado={a.estado}/></button>
              </Popover>)
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
    setRutas({total, activas})
  };

  return (
    <div>
      <Row>
        <Col sm={24} style={{ marginBottom: '.5rem' }}>
          <p style={{ color: 'rgba(0,0,0,0.45)' }}>Seleccionar Fecha:</p>
          <DatePicker 
            onChange={cambiarSemana} 
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
        <Col>
          <Statistic 
            title="Rutas Activas (Hoy)" 
            value={rutas.activas} 
            suffix={`/ ${rutas.total}`}
          />
        </Col>
      </Row>
      <Table
        rowKey="_id"
        size="small"
        loading={loadingAsistencia}
        columns={columnas}
        dataSource={dataAsistencias}
        pagination={{
          defaultPageSize: 20
        }}
      />
    </div>
  )
};

