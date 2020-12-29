import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Table } from 'antd';

import columnasAverias from './columnasAverias'
import { obtenerFiltroId, obtenerFiltroNombre } from '../../../libraries/obtenerFiltro';

function TablaOrdenes({ data, loading, ordenesSeleccionadas, setOrdenesSeleccionadas }) {
  const [filtroDistrito, setFiltroDistrito] = useState([]);
  const [filtroBucket, setFiltroBucket] = useState([]);
  const [filtroEstadoToa, setFiltroEstadoToa] = useState([]);
  const [filtroContrata, setFiltroContrata] = useState([]);
  const [filtroGestor, setFiltroGestor] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      obtenerFiltroNombre(data, 'distrito').then((f) => setFiltroDistrito(f));
      obtenerFiltroNombre(data, 'bucket').then((f) => setFiltroBucket(f));
      obtenerFiltroNombre(data, 'estado_toa').then((f) => setFiltroEstadoToa(f));
      obtenerFiltroId(data, 'contrata').then((f) => setFiltroContrata(f));
      obtenerFiltroId(data, 'gestor', true).then((f) => setFiltroGestor(f));
    };
  },[data])

  return (
    <Table
      rowKey="_id"
      onRow={(record) => {
        return {
          onDoubleClick: () => console.log(record)
        }
      }}
      rowSelection={{
        columnWidth: 50,
        selectedRowKeys: ordenesSeleccionadas,
        onChange: (e) => setOrdenesSeleccionadas(e)
      }}
      columns={columnasAverias(filtroDistrito,filtroBucket,filtroEstadoToa,filtroContrata,filtroGestor)}
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
  setOrdenesSeleccionadas: PropTypes.func
};

export default TablaOrdenes

