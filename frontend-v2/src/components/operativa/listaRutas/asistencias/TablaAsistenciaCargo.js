import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Select, DatePicker, Button, Table } from 'antd';
import moment from 'moment';
import cogoToast from 'cogo-toast';

import { getCargos } from '../../../../services/apiCargos';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { getAsistencias, patchAsistencia } from '../../../../services/apiAsistencia';
import ordenarAsistencias from '../../../../libraries/ordenarAsistencias';
import { obtenerFiltroId } from '../../../../libraries/obtenerFiltro';
import metodos from '../../../../constants/metodos';
import generarColumnas from './generarColumnas';
import ModalEditarAsistencia from './ModalEditarAsistencia';
import ModalRegistroAsistencia from './ModalRegistroAsistencia';
import ExcelAsistencia from '../../../excelExports/ExcelAsistencia';
import { niveles } from '../../../../constants/cargos';

const { Option } = Select;
const { RangePicker } = DatePicker;

function TablaAsistenciaCargo({gestor=false}) {
  const [dataAsistencias, setDataAsistencias] = useState([]);
  const [listaCargos, setListaCargos] = useState([]);
  const [loadingAsistencia, setLoadingAsistencia] = useState(false);
  const [loadingCargos, setLoadingCargos] = useState(false);
  const [loadingActualizar, setLoadingActualizar] = useState(false);
  const [cargoSeleccionado, setCargoSeleccionado] = useState(null);
  const [diaInicio, setDiaInicio] = useState(moment().startOf('week'));
  const [diaFin, setDiaFin] = useState(moment().endOf('week'));
  const [listaDias, setListaDias] = useState([]);
  const [columnas, setColumnas] = useState(null);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalRegistro, setModalRegistro] = useState(false);
  const [idAsistencia, setIdAsistencia] = useState(null);
  const [registro, setRegistro] = useState([]);
  const [fechaRegistro, setFechaRegistro] = useState(null);
  const [filtroGestores, setFiltroGestores] = useState([]);
  const [filtroAuditores, setFiltroAuditores] = useState([]);
  const [filtroContratas, setFiltroContratas] = useState([]);

  useEffect(() => {
    if (gestor) {
      listarAsistencias();
    }
    cambiarRango([moment().startOf('week'), moment().endOf('week')])
    cargarCargos();
  //eslint-disable-next-line
  },[]);

  useEffect(() => {
    if (cargoSeleccionado && listaCargos.length > 0) {
      setColumnas(generarColumnas({
        nivel: listaCargos[cargoSeleccionado].nivel, 
        dias: listaDias,
        editar: editarAsistencia,
        registro: listarRegistro,
        listar: listarAsistencias,
        filtros: { filtroGestores, filtroAuditores, filtroContratas }
      }));
    }
  //eslint-disable-next-line
  },[listaDias, cargoSeleccionado]);

  useEffect(() => {
    if (gestor) {
      setColumnas(generarColumnas({
        nivel: niveles.OPERATIVO, 
        dias: listaDias,
        gestor,
        editar: editarAsistencia,
        registro: listarRegistro,
        listar: listarAsistencias,
        filtros: { filtroGestores, filtroAuditores, filtroContratas }
      }));
    }
  //eslint-disable-next-line
  },[dataAsistencias])

  async function cargarCargos() {
    setLoadingCargos(true);
    await getCargos(true)
      .then(({data}) => setListaCargos(data))
      .catch((err) => console.log(err))
      .finally(() => setLoadingCargos(false));
  };

  async function listarAsistencias() {
    if (diaInicio && diaFin && listaCargos.length > 0) {
      setLoadingAsistencia(true);
      await getAsistencias({
        cargo: !gestor ? listaCargos[cargoSeleccionado]._id : null,
        fechaInicio: diaInicio.toDate(),
        fechaFin: diaFin.toDate()
      }).then(async({data}) => ordenarAsistencias(
          !gestor ? listaCargos[cargoSeleccionado].nivel : niveles.OPERATIVO, 
          data
      )).then((resultado) => {
        if (resultado && resultado.length > 0) {
          setDataAsistencias(resultado);
          setFiltroGestores(obtenerFiltroId(resultado, 'gestor', true));
          setFiltroAuditores(obtenerFiltroId(resultado, 'auditor', true));
          setFiltroContratas(obtenerFiltroId(resultado, 'contrata', true));
          // setRutasAverias(rutasAtivas(resultado.filter((e) => e.estado_empresa === estadoEmpleado.ACTIVO && e.tipo_negocio === 'averias' && ['hfc','gpon'].includes(e.sub_tipo_negocio))));
          // setRutasAltas(rutasAtivas(resultado.filter((e) => e.estado_empresa === estadoEmpleado.ACTIVO && e.tipo_negocio === 'altas' && ['hfc','gpon'].includes(e.sub_tipo_negocio))));
          // setRutasGpon(rutasAtivas(resultado.filter((e) => e.estado_empresa === estadoEmpleado.ACTIVO && e.sub_tipo_negocio === 'gpon' && e.tipo_negocio === 'altas')))
        } else {
          setDataAsistencias([]);
          cogoToast.warn('No se encontraron registros.', { position: 'top-right' });
        }
      }).catch((err) => console.log(err)).finally(() => setLoadingAsistencia(false));
    } else {
      cogoToast.warn('Debes seleccionar un rango de fechas primero.', { position: 'top-right' });
    }
  };
  
  async function actualizarAsistencia(estado, observacion) {
    setLoadingActualizar(true);
    return await patchAsistencia({
      metodo: metodos.ASISTENCIA_ACTUALIZAR, 
      asistencia: {
        _id: idAsistencia, 
        estado, observacion,
      }
    }).catch((err) => console.log(err))
      .finally(() => {
        setLoadingActualizar(false);
        setModalEditar(false);
        listarAsistencias();
      });
  };

  function listarRegistro(obj, dia) {
    if (obj && obj.length > 0 ) {
      setRegistro(obj);
      setFechaRegistro(dia);
      abrirModalRegistro();
    } else {
      cogoToast.warn("No se encontraron registros en la fecha seleccionada.", { position: "top-right" })
    };
  };

  const editarAsistencia = (id) => {
    abrirModalEditar();
    setIdAsistencia(id);
  };

  const abrirModalEditar = () => setModalEditar(!modalEditar);
  const abrirModalRegistro = () => setModalRegistro(!modalRegistro);

  const cambiarRango = (dias) => {
    if (dias && dias.length > 1) {
      const diff = moment(dias[1].toDate()).diff(dias[0].toDate(), 'days');
      setDiaInicio(dias[0]);
      setDiaFin(dias[1])
      let days = [];
      for (let i = 0; i <= diff; i++) {
        days.push(moment(dias[0].toDate()).add(i, 'days').format("DD-MM"));
      };
      setListaDias(days);
    } else {
      setDiaInicio(moment().startOf('week'));
      setDiaFin(moment().endOf('week'));
    }
  };

  return (
    <div>
      <Row style={{ margin: ".8rem 0" }}>
      {
        !gestor ? 
        <Col sm={12} style={{ paddingRight: "1.5rem" }}>
          <h4>Seleccionar Cargo:</h4>
          <Select
            size="small"
            placeholder="Seleccionar Cargo"
            loading={loadingCargos}
            style={{ width: "100%" }}
            value={cargoSeleccionado}
            onChange={(e) => setCargoSeleccionado(e)}
            defaultActiveFirstOption
          >
          {
            listaCargos && listaCargos.length > 0 ? 
            listaCargos.map((e,i) => (
              <Option key={i} value={i}>{e.nombre}</Option>
            )):null
          }
          </Select>
        </Col> : null
      }
        
        <Col sm={12}>
          <h4>Seleccionar rango de Fechas:</h4>
          <RangePicker
            size="small"
            style={{ marginRight: '.5rem' }}
            onChange={cambiarRango}
            value={[moment(diaInicio), moment(diaFin)]}
          />
        </Col>
      </Row>
      <Button 
        type="primary"
        size="small"
        disabled={loadingAsistencia}
        icon={loadingAsistencia ? <LoadingOutlined/> : <SearchOutlined/>}
        style={{ marginBottom: "1rem" }}
        onClick={listarAsistencias}
      >
        Buscar
      </Button>
      <Table
        rowKey="_id"
        size="small"
        loading={loadingAsistencia}
        columns={columnas}
        dataSource={dataAsistencias}
        scroll={{ y: "75vh", x: "75vw" }}
        pagination={{
          defaultPageSize: 50,
          pageSizeOptions: [50,100,200]
        }}
        footer={() => <ExcelAsistencia 
          nivel={cargoSeleccionado && listaCargos.length > 0 ? listaCargos[cargoSeleccionado].nivel: niveles.OPERATIVO} 
          data={dataAsistencias} 
          dias={listaDias} 
          cargo={cargoSeleccionado && listaCargos.length > 0 ? listaCargos[cargoSeleccionado].nombre: null}
        />}
      />
      {/* MODAL PARA EDITAR LA ASISTENCIA */}
      <ModalEditarAsistencia 
        visible={modalEditar} 
        abrir={abrirModalEditar} 
        loadingActualizar={loadingActualizar} 
        actualizar={actualizarAsistencia} 
      />
      {/* MODAL DEL REGISTRO DE LA ASISTENCIA */}
      <ModalRegistroAsistencia
        fecha={fechaRegistro}
        registro={registro}
        visible={modalRegistro}
        abrir={abrirModalRegistro}
      />
    </div>
  )
};

TablaAsistenciaCargo.propTypes = {
  gestor: PropTypes.bool
};

export default TablaAsistenciaCargo;

