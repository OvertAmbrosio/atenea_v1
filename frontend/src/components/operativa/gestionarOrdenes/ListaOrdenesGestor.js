import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'antd';
import { ScheduleOutlined, LoadingOutlined, ReloadOutlined, ExportOutlined, FileSyncOutlined } from '@ant-design/icons';
import { useJsonToCsv } from 'react-json-csv';
import moment from 'moment'

import { listaBuckets, valoresExcelPendientes } from '../../../constants/valoresOrdenes';
import TablaOrdenes from '../../../components/operativa/gestionarOrdenes/TablaOrdenes';
import ModalDetalle from '../../../components/operativa/administrarOrdenes/ModalDetalle';
import ModalInfancia from '../../../components/operativa/administrarOrdenes/ModalInfancia';
import ModalReiterada from '../../../components/operativa/administrarOrdenes/ModalReiterada';
import ModalEstado from '../../../components/operativa/administrarOrdenes/ModalEstado';
import ModalAgendarTecnico from '../../../components/operativa/gestionarOrdenes/ModalAgendarTecnico';
import { getOrdenes, patchFilesOrdenes, patchOrdenes } from '../../../services/apiOrden';
import { ordenes as ordenesMetodo } from '../../../constants/metodos';

const { Search } = Input;

function ListaOrdenesGestor({ordenes=[], loadingOrdenes, tecnicos=[], loadingTecnicos, listarOrdenes}) {
  const [dataOrdenes, setDataOrdenes] = useState([]);
  const [dataRegistros, setDataRegistros] = useState([]);
  const [dataInfancia, setDataInfancia] = useState([]);
  const { saveAsCsv } = useJsonToCsv();
  const [ordenesSeleccionadas, setOrdenesSeleccionadas] = useState([]);
  const [loadingAgendar, setLoadingAgendar] = useState(false);
  const [loadingEstado, setLoadingEstado] = useState(false);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [loadingInfancia, setLoadingInfancia] = useState(false);
  const [modalAgendar, setModalAgendar] = useState(false);
  const [modalReiterada, setModalReiterada] = useState(false);
  const [modalInfancia, setModalInfancia] = useState(false);
  const [modalEstado, setModalEstado] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [codigoCliente, setCodigoCliente] = useState(null);

  useEffect(() => {
    if (ordenes.length>0) {
      setDataOrdenes(ordenes);
    }
  // eslint-disable-next-line
  },[ordenes]);

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
    await getOrdenes( true, { metodo: ordenesMetodo.BUSCAR_REGISTROS, id: id_orden })
      .then(({data}) => {
        if (data && data.length > 0) {
          setDataRegistros(data);
        }
      }).catch((err) => console.log(err)).finally(() => setLoadingDetalle(false));
  };

  async function agendarOrdenes(bucketSeleccionado, contrataSeleccionada, tecnicoSeleccionado, fechaCita, observacion) {
    if (ordenesSeleccionadas && ordenesSeleccionadas.length > 0) {
      setLoadingAgendar(true);
      await patchOrdenes({
        metodo: ordenesMetodo.AGENDAR_ORDEN_GESTOR, 
        ordenes: ordenesSeleccionadas,
        bucket: bucketSeleccionado, 
        contrata: contrataSeleccionada, 
        tecnico: tecnicoSeleccionado,
        fecha_cita: fechaCita,
        observacion
      }).then(async() => await listarOrdenes()).catch((err) => console.log(err)).finally(() => setLoadingAgendar(false));
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

  function buscarRequerimiento(e) {
    if (e && e.length > 1) {
      setDataOrdenes(ordenes.filter((o) => String(o.codigo_requerimiento).includes(e)))
    } else {
      setDataOrdenes(ordenes);
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
        fields: valoresExcelPendientes, 
        filename: `data_ordenes_${moment().format('DD_MM_YY_HH_mm')}`
      })
    }
  };

  const abrirModalAgendar = () => setModalAgendar(!modalAgendar);
  const abrirModalReiterada = () => setModalReiterada(!modalReiterada);
  const abrirModalInfancia = () => setModalInfancia(!modalInfancia);
  const abrirModalEstado = () => setModalEstado(!modalEstado);
  const abrirModalDetalle = () => setModalDetalle(!modalDetalle);
 
  const abrirReiterada = (c) => {
    setCodigoCliente(c);
    abrirModalReiterada();
  };

  const abrirInfancia = async (id) => {
    abrirModalInfancia();
    await buscarInfancia(id);
  };

  const abrirDetalle = async (id) => {
    abrirModalDetalle();
    await buscarRegistro(id);
  };

  return (
    <div style={{ marginBottom: '.5rem', marginTop: '1rem' }}>
      <div>
        <Button 
          type="primary"
          icon={loadingOrdenes ? <LoadingOutlined spin/>:<ReloadOutlined/>}
          style={{ marginBottom: '1rem', marginRight: '.5rem' }}
          onClick={listarOrdenes}
        >Actualizar</Button>
        <Button 
          icon={loadingAgendar ? <LoadingOutlined spin/>:<ScheduleOutlined />}
          style={{ marginBottom: '1rem', marginRight: '.5rem' }}
          disabled={ordenesSeleccionadas.length === 0}
          onClick={abrirModalAgendar}
        >Agendar</Button>
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
        data={dataOrdenes} 
        loading={loadingOrdenes} 
        ordenesSeleccionadas={ordenesSeleccionadas} 
        setOrdenesSeleccionadas={setOrdenesSeleccionadas}
        abrirReiterada={abrirReiterada}
        abrirInfancia={abrirInfancia}
        abrirDetalle={abrirDetalle}
      />
      {/* MODAL PARA AGENDAR LA ORDEN */}
      <ModalAgendarTecnico visible={modalAgendar} abrir={abrirModalAgendar} buckets={listaBuckets} tecnicos={tecnicos} agendar={agendarOrdenes}/>
      {/* MODAL PARA ACTUALIZAR EL ESTADO_GESTOR DE LA ORDEN */}
      <ModalEstado visible={modalEstado} abrir={abrirModalEstado} actualizarEstado={actualizarEstado} />
      {/* MODAL PARA BUSCAR LA REITERADA */}
      <ModalReiterada visible={modalReiterada} abrir={abrirModalReiterada} codigo_cliente={codigoCliente}/>
      {/* MODAL PARA BUSCAR LA INFANCIA */}
      <ModalInfancia visible={modalInfancia} abrir={abrirModalInfancia} loading={loadingInfancia} orden={dataInfancia} />
      {/* MODAL DETALLE PARA VER EL HISTORIAL DE CAMBIOS */}
      <ModalDetalle visible={modalDetalle} abrir={abrirModalDetalle} loading={loadingDetalle} registros={dataRegistros}/>
    </div>
  )
};

ListaOrdenesGestor.propTypes = {
  ordenes: PropTypes.array,
  loadingOrdenes: PropTypes.bool,
  tecnicos: PropTypes.array,
  loadingTecnicos: PropTypes.bool,
  listarOrdenes: PropTypes.func
};

export default ListaOrdenesGestor;
