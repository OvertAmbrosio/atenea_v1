import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Button, Table } from 'antd';
import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons';

import { getOrdenes } from '../../../services/apiOrden';
import { ordenes } from '../../../constants/metodos';
import { obtenerFiltroId, obtenerFiltroNombre } from '../../../libraries/obtenerFiltro';
import ModalRegistro from './ModalsTabla/ModalRegistro';
import columnasOrdenesAnuladas from './columnas/columnasAnuladas';

function OrdenesAnuladas({tipo}) {
  const [dataOrdenes, setDataOrdenes] = useState([]);
  const [dataRegistros, setDataRegistros] = useState([]);
  const [ordenesSeleccionadas, setOrdenesSeleccionadas] = useState([]);
  const [loadingOrdenes, setLoadingOrdenes] = useState(false);
  const [loadingRegistro, setLoadingRegistro] = useState(false);
  const [filtroDistrito, setFiltroDistrito] = useState([]);
  const [filtroEstadoToa, setFiltroEstadoToa] = useState([]);
  const [filtroEstadoGestor, setFiltroEstadoGestor] = useState([])
  const [filtroTecnologia, setFiltroTecnologia] = useState([]);
  const [filtroNodo, setFiltroNodo] = useState([]);
  const [filtroCtr, setFiltroCtr] = useState([]);
  const [filtroContrata, setFiltroContrata] = useState([]);
  const [filtroGestor, setFiltroGestor] = useState([]);
  const [filtroTecnico, setFiltroTecnico] = useState([]);
  const [modalRegistro, setModalRegistro] = useState(false);

  useEffect(() => {
    listarOrdenes();
  // eslint-disable-next-line
  },[]);

  async function listarOrdenes() {
    setLoadingOrdenes(true);
    setOrdenesSeleccionadas([]);
    await getOrdenes(true, { metodo: ordenes.ORDENES_ANULADAS, tipo, })
      .then(({data}) => {
        if (data && data.length > 0) {
          setDataOrdenes(data);
          obtenerFiltroNombre(data, 'distrito').then((f) => setFiltroDistrito(f));
          obtenerFiltroNombre(data, 'estado_toa').then((f) => setFiltroEstadoToa(f));
          obtenerFiltroNombre(data, 'estado_gestor').then((f) => setFiltroEstadoGestor(f));
          obtenerFiltroNombre(data, 'tipo_tecnologia').then((f) => setFiltroTecnologia(f));
          obtenerFiltroNombre(data, 'codigo_nodo').then((f) => setFiltroNodo(f));
          obtenerFiltroNombre(data, 'codigo_ctr').then((f) => setFiltroCtr(f));
          obtenerFiltroId(data, 'contrata').then((f) => setFiltroContrata(f));
          obtenerFiltroId(data, 'gestor').then((f) => setFiltroGestor(f));
          obtenerFiltroId(data, 'tecnico').then((f) => setFiltroTecnico(f));
        };
      }).catch((err) => console.log(err)).finally(() => setLoadingOrdenes(false));
  };

  const abrirModalRegistro = () => setModalRegistro(!modalRegistro);

  async function buscarRegistro(id_orden) {
    setLoadingRegistro(true);
    await getOrdenes( true, { metodo: ordenes.BUSCAR_REGISTROS, id: id_orden })
      .then(({data}) => {
        if (data && data.length > 0) {
          setDataRegistros(data);
        }
      }).catch((err) => console.log(err)).finally(() => setLoadingRegistro(false));
  };

  const abrirRegistro = async (id) => {
    abrirModalRegistro();
    await buscarRegistro(id);
  };

  return (
    <div>
      <div>
        <Button 
          type="primary"
          icon={loadingOrdenes ? <LoadingOutlined spin/>:<ReloadOutlined/>}
          style={{ marginBottom: '1rem', marginRight: '.5rem' }}
          onClick={listarOrdenes}
        >Actualizar</Button>
      </div>
      <Table
        rowKey="_id"
        rowSelection={{
          columnWidth: 50,
          selectedRowKeys: ordenesSeleccionadas,
          onChange: (e) => setOrdenesSeleccionadas(e)
        }}
        columns={columnasOrdenesAnuladas(
          filtroDistrito,
          filtroEstadoToa,
          filtroEstadoGestor,
          filtroContrata, 
          filtroGestor,
          filtroTecnico,
          filtroTecnologia,
          filtroNodo,
          filtroCtr,
          abrirRegistro,
          listarOrdenes)
        }
        dataSource={dataOrdenes}
        loading={loadingOrdenes}
        size="small"
        scroll={{ y: '65vh' }}
        pagination={{
          defaultPageSize: 50,
          pageSizeOptions: [50,100,200]
        }}
      />
      {/* MODAL DETALLE PARA VER EL HISTORIAL DE CAMBIOS */}
      <ModalRegistro visible={modalRegistro} abrir={abrirModalRegistro} loading={loadingRegistro} registros={dataRegistros}/>
    </div>
  )
};

OrdenesAnuladas.propTypes = {
  tipo: PropTypes.string
};

export default OrdenesAnuladas;

