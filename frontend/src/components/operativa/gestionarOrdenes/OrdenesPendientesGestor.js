import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, Input } from 'antd';
import { ScheduleOutlined, LoadingOutlined, ReloadOutlined, ExportOutlined, FileSyncOutlined, UserSwitchOutlined } from '@ant-design/icons';

import { listaBuckets } from '../../../constants/valoresOrdenes';
import TablaOrdenes from './TablaOrdenes';
import ModalRegistro from '../administrarOrdenes/ModalsTabla/ModalRegistro';
import ModalInfancia from '../administrarOrdenes/ModalsTabla/ModalInfancia';
import ModalReiterada from '../administrarOrdenes/ModalsTabla/ModalReiterada';
import ModalEstado from '../administrarOrdenes/ModalsTabla/ModalEstado';
import ModalAgendarTecnico from './ModalAgendarTecnico';
import { getOrdenes, patchFilesOrdenes, patchOrdenes } from '../../../services/apiOrden';
import { ordenes, ordenes as ordenesMetodo } from '../../../constants/metodos';
import ModalAsignar from '../administrarOrdenes/ModalsTabla/ModalAsignar';
import ExcelOrdenesPendientes from '../../excelExports/ExcelOrdenesPendientes';
import cogoToast from 'cogo-toast';

const { Search } = Input;

function OrdenesPendientesGestor({gestores=[], tecnicos=[]}) {
  const [listaOrdenes, setListaOrdenes] = useState([]);
  const [dataOrdenes, setDataOrdenes] = useState([]);
  const [loadingOrdenes, setLoadingOrdenes] = useState(false);
  const [dataRegistros, setDataRegistros] = useState([]);
  const [dataInfancia, setDataInfancia] = useState([]);
  const [ordenesSeleccionadas, setOrdenesSeleccionadas] = useState([]);
  const [loadingAgendar, setLoadingAgendar] = useState(false);
  const [loadingEstado, setLoadingEstado] = useState(false);
  const [loadingRegistro, setLoadingRegistro] = useState(false);
  const [loadingAsignar, setLoadingAsignar] = useState(false);
  const [loadingExportar, setLoadingExportar] = useState(false);
  const [modalAgendar, setModalAgendar] = useState(false);
  const [modalReiterada, setModalReiterada] = useState(false);
  const [modalInfancia, setModalInfancia] = useState(false);
  const [modalEstado, setModalEstado] = useState(false);
  const [modalRegistro, setModalRegistro] = useState(false);
  const [modalAsignar, setModalAsignar] = useState(false);
  const [codigoCliente, setCodigoCliente] = useState(null);

  useEffect(() => {
    listarOrdenes()
  }, []);

  useEffect(() => {
    if (listaOrdenes.length>0) {
      setDataOrdenes(listaOrdenes);
    }
  // eslint-disable-next-line
  },[listaOrdenes]);

  async function listarOrdenes() {
    setLoadingOrdenes(true);
    setOrdenesSeleccionadas([]);
    return await getOrdenes(true, { metodo: ordenesMetodo.ORDENES_HOY_GESTOR, todo: true })
      .then(({data}) => {
        if(data) setListaOrdenes(data);
      }).catch((err) => console.log(err)).finally(() => setLoadingOrdenes(false));
  };

  async function buscarInfancia(infancia) {
    setDataInfancia([infancia]);
  };

  async function buscarRegistro(id_orden) {
    setLoadingRegistro(true);
    await getOrdenes( true, { metodo: ordenesMetodo.BUSCAR_REGISTROS, id: id_orden })
      .then(({data}) => {
        if (data && data.length > 0) {
          setDataRegistros(data);
        }
      }).catch((err) => console.log(err)).finally(() => setLoadingRegistro(false));
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
      orden_imagen.append('metodo', ordenesMetodo.ACTUALIZAR_ESTADO);
      orden_imagen.append('ordenes', JSON.stringify(ordenesSeleccionadas));
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
      setDataOrdenes(listaOrdenes.filter((o) => String(o.codigo_requerimiento).includes(e)))
    } else {
      setDataOrdenes(listaOrdenes);
    }
  };

  const abrirModalAgendar = () => setModalAgendar(!modalAgendar);
  const abrirModalReiterada = () => setModalReiterada(!modalReiterada);
  const abrirModalInfancia = () => setModalInfancia(!modalInfancia);
  const abrirModalEstado = () => setModalEstado(!modalEstado);
  const abrirModalRegistro = () => setModalRegistro(!modalRegistro);
  const abrirModalAsignar = () => setModalAsignar(!modalAsignar);
 
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

  async function asignarOrdenes(data) {
    if (ordenesSeleccionadas && ordenesSeleccionadas.length > 0) {
      const auxData = data;
      setLoadingAsignar(true);
      abrirModalAsignar();
      await patchOrdenes({
        metodo: ordenes.ASIGNAR_ORDEN, ordenes: ordenesSeleccionadas, ...auxData
      }).then(async() => await listarOrdenes()).catch((err) => console.log(err)).finally(() => setLoadingAsignar(false));
    } else {
      cogoToast.warn('No hay ordenes seleccionadas.', { position: 'top-right' })
    }
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
        <Dropdown
          overlay={<ExcelOrdenesPendientes metodo={ordenes.EXPORTAR_PENDIENTES_GESTOR} tipo="gestor" setLoading={setLoadingExportar} ordenesSeleccionadas={ordenesSeleccionadas}/>} 
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
      </div>
      <TablaOrdenes
        asignadas={true}
        data={dataOrdenes} 
        loading={loadingOrdenes} 
        ordenesSeleccionadas={ordenesSeleccionadas} 
        setOrdenesSeleccionadas={setOrdenesSeleccionadas}
        abrirReiterada={abrirReiterada}
        abrirInfancia={abrirInfancia}
        abrirRegistro={abrirRegistro}
      />
      {/* MODAL PARA ASIGNAR CONTRATA, GESTOR O TECNICO */}
      <ModalAsignar tipo={true} visible={modalAsignar} abrir={abrirModalAsignar} gestores={gestores} tecnicos={tecnicos} asignar={asignarOrdenes}/>
      {/* MODAL PARA AGENDAR LA ORDEN */}
      <ModalAgendarTecnico visible={modalAgendar} abrir={abrirModalAgendar} buckets={listaBuckets} tecnicos={tecnicos} agendar={agendarOrdenes}/>
      {/* MODAL PARA ACTUALIZAR EL ESTADO_GESTOR DE LA ORDEN */}
      <ModalEstado visible={modalEstado} abrir={abrirModalEstado} actualizarEstado={actualizarEstado} />
      {/* MODAL PARA BUSCAR LA REITERADA */}
      <ModalReiterada visible={modalReiterada} abrir={abrirModalReiterada} codigo_cliente={codigoCliente}/>
      {/* MODAL PARA BUSCAR LA INFANCIA */}
      <ModalInfancia visible={modalInfancia} abrir={abrirModalInfancia} loading={false} orden={dataInfancia} />
      {/* MODAL DETALLE PARA VER EL HISTORIAL DE CAMBIOS */}
      <ModalRegistro visible={modalRegistro} abrir={abrirModalRegistro} loading={loadingRegistro} registros={dataRegistros}/>
    </div>
  )
};

OrdenesPendientesGestor.propTypes = {
  gestores: PropTypes.array,
  tecnicos: PropTypes.array,
  loadingTecnicos: PropTypes.bool
};

export default OrdenesPendientesGestor;
