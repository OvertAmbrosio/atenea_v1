import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Button, Table } from 'antd';
import { CloudSyncOutlined, EditFilled, LoadingOutlined, ReloadOutlined, UserSwitchOutlined } from '@ant-design/icons';

import columnasAverias from './columnasAverias'
import { getOrdenes } from '../../../services/apiOrden';
import { ordenes } from '../../../constants/metodos';
import { obtenerFiltroId, obtenerFiltroNombre } from '../../../libraries/obtenerFiltro';

function TablaOrdenes({ gestores, contratas, tipo }) {
  const [dataOrdenes, setDataOrdenes] = useState([]);
  const [loadingOrdenes, setLoadingOrdenes] = useState(false);
  const [loadingCruzar, setLoadingCruzar] = useState(false);
  const [ordenesSeleccionadas, setOrdenesSeleccionadas] = useState([]);
  const [filtroDistrito, setFiltroDistrito] = useState([]);
  const [filtroBucket, setFiltroBucket] = useState([]);
  const [filtroEstadoToa, setFiltroEstadoToa] = useState([]);
  const [filtroContrata, setFiltroContrata] = useState([]);
  const [filtroGestor, setFiltroGestor] = useState([]);

  useEffect(() => {
    listarOrdenes();
  // eslint-disable-next-line
  },[]);

  useEffect(() => {
    if (dataOrdenes.length > 0) {
      obtenerFiltroNombre(dataOrdenes, 'distrito').then((f) => setFiltroDistrito(f));
      obtenerFiltroNombre(dataOrdenes, 'bucket').then((f) => setFiltroBucket(f));
      obtenerFiltroNombre(dataOrdenes, 'estado_toa').then((f) => setFiltroEstadoToa(f));
      obtenerFiltroId(dataOrdenes, 'contrata').then((f) => setFiltroContrata(f));
      obtenerFiltroId(dataOrdenes, 'gestor', true).then((f) => setFiltroGestor(f));
    };
  },[dataOrdenes])

  async function listarOrdenes() {
    setLoadingOrdenes(true);
    await getOrdenes(true, { metodo: ordenes.ORDENES_HOY })
      .then(({data}) => setDataOrdenes(data))
      .catch((err) => console.log(err))
      .finally(() => setLoadingOrdenes(false));
  };

  async function sincronizarData() {
    setLoadingCruzar(true);
    await getOrdenes(true, { metodo: ordenes.CRUZAR_DATA, tipo})
      .then((e) => {
        if (e.status === 'success') {
          listarOrdenes()
        };
      })
      .catch((err) => console.log(err))
      .finally(() => setLoadingCruzar(false));
  }

  return (
    <div>
      <div>
        <Button 
          type="primary"
          icon={loadingOrdenes ? <LoadingOutlined spin/>:<ReloadOutlined/>}
          style={{ marginBottom: '1rem', marginRight: '.5rem' }}
          onClick={listarOrdenes}
        >Actualizar</Button>
        <Button
          icon={loadingCruzar ? <LoadingOutlined spin/>:<CloudSyncOutlined />}
          style={{ marginBottom: '1rem', marginRight: '.5rem' }}
          onClick={sincronizarData}
        >Sincronizar</Button>
        <Button 
          icon={loadingOrdenes ? <LoadingOutlined spin/>:<EditFilled/>}
          style={{ marginBottom: '1rem', marginRight: '.5rem' }}
          // onClick={listarOrdenes}
        >Editar Bucket</Button>
        <Button 
          icon={loadingOrdenes ? <LoadingOutlined spin/>:<UserSwitchOutlined/>}
          style={{ marginBottom: '1rem', marginRight: '.5rem' }}
          // onClick={listarOrdenes}
        >Asignar</Button>
      </div>
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
        dataSource={dataOrdenes}
        loading={loadingOrdenes}
        size="small"
        scroll={{ y: '65vh' }}
        pagination={{
          defaultPageSize: 50,
          pageSizeOptions: [50,100,200]
        }}
      />
    </div>
  )
}

TablaOrdenes.propTypes = {
  gestores: PropTypes.array,
  contratas: PropTypes.array
}

export default TablaOrdenes

