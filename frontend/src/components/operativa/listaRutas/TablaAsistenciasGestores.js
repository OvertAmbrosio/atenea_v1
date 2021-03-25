import React, { useState, useEffect } from 'react';
import { Button, Col, DatePicker, Popover, Row, Statistic, Table } from 'antd';
import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import moment from 'moment';

import { getAsistencias, patchAsistencia } from '../../../services/apiAsistencia';
import { asistencias } from '../../../constants/metodos';
import { ordenarAsistenciaGestor } from '../../../libraries/ordenarAsistencias';
import EstadoTag from './EstadoTag';
import ModalEditarAsistencia from './ModalEditarAsistencia';
import ExcelAsistencia from '../../excelExports/ExcelAsistencia';

const { RangePicker } = DatePicker;

export default function TablaAsistenciasGestores() {
  const [diaInicio, setDiaInicio] = useState(moment().startOf('week'));
  const [diaFin, setDiaFin] = useState(moment().endOf('week'));
  const [listaDias, setListaDias] = useState([]);
  const [columnas, setColumnas] = useState(null);
  const [dataAsistencias, setDataAsistencias] = useState([]);
  const [loadingAsistencia, setLoadingAsistencia] = useState(false);
  const [loadingActualizar, setLoadingActualizar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [idAsistencia, setIdAsistencia] = useState(null);

  useEffect(() => {
    cambiarRango([moment().startOf('week'), moment().endOf('week')])
  //eslint-disable-next-line
  }, [])

  useEffect(() => {
    listarAsistencias()
  //eslint-disable-next-line
  }, [diaInicio, diaFin])
  
  useEffect(() => {
    generarColumnas();
  //eslint-disable-next-line
  }, [listaDias]);

  async function listarAsistencias() {
    if (diaInicio && diaFin) {
      setLoadingAsistencia(true);
      await getAsistencias({
        metodo: asistencias.LISTAR_TODO,
        tipo: 'gestor',
        fecha_inicio: diaInicio.toDate(),
        fecha_fin: diaFin.toDate()
      }).then(async({data}) => {
        return await ordenarAsistenciaGestor(data.filter((e) => e.gestor !== null))
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
        setModalEditar(false);
        listarAsistencias();
      });
  };

  const abrirModalEditar = () => setModalEditar(!modalEditar);

  const editarAsistencia = (id) => {
    abrirModalEditar();
    setIdAsistencia(id);
  };

  function cambiarRango(dias) {
    if (dias && dias.length > 1) {
      const diff = moment(dias[1].toDate()).diff(dias[0].toDate(), 'days');
      setDiaInicio(dias[0]);
      setDiaFin(dias[1])
      let days = [];
      for (let i = 0; i <= diff; i++) {
        days.push(moment(dias[0].toDate()).add(i, 'days').format("DD-MM"));
      };
      setListaDias(days);
    } else {
      setDiaInicio(moment().startOf('week'));
      setDiaFin(moment().endOf('week'));
    }
  };

  function generarColumnas() {
    if (listaDias.length > 0) {
      const firstColumn = [{
        title: '#',
        width: 50,
        align: 'center',
        render: (_,__,i) => i+1
      }, 
      {
        title: 'Gestor',
        dataIndex: 'gestor',
        width: 450,
        render: (e, row) => row.nombre + ' ' + row.apellidos
      }];

      const columnsAux = listaDias.map((e) => {
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
                  <button className="boton-none"><EstadoTag actualizar={listarAsistencias} row={row} fecha={e} estado={a.estado}/></button>
                </Popover>
              )
            } else {
              return (<EstadoTag actualizar={listarAsistencias} row={row} fecha={e} estado={a && a.estado ? a.estado :'-'}/>)
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
          <RangePicker
            style={{ marginRight: '.5rem' }}
            onChange={cambiarRango}
            value={[moment(diaInicio), moment(diaFin)]}
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
        footer={() => <ExcelAsistencia data={dataAsistencias} dias={listaDias} nombre="gestor"/>}
        scroll={{ y: '60vh' }}
      />
      {/* MODAL PARA EDITAR LA ASISTENCIA */}
      <ModalEditarAsistencia visible={modalEditar} abrir={abrirModalEditar} loadingActualizar={loadingActualizar} actualizar={actualizarAsistencia} />
    </div>
  )
};

