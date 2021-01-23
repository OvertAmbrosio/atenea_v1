import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Table } from 'antd';

import columnasOrdenesGestor from './columnasOrdenesGestor'
import { obtenerFiltroId, obtenerFiltroNombre } from '../../../libraries/obtenerFiltro';

function TablaOrdenes({ data, loading, ordenesSeleccionadas, setOrdenesSeleccionadas, abrirReiterada, abrirInfancia, abrirDetalle }) {
  const [filtroDistrito, setFiltroDistrito] = useState([]);
  const [filtroBucket, setFiltroBucket] = useState([]);
  const [filtroEstadoToa, setFiltroEstadoToa] = useState([]);
  const [filtroEstadoGestor, setFiltroEstadoGestor] = useState([])
  const [filtroContrata, setFiltroContrata] = useState([]);
  const [filtroTecnico, setFiltroTecnico] = useState([]);
  const [filtroGestor, setFiltroGestor] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState([])

  useEffect(() => {
    if (data && data.length > 0) {
      obtenerFiltroNombre(data, 'distrito').then((f) => setFiltroDistrito(f));
      obtenerFiltroNombre(data, 'bucket').then((f) => setFiltroBucket(f));
      obtenerFiltroNombre(data, 'estado_toa').then((f) => setFiltroEstadoToa(f));
      obtenerFiltroNombre(data, 'estado_gestor').then((f) => setFiltroEstadoGestor(f));
      obtenerFiltroId(data, 'contrata').then((f) => setFiltroContrata(f));
      obtenerFiltroId(data, 'tecnico').then((f) => setFiltroTecnico(f));
      obtenerFiltroId(data, 'gestor').then((f) => setFiltroGestor(f));
      obtenerFiltroNombre(data, 'tipo', true).then((f) => setFiltroTipo(f));
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
      columns={columnasOrdenesGestor(
        filtroDistrito,
        filtroTipo,
        filtroBucket,
        filtroEstadoToa,
        filtroEstadoGestor,
        filtroContrata,
        filtroTecnico,
        filtroGestor,
        abrirReiterada, 
        abrirInfancia,
        abrirDetalle)
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
  data: PropTypes.array,
  loading: PropTypes.bool,
  ordenesSeleccionadas: PropTypes.array,
  setOrdenesSeleccionadas: PropTypes.func,
  abrirReiterada: PropTypes.func,
  abrirInfancia: PropTypes.func,
  abrirDetalle: PropTypes.func
};

export default TablaOrdenes

