import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Col, Row, Statistic, Table } from 'antd';

import columnasOrdenes from './columnas/columnasOrdenes'
import { obtenerFiltroId, obtenerFiltroNombre, obtenerFiltroFecha } from '../../../libraries/obtenerFiltro';
import ModalDetalleOrden from './ModalsTabla/ModalDetalleOrden';

function TablaOrdenes({ tipo, data=[], loading, ordenesSeleccionadas, setOrdenesSeleccionadas, abrirReiterada, abrirInfancia, abrirRegistro, listarOrdenes }) {
  const [filtroDistrito, setFiltroDistrito] = useState([]);
  const [filtroBucket, setFiltroBucket] = useState([]);
  const [filtroEstadoToa, setFiltroEstadoToa] = useState([]);
  const [filtroEstadoGestor, setFiltroEstadoGestor] = useState([])
  const [filtroContrata, setFiltroContrata] = useState([]);
  const [filtroGestorAsignado, setFiltroGestorAsignado] = useState([]);
  const [filtroTecnicoToa, setFiltroTecnicoToa] = useState([]);
  const [filtroTecnicoAsignado, setFiltroTecnicoAsignado] = useState([]);
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
    generarFiltros(data);
  //eslint-disable-next-line
  },[data]);

  const abrirModalDetalle = () => setModalDetalle(!modalDetalle);

  const abrirDetalle = (id) => {
    setIdOrdenDetalle(id);
    abrirModalDetalle();
  };

  const generarFiltros = async (dataSource) => {
    if (dataSource && dataSource.length > 0) {
      setCantidadFiltrados(dataSource.length)
      obtenerFiltroNombre(dataSource, 'distrito').then((f) => setFiltroDistrito(f));
      obtenerFiltroNombre(dataSource, 'bucket').then((f) => setFiltroBucket(f));
      obtenerFiltroNombre(dataSource, 'estado_toa').then((f) => setFiltroEstadoToa(f));
      obtenerFiltroNombre(dataSource, 'estado_gestor').then((f) => setFiltroEstadoGestor(f));
      obtenerFiltroNombre(dataSource, 'tipo_requerimiento').then((f) => setFiltroTipoReq(f));
      obtenerFiltroNombre(dataSource, 'tipo_tecnologia').then((f) => setFiltroTecnologia(f));
      obtenerFiltroNombre(dataSource, 'codigo_nodo').then((f) => setFiltroNodo(f));
      obtenerFiltroNombre(dataSource, 'codigo_troba').then((f) => setFiltroTroba(f));
      obtenerFiltroNombre(dataSource, 'indicador_pai').then((f) => setFiltroPai(f));
      obtenerFiltroNombre(dataSource, 'codigo_ctr').then((f) => setFiltroCtr(f));
      obtenerFiltroNombre(dataSource, 'observacion_gestor').then((f) => setFiltroObservacion(f));
      obtenerFiltroFecha(dataSource, 'fecha_cita').then((f) => setFiltroFechaCita(f));
      obtenerFiltroNombre(dataSource, 'tipo_agenda').then((f) => setFiltroTimeSlot(f));
      obtenerFiltroId(dataSource, 'contrata').then((f) => setFiltroContrata(f));
      obtenerFiltroId(dataSource, 'gestor_liteyca', true).then((f) => setFiltroGestorAsignado(f));
      obtenerFiltroId(dataSource, 'tecnico', true).then((f) => setFiltroTecnicoToa(f));
      obtenerFiltroId(dataSource, 'tecnico_liteyca', true).then((f) => setFiltroTecnicoAsignado(f));        
    };
  };

  return (
    <div>
      <Table
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
        onChange={(_,__,___,{ currentDataSource }) => generarFiltros(currentDataSource)}
        columns={columnasOrdenes(
          tipo, 
          filtroDistrito,
          filtroBucket,
          filtroEstadoToa,
          filtroEstadoGestor,
          filtroContrata,
          filtroGestorAsignado,
          filtroTecnicoToa,
          filtroTecnicoAsignado,
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
          listarOrdenes)
        }
        dataSource={data}
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
          </Row>
        )}
      />
      {/* MODAL DETALLE */}
      <ModalDetalleOrden visible={modalDetalle} abrir={abrirModalDetalle} orden={idOrdenDetalle} tipo={tipo}/>
    </div>
  )
};

TablaOrdenes.propTypes = {
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

