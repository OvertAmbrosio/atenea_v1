import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { CloudSyncOutlined, EditOutlined, LoadingOutlined, ReloadOutlined, UserSwitchOutlined, ExportOutlined } from '@ant-design/icons';
import { useJsonToCsv } from 'react-json-csv';
import moment from 'moment'

import TablaOrdenes from './TablaOrdenes';
import { getOrdenes } from '../../../services/apiOrden';
import { ordenes } from '../../../constants/metodos';
import ModalBucket from './ModalBucket';
import { obtenerFiltroNombre } from '../../../libraries/obtenerFiltro';
import { valoresExcelAdministrar } from "../../../constants/valoresOrdenes";

function ListarOrdenes({ gestores, contratas, tipo }) {
  const [dataOrdenes, setDataOrdenes] = useState([]);
  const [buckets, setBuckets] = useState([]);
  const { saveAsCsv } = useJsonToCsv();
  const [ordenesSeleccionadas, setOrdenesSeleccionadas] = useState([]);
  const [loadingOrdenes, setLoadingOrdenes] = useState(false);
  const [loadingCruzar, setLoadingCruzar] = useState(false);
  const [loadingBucket, setLoadingBucket] = useState(false);
  const [loadingAsignar, setLoadingAsignar] = useState(false);
  const [modalBucket, setModalBucket] = useState(false);
  const [modalAsignar, setModalAsignar] = useState(false);

  useEffect(() => {
    listarOrdenes();
  // eslint-disable-next-line
  },[]);

  async function listarOrdenes() {
    setLoadingOrdenes(true);
    await getOrdenes(true, { metodo: ordenes.ORDENES_HOY, tipo })
      .then(({data}) => {
        if (data && data.length > 0) {
          setDataOrdenes(data)
          obtenerFiltroNombre(data, 'bucket').then((f) => setBuckets(f));
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

  function exportarExcel() {
    if (dataOrdenes && dataOrdenes.length > 0) {
      return saveAsCsv({ 
        data: dataOrdenes.map((o) => {
          return ({
            ...o,
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

  const abrirModalBucket = () => setModalBucket(!modalBucket);
  const abrirModalAsignar = () => setModalAsignar(!modalAsignar);

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
          icon={loadingBucket ? <LoadingOutlined spin/>:<EditOutlined/>}
          style={{ marginBottom: '1rem', marginRight: '.5rem' }}
          disabled={ordenesSeleccionadas.length === 0}
          onClick={abrirModalBucket}
        >Editar Bucket</Button>
        <Button 
          icon={loadingAsignar ? <LoadingOutlined spin/>:<UserSwitchOutlined/>}
          style={{ marginBottom: '1rem', marginRight: '.5rem' }}
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
      />
      {/* MODAL PARA EDITAR EL BUCKET */}
      <ModalBucket visible={modalBucket} abrir={abrirModalBucket} buckets={buckets}/>
      {/* MODAL PARA ASIGNAR CONTRATA, GESTOR O TECNICO */}

    </div>
  )
}

ListarOrdenes.propTypes = {
  gestores: PropTypes.array,
  contratas: PropTypes.array
}

export default ListarOrdenes

