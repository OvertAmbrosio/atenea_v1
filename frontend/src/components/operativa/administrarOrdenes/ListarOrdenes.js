import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Button, Input } from 'antd';
import { CloudSyncOutlined, ScheduleOutlined, LoadingOutlined, ReloadOutlined, UserSwitchOutlined, ExportOutlined, FileSyncOutlined } from '@ant-design/icons';
import { useJsonToCsv } from 'react-json-csv';
import moment from 'moment'

import TablaOrdenes from './TablaOrdenes';
import { getOrdenes, patchOrdenes, patchFilesOrdenes } from '../../../services/apiOrden';
import { ordenes } from '../../../constants/metodos';
import ModalAgendar from './ModalAgendar';
import { listaBuckets, valoresExcelAdministrar } from "../../../constants/valoresOrdenes";
import ModalReiterada from './ModalReiterada';
import ModalAsignar from './ModalAsignar';
import ModalEstado from './ModalEstado';
import ModalDetalle from './ModalDetalle';
import ModalInfancia from './ModalInfancia';
import ModalDevolver from './ModalDevolver';
import ModalInfanciaExterna from './ModalInfanciaExterna';

const { Search } = Input;

function ListarOrdenes({ contratas, gestores, tecnicos, tipo }) {
  const [totalOrdenes, setTotalOrdenes] = useState([]);
  const [dataOrdenes, setDataOrdenes] = useState([]);
  const [dataRegistros, setDataRegistros] = useState([]);
  const [dataInfancia, setDataInfancia] = useState([]);
  const { saveAsCsv } = useJsonToCsv();
  const [ordenesSeleccionadas, setOrdenesSeleccionadas] = useState([]);
  const [loadingOrdenes, setLoadingOrdenes] = useState(false);
  const [loadingCruzar, setLoadingCruzar] = useState(false);
  const [loadingAgendar, setLoadingAgendar] = useState(false);
  const [loadingAsignar, setLoadingAsignar] = useState(false);
  const [loadingEstado, setLoadingEstado] = useState(false);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [loadingInfancia, setLoadingInfancia] = useState(false);
  const [loadingDevolver, setLoadingDevolver] = useState(false);
  const [modalAgendar, setModalAgendar] = useState(false);
  const [modalAsignar, setModalAsignar] = useState(false);
  const [modalReiterada, setModalReiterada] = useState(false);
  const [modalInfancia, setModalInfancia] = useState(false);
  const [modalInfanciaExterna, setModalInfanciaExterna] = useState(false);
  const [modalEstado, setModalEstado] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [modalDevolver, setModalDevolver] = useState(false);
  const [codigoCliente, setCodigoCliente] = useState(null);
  const [idOrden, setIdOrden] = useState(null);
  const [dataInfanciaExterna, setDataInfanciaExterna] = useState({});

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
          setTotalOrdenes(data);
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
    setLoadingDetalle(true);
    await getOrdenes( true, { metodo: ordenes.BUSCAR_REGISTROS, id: id_orden })
      .then(({data}) => {
        if (data && data.length > 0) {
          setDataRegistros(data);
        }
      }).catch((err) => console.log(err)).finally(() => setLoadingDetalle(false));
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
      orden_imagen.append('ordenes', ordenesSeleccionadas);
      orden_imagen.append('estado', estado);
      orden_imagen.append('observacion', observacion);
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

  async function devolverOrden(observacion, files=[]) {
    if (idOrden) {
      let orden_imagen = new FormData();
      orden_imagen.append('metodo', ordenes.DEVOLVER_ORDEN);
      orden_imagen.append('id', idOrden);
      orden_imagen.append('observacion', observacion);
      files.forEach((f) => {
        orden_imagen.append('files', f);
      });

      setLoadingDevolver(true);
      await patchFilesOrdenes(orden_imagen)
        .then(async() => await listarOrdenes())
        .catch((err) => console.log(err))
        .finally(() => setLoadingDevolver(false));
    }
  };

  function buscarRequerimiento(e) {
    if (e && e.length > 1) {
      setDataOrdenes(totalOrdenes.filter((o) => String(o.codigo_requerimiento).includes(e)))
    } else {
      setDataOrdenes(totalOrdenes);
    }
  }

  function exportarExcel() {
    if (dataOrdenes && dataOrdenes.length > 0) {
      return saveAsCsv({ 
        data: dataOrdenes.map((o) => {
          return ({
            ...o,
            fecha_cita: o.fecha_cita ? moment(o.fecha_cita).format('DD/MM/YY') : '-',
            fecha_registro: o.fecha_registro ? moment(o.fecha_registro).format('DD/MM/YY HH:mm') : '-',
            tecnico: o.tecnico && o.tecnico.nombre ? o.tecnico.nombre + ' ' + o.tecnico.apellidos : '-',
            gestor: o.gestor ? o.gestor.nombre + ' ' + o.gestor.apellidos : '-',
            auditor: o.tecnico && o.tecnico.auditor ? o.tecnico.auditor.nombre + ' ' + o.tecnico.auditor.apellidos : '-',
            contrata: o.contrata ? o.contrata.nombre : '-'
          })
        }), 
        fields: valoresExcelAdministrar, 
        filename: `data_${tipo}_${moment().format('DD_MM_YY_HH_mm')}`
      })
    }
  };

  const abrirModalAgendar = () => setModalAgendar(!modalAgendar);
  const abrirModalAsignar = () => setModalAsignar(!modalAsignar);
  const abrirModalReiterada = () => setModalReiterada(!modalReiterada);
  const abrirModalInfancia = () => setModalInfancia(!modalInfancia);
  const abrirModalInfanciaExterna = () => setModalInfanciaExterna(!modalInfanciaExterna);
  const abrirModalEstado = () => setModalEstado(!modalEstado);
  const abrirModalDetalle = () => setModalDetalle(!modalDetalle);
  const abrirModalDevolver = () => setModalDevolver(!modalDevolver);
 
  const abrirReiterada = (c) => {
    setCodigoCliente(c);
    abrirModalReiterada();
  };

  const abrirInfancia = async (id) => {
    abrirModalInfancia();
    await buscarInfancia(id);
  };

  const abrirInfanciaExterna = async (infancia) => {
    abrirModalInfanciaExterna();
    setDataInfanciaExterna(infancia);
  };

  const abrirDetalle = async (id) => {
    abrirModalDetalle();
    await buscarRegistro(id);
  };

  const abrirDevolver = (id) => {
    setIdOrden(id);
    abrirModalDevolver();
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
        <Button
          icon={loadingCruzar ? <LoadingOutlined spin/>:<CloudSyncOutlined />}
          style={{ marginBottom: '1rem', marginRight: '.5rem' }}
          onClick={sincronizarData}
        >Sincronizar</Button>
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
        <Search 
          placeholder="Requerimiento..." 
          onSearch={buscarRequerimiento} 
          style={{ width: 180, marginRight: '.5rem' }} 
          allowClear 
        />
        <Button 
          icon={<ExportOutlined/>}
          style={{ marginBottom: '1rem', marginRight: '.5rem' }}
          disabled={!dataOrdenes || dataOrdenes.length === 0}
          onClick={exportarExcel}
        >Exportar</Button>
      </div>
      <TablaOrdenes 
        tipo={tipo}
        data={dataOrdenes} 
        loading={loadingOrdenes} 
        ordenesSeleccionadas={ordenesSeleccionadas} 
        setOrdenesSeleccionadas={setOrdenesSeleccionadas}
        abrirReiterada={abrirReiterada}
        abrirInfancia={abrirInfancia}
        abrirInfanciaExterna={abrirInfanciaExterna}
        abrirDetalle={abrirDetalle}
        abrirDevolver={abrirDevolver}
      />
      {/* MODAL PARA AGENDAR LA ORDEN */}
      <ModalAgendar visible={modalAgendar} abrir={abrirModalAgendar} buckets={listaBuckets} contratas={contratas} gestores={gestores} agendar={agendarOrdenes}/>
      {/* MODAL PARA ASIGNAR CONTRATA, GESTOR O TECNICO */}
      <ModalAsignar visible={modalAsignar} abrir={abrirModalAsignar} gestores={gestores} tecnicos={tecnicos} asignar={asignarOrdenes}/>
      {/* MODAL PARA ACTUALIZAR EL ESTADO_GESTOR DE LA ORDEN */}
      <ModalEstado visible={modalEstado} abrir={abrirModalEstado} actualizarEstado={actualizarEstado} />
      {/* MODAL PARA BUSCAR LA REITERADA */}
      <ModalReiterada visible={modalReiterada} abrir={abrirModalReiterada} codigo_cliente={codigoCliente}/>
      {/* MODAL PARA BUSCAR LA INFANCIA */}
      <ModalInfancia visible={modalInfancia} abrir={abrirModalInfancia} loading={loadingInfancia} orden={dataInfancia} />
      {/* MODAL PARA MOSTRAR LA INFANCIA eXTERNA */}
      <ModalInfanciaExterna visible={modalInfanciaExterna} abrir={abrirModalInfanciaExterna} orden={dataInfanciaExterna} />
      {/* MODAL DETALLE PARA VER EL HISTORIAL DE CAMBIOS */}
      <ModalDetalle visible={modalDetalle} abrir={abrirModalDetalle} loading={loadingDetalle} registros={dataRegistros}/>
      {/* MODAL PARA DEVOLVER LA ORDEN */}
      <ModalDevolver visible={modalDevolver} abrir={abrirModalDevolver} loading={loadingDevolver} devolverOrden={devolverOrden} />
    </div>
  )
}

ListarOrdenes.propTypes = {
  contratas: PropTypes.array,
  gestores: PropTypes.array,
  tecnicos: PropTypes.array,
  tipo: PropTypes.string
}

export default ListarOrdenes

