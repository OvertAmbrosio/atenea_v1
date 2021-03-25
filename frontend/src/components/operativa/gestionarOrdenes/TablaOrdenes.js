import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Button, Table } from 'antd';

import { generarColumnasGestor, columnasPendientesGestor } from './columnas/columnasPendientesGestor';
import columnasSinBandejaGestor from './columnas/columnasSinBandejaGestor';
import { obtenerFiltroId, obtenerFiltroNombre } from '../../../libraries/obtenerFiltro';
import ModalDetalleOrden from '../administrarOrdenes/ModalsTabla/ModalDetalleOrden';
import { SettingOutlined } from '@ant-design/icons';
import ModalColumnas from './ModalColumnas';
import { getEmpleados, patchEmpleados } from '../../../services/apiEmpleado';
import { empleados } from '../../../constants/metodos';

function TablaOrdenes({ asignadas=false, data, loading, ordenesSeleccionadas, setOrdenesSeleccionadas, abrirReiterada, abrirInfancia, abrirRegistro, listarOrdenes }) {
  const [columnasUsuario, setColumnasUsuario] = useState([]);
  const [filtroDistrito, setFiltroDistrito] = useState([]);
  const [filtroBucket, setFiltroBucket] = useState([]);
  const [filtroEstadoToa, setFiltroEstadoToa] = useState([]);
  const [filtroEstadoGestor, setFiltroEstadoGestor] = useState([])
  const [filtroContrata, setFiltroContrata] = useState([]);
  const [filtroTecnico, setFiltroTecnico] = useState([]);
  const [filtroTecnicoAsignado, setFiltroTecnicoAsignado] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState([]);
  const [filtroTipoRequerimiento, setFiltroTipoRequerimiento] = useState([]);
  const [filtroTipoTecnologia, setFiltroTipoTecnologia] = useState([]);
  const [filtroCtr, setFiltroCtr] = useState([]);
  const [filtroNodo, setFiltroNodo] = useState([]);
  const [filtroTroba, setFiltroTroba] = useState([]);
  const [filtroTimeSlot, setFiltroTimeSlot] = useState([]);
  const [idOrdenDetalle, setIdOrdenDetalle] = useState(null);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [modalColumnas, setModalColumnas] = useState(false);
  const [tipo, setTipo] = useState(null);

  useEffect(() => {
    obtenerColumnasGestor();
  },[]);

  useEffect(() => {
    if (columnasUsuario && columnasUsuario.length > 0) {
      generarColumnas();
    };
  //eslint-disable-next-line
  },[columnasUsuario]);

  useEffect(() => {
    establacerFiltros(data);
  },[data]);

  async function obtenerColumnasGestor() {
    return await getEmpleados(true, { metodo: empleados.OBTENER_COLUMNAS })
      .then(({data}) => {
        if (data && data.columnas) {
          setColumnasUsuario(data.columnas)
        }
      }).catch((err) => console.log(err))
  };

  async function guardarColumnasGestor(keys) {
    setModalColumnas(false);
    return await patchEmpleados(true, { columnas: keys, metodo: empleados.ACTUALIZAR_COLUMNAS_GESTOR })
      .then(() => obtenerColumnasGestor())
  };

  const abrirModalDetalle = () => setModalDetalle(!modalDetalle);
  const abrirModalColumnas = () => setModalColumnas(!modalColumnas);

  const abrirDetalle = (id, tipo) => {
    setIdOrdenDetalle(id);
    setTipo(tipo);
    abrirModalDetalle();
  };

  const establacerFiltros = (data) => {
    if (data && data.length > 0) {
      setFiltroDistrito(obtenerFiltroNombre(data, 'distrito'));
      setFiltroBucket(obtenerFiltroNombre(data, 'bucket'));
      setFiltroEstadoToa(obtenerFiltroNombre(data, 'estado_toa'));
      setFiltroEstadoGestor(obtenerFiltroNombre(data, 'estado_gestor'));
      setFiltroTipoRequerimiento(obtenerFiltroNombre(data, 'tipo_requerimiento'));
      setFiltroTipoTecnologia(obtenerFiltroNombre(data, 'tipo_tecnologia'));
      setFiltroCtr(obtenerFiltroNombre(data, 'codigo_ctr'));
      setFiltroNodo(obtenerFiltroNombre(data, 'codigo_nodo'));
      setFiltroTroba(obtenerFiltroNombre(data, 'codigo_troba'));
      setFiltroTimeSlot(obtenerFiltroNombre(data, 'tipo_agenda'));
      setFiltroContrata(obtenerFiltroId(data, 'contrata'));
      setFiltroTecnico(obtenerFiltroId(data, 'tecnico'));
      setFiltroTecnicoAsignado(obtenerFiltroId(data, 'tecnico_liteyca'));
      setFiltroTipo(obtenerFiltroNombre(data, 'tipo', true));
    };
  };

  const generarColumnas = () => {
    if (!asignadas) {
      return columnasSinBandejaGestor(
        filtroDistrito,
        filtroTipo,
        filtroBucket,
        filtroEstadoToa,
        filtroEstadoGestor,
        filtroContrata, 
        filtroTecnico,
        filtroTecnicoAsignado,
        filtroTipoRequerimiento,
        filtroTipoTecnologia,
        filtroCtr,
        filtroNodo,
        filtroTroba,
        filtroTimeSlot,
        abrirReiterada,
        abrirInfancia,
        abrirRegistro,
        listarOrdenes
      )
    } else {
      return generarColumnasGestor(columnasUsuario, {
        filtroDistrito,
        filtroTipo,
        filtroBucket,
        filtroEstadoToa,
        filtroEstadoGestor,
        filtroContrata, 
        filtroTecnico,
        filtroTecnicoAsignado,
        filtroTipoRequerimiento,
        filtroTipoTecnologia,
        filtroCtr,
        filtroNodo,
        filtroTimeSlot,
        filtroTroba,
        abrirReiterada,
        abrirInfancia,
        abrirRegistro,
        listarOrdenes
      })
    }
  };

  return (
    <div>
      <Table
        rowKey="_id"
        onRow={(record) => {
          return {
            onDoubleClick: () => abrirDetalle(record._id, record.tipo),
          }
        }}
        rowSelection={{
          columnWidth: 50,
          selectedRowKeys: ordenesSeleccionadas,
          onChange: (e) => setOrdenesSeleccionadas(e)
        }}
        columns={generarColumnas()}
        dataSource={data}
        loading={loading}
        size="small"
        scroll={{ y: '65vh' }}
        pagination={{
          defaultPageSize: 50,
          pageSizeOptions: [50,100,200]
        }}
        footer={() => {
          if (asignadas) {
            return <Button icon={<SettingOutlined/>} onClick={abrirModalColumnas} type="primary">Preferencias</Button>
          } else { return null; }
        }}
      />
      {/* MODAL DETALLE */}
      <ModalDetalleOrden visible={modalDetalle} abrir={abrirModalDetalle} orden={idOrdenDetalle} tipo={tipo}/>
      {/* MODAL PARA CONFIGURAR LAS COLUMNAS */}
      <ModalColumnas 
        visible={modalColumnas} 
        abrir={abrirModalColumnas} 
        columnasBase={columnasPendientesGestor({
          filtroContrata, 
          filtroEstadoGestor, 
          filtroEstadoToa, 
          filtroBucket, 
          filtroDistrito, 
          filtroCtr, 
          filtroNodo,
          filtroTroba,
          filtroTecnico,
          filtroTecnicoAsignado,
          filtroTipoRequerimiento,
          filtroTipoTecnologia
        })}
        columnasUsuario={columnasUsuario}
        guardar={guardarColumnasGestor}
        />
    </div>
  )
};

TablaOrdenes.propTypes = {
  asignadas: PropTypes.bool,
  data: PropTypes.array,
  loading: PropTypes.bool,
  ordenesSeleccionadas: PropTypes.array,
  setOrdenesSeleccionadas: PropTypes.func,
  abrirReiterada: PropTypes.func,
  abrirInfancia: PropTypes.func,
  abrirRegistro: PropTypes.func,
  listarOrdenes: PropTypes.func,
};

export default TablaOrdenes

