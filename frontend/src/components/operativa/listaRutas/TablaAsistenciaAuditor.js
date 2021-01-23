import React, { useState, useEffect } from 'react';
import { Button, Col, DatePicker, Popover, Row, Statistic, Table } from 'antd';
import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import moment from 'moment';

import { getAsistencias, patchAsistencia } from '../../../services/apiAsistencia';
import { asistencias } from '../../../constants/metodos';
import { ordenarAsistenciaAuditor } from '../../../libraries/ordenarAsistencias';
import EstadoTag from './EstadoTag';
import ModalEditarAsistencia from './ModalEditarAsistencia';

export default function TablaAsistenciasAuditores() {
  const [diaInicio, setDiaInicio] = useState(null);
  const [diaFin, setDiaFin] = useState(null);
  const [diasSemana, setDiasSemana] = useState([]);
  const [columnas, setColumnas] = useState(null);
  const [dataAsistencias, setDataAsistencias] = useState([]);
  const [loadingAsistencia, setLoadingAsistencia] = useState(false);
  const [loadingActualizar, setLoadingActualizar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [idAsistencia, setIdAsistencia] = useState(null);

  useEffect(() => {
    generarColumnas();
  //eslint-disable-next-line
  }, [diasSemana])

  async function listarAsistencias() {
    if (diaInicio && diaFin) {
      setLoadingAsistencia(true);
      await getAsistencias({
        metodo: asistencias.LISTAR_TODO,
        tipo: 'auditor',
        fecha_inicio: diaInicio,
        fecha_fin: diaFin
      }).then(async({data}) => {
        return await ordenarAsistenciaAuditor(data.filter((e) => e.auditor !== null))
      }).then((resultado) => {
        if (resultado && resultado.length > 0) {
          setDataAsistencias(resultado);
        }
      }).catch((err) => console.log(err)).finally(() => setLoadingAsistencia(false));
    };
  };

  async function actualizarAsistencia(estado, observacion) {
    setLoadingActualizar(true);
    return await patchAsistencia({id: idAsistencia, estado, observacion})
      .catch((err) => console.log(err))
      .finally(() => {
        setLoadingActualizar(false);
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

  function generarColumnas() {
    if (diasSemana.length > 0) {
      const firstColumn = [{
        title: '#',
        width: 50,
        align: 'center',
        render: (_,__,i) => i+1
      }, 
      {
        title: 'Auditor',
        dataIndex: 'auditor',
        width: 450,
        render: (e, row) => row.nombre + ' ' + row.apellidos
      }];

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

  const columnasDefecto = [
    {
      title: '#',
      width: 50,
      align: 'center',
      render: (_,__,i) => i+1
    }, 
    {
      title: 'Auditor',
      width: 200
    },
    {
      title: 'Fecha',
      width: 100
    }
  ];

  return (
    <div style={{ marginBottom: '1rem'}}>
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
      </Row>
      <Table
        rowKey="_id"
        size="small"
        loading={loadingAsistencia}
        columns={columnas !== null && columnas.length !== 0 ? columnas : columnasDefecto}
        dataSource={dataAsistencias}
        pagination={false}
      />
      {/* MODAL PARA EDITAR LA ASISTENCIA */}
      <ModalEditarAsistencia visible={modalEditar} abrir={abrirModalEditar} loadingActualizar={loadingActualizar} actualizar={actualizarAsistencia} />
    </div>
  )
};

