import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { CloudSyncOutlined, ScheduleOutlined, LoadingOutlined, ReloadOutlined, UserSwitchOutlined, ExportOutlined } from '@ant-design/icons';
import { useJsonToCsv } from 'react-json-csv';
import moment from 'moment'

import TablaOrdenes from './TablaOrdenes';
import { getOrdenes, patchOrdenes } from '../../../services/apiOrden';
import { ordenes } from '../../../constants/metodos';
import ModalAgendar from './ModalAgendar';
import { listaBuckets, valoresExcelAdministrar } from "../../../constants/valoresOrdenes";
import ModalReiterada from './ModalReiterada';
import ModalAsignar from './ModalAsignar';

function ListarOrdenes({ contratas, gestores, tecnicos, tipo }) {
  const [dataOrdenes, setDataOrdenes] = useState([]);
  const { saveAsCsv } = useJsonToCsv();
  const [ordenesSeleccionadas, setOrdenesSeleccionadas] = useState([]);
  const [loadingOrdenes, setLoadingOrdenes] = useState(false);
  const [loadingCruzar, setLoadingCruzar] = useState(false);
  const [loadingAgendar, setLoadingAgendar] = useState(false);
  const [loadingAsignar, setLoadingAsignar] = useState(false);
  const [modalAgendar, setModalAgendar] = useState(false);
  const [modalAsignar, setModalAsignar] = useState(false);
  const [modalReiterada, setModalReiterada] = useState(false);
  const [codigoCliente, setCodigoCliente] = useState(null);

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

  const abrirReiterada = (c) => {
    setCodigoCliente(c);
    abrirModalReiterada();
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
      />
      {/* MODAL PARA AGENDAR LA ORDEN */}
      <ModalAgendar visible={modalAgendar} abrir={abrirModalAgendar} buckets={listaBuckets} contratas={contratas} gestores={gestores} agendar={agendarOrdenes}/>
      {/* MODAL PARA ASIGNAR CONTRATA, GESTOR O TECNICO */}
      <ModalAsignar visible={modalAsignar} abrir={abrirModalAsignar} gestores={gestores} tecnicos={tecnicos} asignar={asignarOrdenes}/>
      {/* MODAL PARA BUSCAR LA REITERADA */}
      <ModalReiterada abrir={abrirModalReiterada} visible={modalReiterada} codigo_cliente={codigoCliente}/>
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

