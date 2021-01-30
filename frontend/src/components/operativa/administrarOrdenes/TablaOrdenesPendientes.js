import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Table } from 'antd';

import columnasOrdenes from './columnasOrdenes'
import { obtenerFiltroId, obtenerFiltroNombre } from '../../../libraries/obtenerFiltro';

function TablaOrdenes({ tipo, data, loading, ordenesSeleccionadas, setOrdenesSeleccionadas, abrirReiterada, abrirInfancia, abrirInfanciaExterna, abrirDetalle, abrirDevolver }) {
  const [filtroDistrito, setFiltroDistrito] = useState([]);
  const [filtroBucket, setFiltroBucket] = useState([]);
  const [filtroEstadoToa, setFiltroEstadoToa] = useState([]);
  const [filtroEstadoGestor, setFiltroEstadoGestor] = useState([])
  const [filtroContrata, setFiltroContrata] = useState([]);
  const [filtroGestor, setFiltroGestor] = useState([]);
  const [filtroTipoReq, setFiltroTipoReq] = useState([]);
  const [filtroTecnologia, setFiltroTecnologia] = useState([]);
  const [filtroNodo, setFiltroNodo] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      obtenerFiltroNombre(data, 'distrito').then((f) => setFiltroDistrito(f));
      obtenerFiltroNombre(data, 'bucket').then((f) => setFiltroBucket(f));
      obtenerFiltroNombre(data, 'estado_toa').then((f) => setFiltroEstadoToa(f));
      obtenerFiltroNombre(data, 'estado_gestor').then((f) => setFiltroEstadoGestor(f));
      obtenerFiltroNombre(data, 'tipo_requerimiento').then((f) => setFiltroTipoReq(f));
      obtenerFiltroNombre(data, 'tipo_tecnologia').then((f) => setFiltroTecnologia(f));
      obtenerFiltroNombre(data, 'codigo_nodo').then((f) => setFiltroNodo(f));
      obtenerFiltroId(data, 'contrata').then((f) => setFiltroContrata(f));
      obtenerFiltroId(data, 'gestor', true).then((f) => setFiltroGestor(f));
    };
  },[data]);

  return (
    <Table
      rowKey="_id"
      // onRow={(record) => {
      //   return {
      //     onDoubleClick: () => console.log(record)
      //   }
      // }}
      rowSelection={{
        columnWidth: 50,
        selectedRowKeys: ordenesSeleccionadas,
        onChange: (e) => setOrdenesSeleccionadas(e)
      }}
      columns={columnasOrdenes(
        tipo, 
        filtroDistrito,
        filtroBucket,
        filtroEstadoToa,
        filtroEstadoGestor,
        filtroContrata,
        filtroGestor, 
        filtroTipoReq,
        filtroTecnologia,
        filtroNodo,
        abrirReiterada, 
        abrirInfancia,
        abrirInfanciaExterna,
        abrirDetalle,
        abrirDevolver)
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
  abrirDevolver: PropTypes.func
};

export default TablaOrdenes

