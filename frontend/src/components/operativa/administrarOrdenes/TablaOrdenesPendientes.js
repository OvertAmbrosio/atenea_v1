import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Col, Input, Row, Statistic, Table } from 'antd';


import columnasOrdenes from './columnas/columnasOrdenes'
import { obtenerFiltroId, obtenerFiltroNombre, obtenerFiltroFecha } from '../../../libraries/obtenerFiltro';
import ModalDetalleOrden from './ModalsTabla/ModalDetalleOrden';

const { Search } = Input;

function TablaOrdenes({ filtros, setFiltros, tipo, data=[], loading, ordenesSeleccionadas=[], setOrdenesSeleccionadas, abrirReiterada, abrirInfancia, abrirRegistro, listarOrdenes }) {
  const [dataTotal, setDataTotal] = useState([]);
  const [filtroDistrito, setFiltroDistrito] = useState([]);
  const [filtroBucket, setFiltroBucket] = useState([]);
  const [filtroEstadoToa, setFiltroEstadoToa] = useState([]);
  const [filtroEstadoGestor, setFiltroEstadoGestor] = useState([])
  const [filtroContrata, setFiltroContrata] = useState([]);
  const [filtroGestorAsignado, setFiltroGestorAsignado] = useState([]);
  const [filtroTipoReq, setFiltroTipoReq] = useState([]);
  const [filtroTecnologia, setFiltroTecnologia] = useState([]);
  const [filtroNodo, setFiltroNodo] = useState([]);
  const [filtroTroba, setFiltroTroba] = useState([]);
  const [filtroPai, setFiltroPai] = useState([]);
  const [filtroCtr, setFiltroCtr] = useState([]);
  const [filtroObservacion, setFiltroObservacion] = useState([]);
  const [filtroTimeSlot, setFiltroTimeSlot] = useState([]);
  const [filtroFechaCita, setFiltroFechaCita] = useState([]);
  const [idOrdenDetalle, setIdOrdenDetalle] = useState(null);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [cantidadFiltrados, setCantidadFiltrados] = useState(0);

  useEffect(() => {
    if (data && data.length > 0) {
      setDataTotal(data);
      generarFiltros(data);
    } else {
      setDataTotal([]);
    }
  //eslint-disable-next-line
  },[data]);

  useEffect(() => {
    if (!filtros) setCantidadFiltrados(0);
  }, [filtros])

  const abrirModalDetalle = () => setModalDetalle(!modalDetalle);

  const abrirDetalle = (id) => {
    setIdOrdenDetalle(id);
    abrirModalDetalle();
  };

  const generarFiltros = (dataSource) => {
    setCantidadFiltrados(dataSource.length)
    setFiltroDistrito(obtenerFiltroNombre(dataSource, 'distrito'));
    setFiltroBucket(obtenerFiltroNombre(dataSource, 'bucket'));
    setFiltroEstadoToa(obtenerFiltroNombre(dataSource, 'estado_toa'));
    setFiltroEstadoGestor(obtenerFiltroNombre(dataSource, 'estado_gestor'));
    setFiltroTipoReq(obtenerFiltroNombre(dataSource, 'tipo_requerimiento'));
    setFiltroTecnologia(obtenerFiltroNombre(dataSource, 'tipo_tecnologia'));
    setFiltroNodo(obtenerFiltroNombre(dataSource, 'codigo_nodo'));
    setFiltroTroba(obtenerFiltroNombre(dataSource, 'codigo_troba'));
    setFiltroPai(obtenerFiltroNombre(dataSource, 'indicador_pai'));
    setFiltroCtr(obtenerFiltroNombre(dataSource, 'codigo_ctr'));
    setFiltroObservacion(obtenerFiltroNombre(dataSource, 'observacion_gestor'));
    setFiltroTimeSlot(obtenerFiltroNombre(dataSource, 'tipo_agenda'));
    setFiltroFechaCita(obtenerFiltroFecha(dataSource, 'fecha_cita'))
    setFiltroContrata(obtenerFiltroId(dataSource, 'contrata'));
    setFiltroGestorAsignado(obtenerFiltroId(dataSource, 'gestor_liteyca', true));
    setFiltroGestorAsignado(obtenerFiltroId(dataSource, 'gestor_liteyca', true));
  };

  const onChangeTable = (_, filters, __, dataSource) => {
    generarFiltros(dataSource.currentDataSource);
    setFiltros(filters);
  };

  function buscarRequerimiento(e) {
    if (e && e.length > 1) {
      setDataTotal(data.filter((o) => String(o.codigo_requerimiento).includes(e)))
    } else {
      setDataTotal(data);
    }
  };

  return (
    <div>
      <Table
        title={() => 
          <Search 
            placeholder="Requerimiento..." 
            size="small"
            onSearch={buscarRequerimiento} 
            style={{ width: 180, marginRight: '0rem', marginBottom: '.5rem' }} 
            allowClear 
          />}
        rowKey="_id"
        onRow={(record) => {
          return {
            onDoubleClick: () => abrirDetalle(record._id),
          }
        }}
        rowSelection={{
          columnWidth: 50,
          selectedRowKeys: ordenesSeleccionadas,
          onChange: (e) => setOrdenesSeleccionadas(e)
        }}
        onChange={onChangeTable}
        columns={columnasOrdenes({
          tipo, 
          setFiltros,
          filtroDistrito,
          filtroBucket,
          filtroEstadoToa,
          filtroEstadoGestor,
          filtroContrata,
          filtroGestorAsignado,
          filtroTipoReq,
          filtroTecnologia,
          filtroNodo,
          filtroTroba,
          filtroPai,
          filtroCtr,
          filtroTimeSlot,
          filtroObservacion,
          filtroFechaCita,
          abrirReiterada, 
          abrirInfancia,
          abrirRegistro,
          listarOrdenes})
        }
        dataSource={dataTotal}
        loading={loading}
        size="small"
        scroll={{ y: '65vh' }}
        pagination={{
          defaultPageSize: 50,
          pageSizeOptions: [50,100,200]
        }}
        footer={() => (
          <Row gutter={16}>
            <Col span={4}>
              <Statistic title="Total" value={data.length} />
            </Col>
            <Col span={12}>
              <Statistic title="Total Filtradas" value={cantidadFiltrados} />
            </Col>
            <Col span={12}>
              <Statistic title="Ordenes Seleccionadas" value={ordenesSeleccionadas.length} />
            </Col>
          </Row>
        )}
      />
      {/* MODAL DETALLE */}
      <ModalDetalleOrden visible={modalDetalle} abrir={abrirModalDetalle} orden={idOrdenDetalle} tipo={tipo}/>
    </div>
  )
};

TablaOrdenes.propTypes = {
  filtros: PropTypes.any,
  setFiltros: PropTypes.func,
  tipo: PropTypes.string,
  data: PropTypes.array,
  loading: PropTypes.bool,
  ordenesSeleccionadas: PropTypes.array,
  setOrdenesSeleccionadas: PropTypes.func,
  abrirReiterada: PropTypes.func,
  abrirDetalle: PropTypes.func,
  listarOrdenes: PropTypes.func
};

export default TablaOrdenes

