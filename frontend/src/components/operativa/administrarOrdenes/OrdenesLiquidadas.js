import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Button, Dropdown, Table, DatePicker } from 'antd';
import { ExportOutlined, LoadingOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import cogoToast from 'cogo-toast';

import { getOrdenes } from '../../../services/apiOrden';
import { ordenes } from '../../../constants/metodos';
import columnasOrdenesLiquidadas from './columnas/columnasLiquidadas';
import { obtenerFiltroId, obtenerFiltroNombre } from '../../../libraries/obtenerFiltro';
import ModalRegistro from './ModalsTabla/ModalRegistro';
import ExcelOrdenesLiquidadas from '../../excelExports/ExcelOrdenesLiquidadas';
import columnasLiquidadasGestor from '../gestionarOrdenes/columnas/columnasLiquidadasGestor';

const { RangePicker } = DatePicker;

function OrdenesLiquidadas({tipo, gestor}) {
  const [dataOrdenes, setDataOrdenes] = useState([]);
  const [dataRegistros, setDataRegistros] = useState([]);
  const [ordenesSeleccionadas, setOrdenesSeleccionadas] = useState([]);
  const [loadingActualizar, setLoadingActualizar] = useState(false)
  const [loadingOrdenes, setLoadingOrdenes] = useState(false);
  const [loadingBuscar, setLoadingBuscar] = useState(false)
  const [loadingExportar, setLoadingExportar] = useState(false);
  const [loadingRegistro, setLoadingRegistro] = useState(false);
  const [filtroDistrito, setFiltroDistrito] = useState([]);
  const [filtroEstadoToa, setFiltroEstadoToa] = useState([]);
  const [filtroEstadoGestor, setFiltroEstadoGestor] = useState([])
  const [filtroContrata, setFiltroContrata] = useState([]);
  const [filtroGestor, setFiltroGestor] = useState([]);
  const [filtroTecnico, setFiltroTecnico] = useState([]);
  const [filtroTecnologia, setFiltroTecnologia] = useState([]);
  const [filtroNodo, setFiltroNodo] = useState([]);
  const [filtroCtr, setFiltroCtr] = useState([]);
  const [filtroTimeSlot, setFiltroTimeSlot] = useState([]);
  const [modalRegistro, setModalRegistro] = useState(false);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  useEffect(() => {
    listarOrdenes();
  // eslint-disable-next-line
  },[]);

  async function listarOrdenes() {
    setLoadingOrdenes(true);
    setLoadingActualizar(true);
    setOrdenesSeleccionadas([]);
    await getOrdenes(true, { metodo: ordenes.ORDENES_LIQUIDADAS, tipo, fechaInicio: null, fechaFin: null })
      .then(({data}) => {
        if (data && data.length > 0) {
          generarFiltros(data);
        } else { limpiarEstados() }
      }).catch((err) => console.log(err)).finally(() => {setLoadingOrdenes(false); setLoadingActualizar(false)});
  };

  async function buscarOrdenes() {
    if (fechaInicio && fechaFin) {
      setLoadingOrdenes(true);
      setLoadingBuscar(true);
      setOrdenesSeleccionadas([]);
      await getOrdenes(true, { metodo: ordenes.ORDENES_LIQUIDADAS, tipo, fechaInicio, fechaFin })
        .then(({data}) => {
          if (data && data.length > 0) {
            generarFiltros(data)
          } else { limpiarEstados() }
        }).catch((err) => console.log(err)).finally(() => {setLoadingOrdenes(false); setLoadingBuscar(false)});
    } else {
      cogoToast.warn('Debes seleccionar un rango de fechas.', { position: 'top-right' });
    };
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

  const seleccionarFechas = (e) => {
    if (e) {
      setFechaInicio(e[0].format('YYYY/MM/DD'));
      setFechaFin(e[1].format('YYYY/MM/DD'));
    } else {
      setFechaInicio(null);
      setFechaFin(null);
    };
  };

  const limpiarEstados = () => {
    setDataOrdenes([]);
    setFiltroDistrito([]);
    setFiltroEstadoToa([]);
    setFiltroEstadoGestor([]);
    setFiltroTecnologia([]);
    setFiltroNodo([]);
    setFiltroContrata([]);
  };

  const generarFiltros = (data) => {
    setDataOrdenes(data);
    setFiltroDistrito(obtenerFiltroNombre(data, 'distrito'));
    setFiltroEstadoToa(obtenerFiltroNombre(data, 'estado_toa'));
    setFiltroEstadoGestor(obtenerFiltroNombre(data, 'estado_gestor'));
    setFiltroTecnologia(obtenerFiltroNombre(data, 'tipo_tecnologia'));
    setFiltroNodo(obtenerFiltroNombre(data, 'codigo_nodo'));
    setFiltroCtr(obtenerFiltroNombre(data, 'codigo_ctr'));
    setFiltroTimeSlot(obtenerFiltroNombre(data, 'tipo_agenda'));
    setFiltroContrata(obtenerFiltroId(data, 'contrata'));
    setFiltroGestor(obtenerFiltroId(data, 'gestor', true));
    setFiltroTecnico(obtenerFiltroId(data, 'tecnico_liquidado'));
  };

  const generarColumnas = () => {
    if (gestor) {
      return columnasLiquidadasGestor(
        filtroDistrito,
        filtroEstadoToa,
        filtroEstadoGestor,
        filtroContrata, 
        filtroTecnologia,
        filtroNodo,
        filtroCtr,
        filtroTecnico,
        filtroTimeSlot,
        abrirRegistro,
        listarOrdenes)
    } else {
      return columnasOrdenesLiquidadas(
        tipo,
        filtroDistrito,
        filtroEstadoToa,
        filtroEstadoGestor,
        filtroContrata, 
        filtroGestor,
        filtroTecnico,
        filtroTecnologia,
        filtroNodo,
        filtroCtr,
        filtroTimeSlot,
        abrirRegistro,
        listarOrdenes)
    };
  };

  return (
    <div>
      <div>
        <Button
          type="primary"
          icon={loadingActualizar ? <LoadingOutlined spin/>:<ReloadOutlined/>}
          disabled={loadingActualizar}
          style={{ marginBottom: '1rem', marginRight: '.5rem' }}
          onClick={listarOrdenes}
        >Actualizar</Button>
        <Dropdown
          overlay={<ExcelOrdenesLiquidadas tipo={gestor ? 'gestor' : tipo} setLoading={setLoadingExportar} ordenesSeleccionadas={ordenesSeleccionadas} fechaInicio={fechaInicio} fechaFin={fechaFin}/>} 
          placement="bottomLeft" 
          trigger={['click']}
          arrow
        >
          <Button
            icon={loadingExportar ? <LoadingOutlined spin/>:<ExportOutlined/>}
            style={{ marginBottom: '1rem', marginRight: '.5rem' }}
            disabled={loadingExportar}
          >
            Exportar
          </Button>
        </Dropdown>
        <RangePicker onChange={seleccionarFechas} style={{ marginBottom: '1rem', marginRight: '.5rem' }} />
        <Button
          type="primary"
          icon={loadingBuscar ? <LoadingOutlined spin/>:<SearchOutlined/>}
          disabled={loadingBuscar}
          onClick={buscarOrdenes}
        >
          Buscar
        </Button>
      </div>
      <Table
        rowKey="_id"
        rowSelection={{
          columnWidth: 50,
          selectedRowKeys: ordenesSeleccionadas,
          onChange: (e) => setOrdenesSeleccionadas(e)
        }}
        columns={generarColumnas()}
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

OrdenesLiquidadas.propTypes = {
  tipo: PropTypes.string,
  gestor: PropTypes.bool
};

export default OrdenesLiquidadas;

