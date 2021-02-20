import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Table } from 'antd';

import columnasOrdenes from './columnas/columnasOrdenes'
import { obtenerFiltroId, obtenerFiltroNombre } from '../../../libraries/obtenerFiltro';
import ModalDetalleOrden from './ModalsTabla/ModalDetalleOrden';

function TablaOrdenes({ tipo, data, loading, ordenesSeleccionadas, setOrdenesSeleccionadas, abrirReiterada, abrirInfancia, abrirRegistro, listarOrdenes }) {
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
  const [filtroCtr, setFiltroCtr] = useState([]);
  const [filtroObservacion, setFiltroObservacion] = useState([]);
  const [filtroTimeSlot, setFiltroTimeSlot] = useState([]);
  const [idOrdenDetalle, setIdOrdenDetalle] = useState(null);
  const [modalDetalle, setModalDetalle] = useState(false);

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
      obtenerFiltroNombre(dataSource, 'distrito').then((f) => setFiltroDistrito(f));
      obtenerFiltroNombre(dataSource, 'bucket').then((f) => setFiltroBucket(f));
      obtenerFiltroNombre(dataSource, 'estado_toa').then((f) => setFiltroEstadoToa(f));
      obtenerFiltroNombre(dataSource, 'estado_gestor').then((f) => setFiltroEstadoGestor(f));
      obtenerFiltroNombre(dataSource, 'tipo_requerimiento').then((f) => setFiltroTipoReq(f));
      obtenerFiltroNombre(dataSource, 'tipo_tecnologia').then((f) => setFiltroTecnologia(f));
      obtenerFiltroNombre(dataSource, 'codigo_nodo').then((f) => setFiltroNodo(f));
      obtenerFiltroNombre(dataSource, 'codigo_troba').then((f) => setFiltroTroba(f));
      obtenerFiltroNombre(dataSource, 'codigo_ctr').then((f) => setFiltroCtr(f));
      obtenerFiltroNombre(dataSource, 'observacion_gestor').then((f) => setFiltroObservacion(f));
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
          filtroCtr,
          filtroTimeSlot,
          filtroObservacion,
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

