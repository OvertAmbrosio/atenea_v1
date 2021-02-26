import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Button, Dropdown } from 'antd';
import { CloudSyncOutlined, ScheduleOutlined, LoadingOutlined, ReloadOutlined, UserSwitchOutlined, ExportOutlined, FileSyncOutlined, SyncOutlined, ClearOutlined } from '@ant-design/icons';

import TablaOrdenesPendientes from './TablaOrdenesPendientes';
import { getOrdenes, patchOrdenes, patchFilesOrdenes } from '../../../services/apiOrden';
import { ordenes } from '../../../constants/metodos';
import { listaBuckets } from "../../../constants/valoresOrdenes";
import ModalAgendar from './ModalsTabla/ModalAgendar';
import ModalReiterada from './ModalsTabla/ModalReiterada';
import ModalAsignar from './ModalsTabla/ModalAsignar';
import ModalEstado from './ModalsTabla/ModalEstado';
import ModalRegistro from './ModalsTabla/ModalRegistro';
import ModalInfancia from './ModalsTabla/ModalInfancia';
import ExcelOrdenesPendientes from '../../excelExports/ExcelOrdenesPendientes';

function OrdenesPendientes({ contratas, gestores, tecnicos, tipo }) {
  const [dataOrdenes, setDataOrdenes] = useState([]);
  const [dataRegistros, setDataRegistros] = useState([]);
  const [dataInfancia, setDataInfancia] = useState([]);
  const [ordenesSeleccionadas, setOrdenesSeleccionadas] = useState([]);
  const [loadingOrdenes, setLoadingOrdenes] = useState(false);
  const [loadingCruzar, setLoadingCruzar] = useState(false);
  const [loadingComprobarInfancias, setLoadingComprobarInfancias] = useState(false);
  const [loadingAgendar, setLoadingAgendar] = useState(false);
  const [loadingAsignar, setLoadingAsignar] = useState(false);
  const [loadingEstado, setLoadingEstado] = useState(false);
  const [loadingRegistro, setLoadingRegistro] = useState(false);
  const [loadingInfancia, setLoadingInfancia] = useState(false);
  const [loadingExportar, setLoadingExportar] = useState(false);
  const [modalAgendar, setModalAgendar] = useState(false);
  const [modalAsignar, setModalAsignar] = useState(false);
  const [modalReiterada, setModalReiterada] = useState(false);
  const [modalInfancia, setModalInfancia] = useState(false);
  const [modalEstado, setModalEstado] = useState(false);
  const [modalRegistro, setModalRegistro] = useState(false);
  const [codigoCliente, setCodigoCliente] = useState(null);
  const [filtros, setFiltros] = useState(null);

  useEffect(() => {
    listarOrdenes();
  // eslint-disable-next-line
  },[]);

  async function listarOrdenes() {
    setLoadingOrdenes(true);
    setOrdenesSeleccionadas([]);
    await getOrdenes(true, { metodo: ordenes.ORDENES_HOY, tipo })
      .then(({data}) => {
        if (data && data.length > 0) {
          setDataOrdenes(data);
        }
      }).catch((err) => console.log(err)).finally(() => setLoadingOrdenes(false));
  };

  async function buscarInfancia(id_orden) {
    setLoadingInfancia(true);
    await getOrdenes( true, { metodo: ordenes.BUSCAR_INFANCIA, id: id_orden })
      .then(({data}) => {
        if (data && data._id ) {
          setDataInfancia([data]);
        }
      }).catch((err) => console.log(err)).finally(() => setLoadingInfancia(false));
  };

  async function buscarRegistro(id_orden) {
    setLoadingRegistro(true);
    await getOrdenes( true, { metodo: ordenes.BUSCAR_REGISTROS, id: id_orden })
      .then(({data}) => {
        if (data && data.length > 0) {
          setDataRegistros(data);
        }
      }).catch((err) => console.log(err)).finally(() => setLoadingRegistro(false));
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
  };

  async function comprobarInfancias() {
    setLoadingComprobarInfancias(true);
    await getOrdenes(true, { metodo: ordenes.COMPROBAR_INFANCIAS })
      .then((e) => {
        if (e.status === 'success') {
          listarOrdenes()
        };
      })
      .catch((err) => console.log(err))
      .finally(() => setLoadingComprobarInfancias(false));
  };

  async function agendarOrdenes(bucketSeleccionado, contrataSeleccionada, gestorSeleccionado, fechaCita, observacion) {
    if (ordenesSeleccionadas && ordenesSeleccionadas.length > 0) {
      setLoadingAgendar(true);
      await patchOrdenes({
        metodo: ordenes.AGENDAR_ORDEN, 
        ordenes: ordenesSeleccionadas,
        bucket: bucketSeleccionado, 
        contrata: contrataSeleccionada, 
        gestor: gestorSeleccionado,
        fecha_cita: fechaCita,
        observacion
      }).then(async() => await listarOrdenes()).catch((err) => console.log(err)).finally(() => setLoadingAgendar(false));
    }
  };

  async function asignarOrdenes(data) {
    if (ordenesSeleccionadas && ordenesSeleccionadas.length > 0) {
      const auxData = data;
      setLoadingAsignar(true);
      abrirModalAsignar();
      await patchOrdenes({
        metodo: ordenes.ASIGNAR_ORDEN, ordenes: ordenesSeleccionadas, ...auxData
      }).then(async() => await listarOrdenes()).catch((err) => console.log(err)).finally(() => setLoadingAsignar(false));
    }
  };

  async function actualizarEstado(estado, observacion, files=[]) {
    if (ordenesSeleccionadas && ordenesSeleccionadas.length > 0) {
      let orden_imagen = new FormData();
      orden_imagen.append('metodo', ordenes.ACTUALIZAR_ESTADO);
      orden_imagen.append('ordenes', JSON.stringify(ordenesSeleccionadas));
      if (estado) orden_imagen.append('estado', estado);
      if (observacion) orden_imagen.append('observacion', observacion);
      files.forEach((f) => {
        orden_imagen.append('files', f);
      });

      setLoadingEstado(true);
      abrirModalEstado();
      await patchFilesOrdenes(orden_imagen)
        .then(async() => await listarOrdenes())
        .catch((err) => console.log(err))
        .finally(() => setLoadingEstado(false));
    }
  };

  function limpiarFiltros() {
    setFiltros(null);
  };

  const abrirModalAgendar = () => setModalAgendar(!modalAgendar);
  const abrirModalAsignar = () => setModalAsignar(!modalAsignar);
  const abrirModalReiterada = () => setModalReiterada(!modalReiterada);
  const abrirModalInfancia = () => setModalInfancia(!modalInfancia);
  const abrirModalEstado = () => setModalEstado(!modalEstado);
  const abrirModalRegistro = () => setModalRegistro(!modalRegistro);
 
  const abrirReiterada = (c) => {
    setCodigoCliente(c);
    abrirModalReiterada();
  };

  const abrirInfancia = async (id) => {
    abrirModalInfancia();
    await buscarInfancia(id);
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
          disabled={loadingOrdenes}
          style={{ marginBottom: '1rem', marginRight: '.5rem' }}
          onClick={listarOrdenes}
        >Actualizar</Button>
        <Button
          icon={loadingCruzar ? <LoadingOutlined spin/>:<CloudSyncOutlined />}
          style={{ marginBottom: '1rem', marginRight: '.5rem' }}
          onClick={sincronizarData}
        >Sincronizar</Button>
        <Button
          icon={loadingComprobarInfancias ? <LoadingOutlined spin/>:<SyncOutlined />}
          style={{ marginBottom: '1rem', marginRight: '.5rem' }}
          onClick={comprobarInfancias}
        >Comprobar Infancias</Button>
        <Button 
          icon={loadingAgendar ? <LoadingOutlined spin/>:<ScheduleOutlined />}
          style={{ marginBottom: '1rem', marginRight: '.5rem' }}
          disabled={ordenesSeleccionadas.length === 0}
          onClick={abrirModalAgendar}
        >Agendar</Button>
        <Button 
          icon={loadingAsignar ? <LoadingOutlined spin/>:<UserSwitchOutlined/>}
          style={{ marginBottom: '1rem', marginRight: '.5rem' }}
          disabled={ordenesSeleccionadas.length === 0}
          onClick={abrirModalAsignar}
        >Asignar</Button>
        <Button 
          icon={loadingEstado ? <LoadingOutlined spin/>:<FileSyncOutlined/>}
          style={{ marginBottom: '1rem', marginRight: '.5rem' }}
          disabled={ordenesSeleccionadas.length === 0}
          onClick={abrirModalEstado}
        >Estado</Button>
        <Dropdown 
          overlay={<ExcelOrdenesPendientes metodo={ordenes.EXPORTAR_PENDIENTES} tipo={tipo} setLoading={setLoadingExportar} ordenesSeleccionadas={ordenesSeleccionadas}/>} 
          placement="bottomLeft" 
          trigger={['click']}
          arrow
        >
          <Button
            icon={loadingExportar ? <LoadingOutlined spin/>:<ExportOutlined/>}
            style={{ marginBottom: '1rem', marginRight: '.5rem' }}
          >
            Exportar
          </Button>
        </Dropdown>
        <Button 
          icon={<ClearOutlined />}
          style={{ marginBottom: '1rem', marginRight: '.5rem' }}
          onClick={limpiarFiltros}
        >Filtros</Button>
      </div>
      <TablaOrdenesPendientes 
        filtros={filtros}
        setFiltros={setFiltros}
        tipo={tipo}
        data={dataOrdenes} 
        loading={loadingOrdenes} 
        ordenesSeleccionadas={ordenesSeleccionadas} 
        setOrdenesSeleccionadas={setOrdenesSeleccionadas}
        abrirReiterada={abrirReiterada}
        abrirInfancia={abrirInfancia}
        abrirRegistro={abrirRegistro}
        listarOrdenes={listarOrdenes}
      />
      {/* MODAL PARA AGENDAR LA ORDEN */}
      <ModalAgendar visible={modalAgendar} abrir={abrirModalAgendar} buckets={listaBuckets} contratas={contratas} gestores={gestores} agendar={agendarOrdenes}/>
      {/* MODAL PARA ASIGNAR CONTRATA, GESTOR O TECNICO */}
      <ModalAsignar visible={modalAsignar} abrir={abrirModalAsignar} contratas={contratas} gestores={gestores} tecnicos={tecnicos} asignar={asignarOrdenes}/>
      {/* MODAL PARA ACTUALIZAR EL ESTADO_GESTOR DE LA ORDEN */}
      <ModalEstado visible={modalEstado} abrir={abrirModalEstado} actualizarEstado={actualizarEstado} />
      {/* MODAL PARA BUSCAR LA REITERADA */}
      <ModalReiterada visible={modalReiterada} abrir={abrirModalReiterada} codigo_cliente={codigoCliente}/>
      {/* MODAL PARA BUSCAR LA INFANCIA */}
      <ModalInfancia visible={modalInfancia} abrir={abrirModalInfancia} loading={loadingInfancia} orden={dataInfancia} />
      {/* MODAL DETALLE PARA VER EL HISTORIAL DE CAMBIOS */}
      <ModalRegistro visible={modalRegistro} abrir={abrirModalRegistro} loading={loadingRegistro} registros={dataRegistros}/>
    </div>
  )
}

OrdenesPendientes.propTypes = {
  contratas: PropTypes.array,
  gestores: PropTypes.array,
  tecnicos: PropTypes.array,
  tipo: PropTypes.string
}

export default OrdenesPendientes

