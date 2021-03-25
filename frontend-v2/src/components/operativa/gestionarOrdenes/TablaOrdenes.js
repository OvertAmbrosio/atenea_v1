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
import metodos from '../../../constants/metodos';

function TablaOrdenes({ asignadas=false, data, loading, ordenesSeleccionadas, setOrdenesSeleccionadas, abrirReiterada, abrirInfancia, abrirRegistro, listarOrdenes }) {
  const [columnasUsuario, setColumnasUsuario] = useState([]);
  const [filtros, setFiltros] = useState({
    filtroTipo:[],
    filtroDistrito:[],
    filtroBucket:[],
    filtroEstadoToa:[],
    filtroEstadoGestor:[],
    filtroContrata:[], 
    filtroTecnico:[],
    filtroTecnicoAsignado:[],
    filtroTipoRequerimiento:[],
    filtroTipoTecnologia:[],
    filtroCtr:[],
    filtroNodo:[],
    filtroTroba:[],
    filtroTimeSlot:[],
  })
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
    return await getEmpleados(true, { metodo: metodos.EMPLEADOS_LISTAR_COLUMNAS } )
      .then(({data}) => {
        if (data && data.columnas) {
          setColumnasUsuario(data.columnas)
        }
      }).catch((err) => console.log(err))
  };

  async function guardarColumnasGestor(keys) {
    setModalColumnas(false);
    return await patchEmpleados(true, { columnas: keys, metodo: metodos.EMPLEADOS_ACTUALIZAR_COLUMNAS })
      .then(() => obtenerColumnasGestor())
  }

  const abrirModalDetalle = () => setModalDetalle(!modalDetalle);
  const abrirModalColumnas = () => setModalColumnas(!modalColumnas);

  const abrirDetalle = (id, tipo) => {
    setIdOrdenDetalle(id);
    setTipo(tipo);
    abrirModalDetalle();
  };

  const establacerFiltros = (data) => {
    if (data && data.length > 0) {
      setFiltros({
        filtroDistrito: obtenerFiltroNombre(data, 'distrito'),
        filtroBucket: obtenerFiltroNombre(data, 'bucket'),
        filtroEstadoToa: obtenerFiltroNombre(data, 'estado_toa'),
        filtroEstadoGestor: obtenerFiltroNombre(data, 'estado_gestor'),
        filtroTipoRequerimiento: obtenerFiltroNombre(data, 'tipo_requerimiento'),
        filtroTipoTecnologia: obtenerFiltroNombre(data, 'tipo_tecnologia'),
        filtroCtr: obtenerFiltroNombre(data, 'codigo_ctr'),
        filtroNodo: obtenerFiltroNombre(data, 'codigo_nodo'),
        filtroTroba: obtenerFiltroNombre(data, 'codigo_troba'),
        filtroTimeSlot: obtenerFiltroNombre(data, 'tipo_agenda'),
        filtroContrata: obtenerFiltroId(data, 'contrata'),
        filtroTecnico: obtenerFiltroId(data, 'tecnico', true),
        filtroTecnicoAsignado: obtenerFiltroId(data, 'tecnico_liteyca', true),
        filtroTipo: obtenerFiltroNombre(data, 'tipo'),
      });
    };
  };

  const generarColumnas = () => {
    if (!asignadas) {
      return columnasSinBandejaGestor(
        // filtroDistrito,
        // filtroTipo,
        // filtroBucket,
        // filtroEstadoToa,
        // filtroEstadoGestor,
        // filtroContrata, 
        // filtroTecnico,
        // filtroTecnicoAsignado,
        // filtroTipoRequerimiento,
        // filtroTipoTecnologia,
        // filtroCtr,
        // filtroNodo,
        // filtroTroba,
        // filtroTimeSlot,
        abrirReiterada,
        abrirInfancia,
        abrirRegistro,
        listarOrdenes
      )
    } else {
      return generarColumnasGestor(columnasUsuario, {
        filtros,
        // filtroDistrito,
        // filtroTipo,
        // filtroBucket,
        // filtroEstadoToa,
        // filtroEstadoGestor,
        // filtroContrata, 
        // filtroTecnico,
        // filtroTecnicoAsignado,
        // filtroTipoRequerimiento,
        // filtroTipoTecnologia,
        // filtroCtr,
        // filtroNodo,
        // filtroTimeSlot,
        // filtroTroba,
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
        rowKey="codigo_requerimiento"
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
        columnasBase={columnasPendientesGestor(filtros)}
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

