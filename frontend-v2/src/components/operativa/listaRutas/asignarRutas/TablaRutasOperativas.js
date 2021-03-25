import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Select, Table, Button, Row, Col, Radio, Input, Tooltip, Typography } from 'antd';
import { CheckCircleOutlined, ExportOutlined, LoadingOutlined } from '@ant-design/icons';
import { useJsonToCsv } from 'react-json-csv';
import moment from 'moment';
import cogoToast from 'cogo-toast';

import { getEmpleados, patchEmpleados } from '../../../../services/apiEmpleado';
import metodos from '../../../../constants/metodos';
import { obtenerFiltroId } from '../../../../libraries/obtenerFiltro';
import { tipoNegocio, subTipoNegocio } from '../../../../constants/tipoOrden';
import capitalizar from '../../../../libraries/capitalizar';

const { Option } = Select;
const { Search } = Input;
const { Text } = Typography;

const valoresTecnicos = {
  contrata: "Contrata",
  carnet: "Carnet",
  tecnico: "Tecnico",
  gestor: "Gestor",
  auditor: "auditor",
  supervisor: "supervisor",
  tipo_negocio: "Negocio",
  sub_tipo_negocio: "Sub Negocio"
};

function TablaRutasOperativas({gestores=[], loadingGestores, auditores=[], loadingAuditores, supervisores=[], loadingSupervisores}) {
  const [totalTecnicos, setTotalTecnicos] = useState([]);
  const [dataTecnicos, setDataTecnicos] = useState([]);
  const [loadingTecnicos, setLoadingTecnicos] = useState(false);
  const [loadingAsignar, setLoadingAsignar] = useState({
    gestor: false,
    supervisor: false,
    auditor: false,
    negocio: false,
    subNegocio: false
  });
  const [tecnicosSeleccionados, setTecnicosSeleccionados] = useState([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState({
    gestor: null,
    supervisor: null,
    auditor: null,
    negocio: null,
    subNegocio: null
  })
  const [filtroContrata, setFiltroContrata] = useState([]);
  const [filtroGestor, setFiltroGestor] = useState([]);
  const [filtroAuditor, setFiltroAuditor] = useState([]);
  const [filtroSupervisor, setFiltroSupervisor] = useState([]);
  const [tipoBusqueda, setTipoBusqueda] = useState("nombre");
  const [filtros, setFiltros] = useState(null);
  const { saveAsCsv } = useJsonToCsv();

  useEffect(() => {
    cargarEmpleados();
  },[]);

  useEffect(() => {
    if (dataTecnicos && dataTecnicos.length > 0) {
      generarFiltros(dataTecnicos);
    } 
  //eslint-disable-next-line
  },[dataTecnicos]);

  async function cargarEmpleados() {
    setLoadingTecnicos(true);
    await getEmpleados(true, { metodo: metodos.EMPLEADOS_LISTAR_TECNICOS }).then(async({data}) => {
      if (data) {
        setDataTecnicos(data);
        setTotalTecnicos(data);
      } else {
        setDataTecnicos([]);
        setTotalTecnicos([]);
      }
    }).catch((error) => console.log(error)).finally(() => setLoadingTecnicos(false));
  };

  async function asignarTecnico(tipo) {
    if (tecnicosSeleccionados.length < 1) return cogoToast.warn("No hay tecnicos seleccionados", { position: "top-right" });
    const dataSend = {
      metodo: metodos.EMPLEADOS_ACTUALIZAR_RUTA, 
      [tipo]: tipoSeleccionado[tipo],
      tecnicos: tecnicosSeleccionados
    }
    if (tipo === 'gestor' && !tipoSeleccionado[tipo]) return cogoToast.warn(`Debes seleccionar un ${tipo}`, { position: "top-right" });
    if (tipo === 'auditor' && !tipoSeleccionado[tipo]) return cogoToast.warn(`Debes seleccionar un ${tipo}`, { position: "top-right" });
    if (tipo === 'supervisor' && !tipoSeleccionado[tipo]) return cogoToast.warn(`Debes seleccionar un ${tipo}`, { position: "top-right" });
    if (tipo === 'negocio' && !tipoSeleccionado[tipo]) return cogoToast.warn(`Debes seleccionar un ${tipo}`, { position: "top-right" });
    if (tipo === 'subNegocio' && !tipoSeleccionado[tipo]) return cogoToast.warn(`Debes seleccionar un ${tipo}`, { position: "top-right" });
    
    setLoadingAsignar({...loadingAsignar, [tipo]: true});
    await patchEmpleados(true, dataSend)
      .then(async() => await cargarEmpleados())
      .catch((err) => console.log(err))
      .finally(() => setLoadingAsignar({...loadingAsignar, [tipo]: false}));
  };

  const exportarTecnicos = () => {
    if (dataTecnicos && dataTecnicos.length > 0) {
      return saveAsCsv({ 
        data: dataTecnicos.map((o) => {
          return ({
            ...o,
            tecnico: o.nombre && o.apellidos ? o.nombre + ' ' + o.apellidos : '-',
            gestor: o.gestor ? o.gestor.nombre + ' ' + o.gestor.apellidos : '-',
            auditor: o.auditor && o.auditor.nombre ? o.auditor.nombre + ' ' + o.auditor.apellidos : '-',
            contrata: o.contrata ? o.contrata.nombre : '-'
          })
        }), 
        fields: valoresTecnicos, 
        filename: `data_personal_${moment().format('DD_MM_YY_HH_mm')}`
      })
    }
  };

  const realizarBusqueda = (e) => {
    const valor = e.target.value;
    if (String(valor).length > 0 && tipoBusqueda && totalTecnicos.length > 0) {
      setDataTecnicos(totalTecnicos.filter((e) =>String(e[tipoBusqueda]).toLowerCase().indexOf(String(valor).toLowerCase()) === 0))
    } else {
      setDataTecnicos(totalTecnicos)
    };
  };

  const generarFiltros = (dataSource) => {
    setFiltroContrata(obtenerFiltroId(dataSource, 'contrata'));
    setFiltroGestor(obtenerFiltroId(dataSource, 'gestor', true));
    setFiltroAuditor(obtenerFiltroId(dataSource, 'auditor', true));
    setFiltroSupervisor(obtenerFiltroId(dataSource, 'supervisor', true));
  };

  const onChangeTable = (_, filters, __, dataSource) => {
    generarFiltros(dataSource.currentDataSource);
    setTecnicosSeleccionados([]);
    setFiltros(filters);
  };

  const columnas = [
    {
      title: '#',
      width: 50,
      align: 'center',
      render: (_,__,i) => i+1
    },
    {
      title: 'Nombre',
      width: 150,
      ellipsis: {
        title: true
      },
      dataIndex: 'nombre',
      render: (t) => (
        <Tooltip placement="topLeft" title={t}>{t}</Tooltip>
      )
    },
    {
      title: 'Apellidos',
      width: 150,
      ellipsis: {
        title: true
      },
      dataIndex: 'apellidos',
      render: (t) => <Tooltip placement="topLeft" title={t}>{t}</Tooltip>
    },
    {
      title: 'Carnet',
      width: 100,
      dataIndex: 'carnet',
      render: (e) => <Text copyable>{e}</Text>
    },
    {
      title: 'Contrata',
      width: 160,
      ellipsis: {
        title: true
      },
      dataIndex: 'contrata',
      filteredValue: filtros && filtros.contrata ? filtros.contrata : null,
      filters: filtroContrata,
      onFilter: (v,r) => {
        if (v === '-') {
          return !r.contrata
        } else if( r.contrata !== undefined) {
          return r.contrata._id.indexOf(v) === 0
        } else {
          return false
        }
      },
      render: (t) => (
        <Tooltip placement="topLeft" title={t.nombre ? t.nombre: '-'}>{t ? t.nombre: '-'}</Tooltip>
      )
    },
    {
      title: 'Gestor',
      width: 150,
      ellipsis: {
        title: true
      },
      dataIndex: 'gestor',
      filteredValue: filtros && filtros.gestor ? filtros.gestor : null,
      filters: filtroGestor,
      onFilter: (v,r) => {
        if (v === '-') {
          return !r.gestor
        } else if( r.gestor !== undefined && r.gestor !== null) {
          return r.gestor._id.indexOf(v) === 0
        } else {
          return false
        }
      },
      render: (gestor) => {
        if (gestor && gestor.nombre && gestor.apellidos) {
          const nombre = gestor.nombre + ' ' + gestor.apellidos
          return <Tooltip placement="topLeft" title={nombre}>{nombre}</Tooltip>
        } else {
          return '-'
        }
      }
    },
    {
      title: 'Auditor',
      width: 150,
      ellipsis: {
        title: true
      },
      dataIndex: 'auditor',
      filteredValue: filtros && filtros.auditor ? filtros.auditor : null,
      filters: filtroAuditor,
      onFilter: (v,r) => {
        if (v === '-') {
          return !r.auditor
        } else if( r.auditor !== undefined) {
          return r.auditor._id.indexOf(v) === 0
        } else {
          return false
        }
      },
      render: (auditor) => {
        if (auditor && auditor.nombre && auditor.apellidos) {
          const nombre = auditor.nombre + ' ' + auditor.apellidos;
          return <Tooltip placement="topLeft" title={nombre}>{nombre}</Tooltip>
        } else {
          return '-'
        }
      }
    },
    {
      title: 'Supervisor',
      width: 150,
      ellipsis: {
        title: true
      },
      dataIndex: 'supervisor',
      filteredValue: filtros && filtros.supervisor ? filtros.supervisor : null,
      filters: filtroSupervisor,
      onFilter: (v,r) => {
        if (v === '-') {
          return !r.supervisor
        } else if( r.supervisor !== undefined) {
          return r.supervisor._id.indexOf(v) === 0
        } else {
          return false
        }
      },
      render: (obj) => {
        if (obj && obj.nombre && obj.apellidos) {
          const nombre = obj.nombre + ' ' + obj.apellidos;
          return <Tooltip placement="topLeft" title={nombre}>{nombre}</Tooltip>
        } else {
          return '-'
        }
      }
    },
    {
      title: 'Negocio',
      width: 100,
      align: "center",
      dataIndex: 'tipo_negocio',
      filteredValue: filtros && filtros.tipo_negocio ? filtros.tipo_negocio : null,
      filters: tipoNegocio,
      onFilter: (v,r) => {
        if (v === '-') {
          return !r.tipo_negocio
        } else if( r.tipo_negocio !== undefined) {
          return r.tipo_negocio.indexOf(v) === 0
        } else {
          return false
        }
      },
      render: (t) => String(t).toUpperCase()
    },
    {
      title: 'Sub Negocio',
      width: 130,
      align: "center",
      dataIndex: 'sub_tipo_negocio',
      filteredValue: filtros && filtros.sub_tipo_negocio ? filtros.sub_tipo_negocio : null,
      filters: subTipoNegocio,
      onFilter: (v,r) => {
        if (v === '-') {
          return !r.sub_tipo_negocio
        } else if( r.sub_tipo_negocio !== undefined) {
          return r.sub_tipo_negocio.indexOf(v) === 0
        } else {
          return false
        }
      },
      render: (t) => String(t).toUpperCase()
    }
  ];

  return (
    <div>
      <Row style={{ marginBottom: '.5rem', marginTop: '.5rem' }}>
        <Col sm={12}>
          <p>Asignar Gestor:</p>
          <Select
            showSearch
            placeholder="Buscar por nombre"
            size="small"
            loading={loadingGestores}
            defaultValue={tipoSeleccionado.gestor}
            onChange={gestor => setTipoSeleccionado({...tipoSeleccionado, gestor})} 
            style={{ width: 300, marginBottom: '.5rem', marginRight: '.5rem' }}
            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 }
          >
          {
            gestores.length > 0 ? 
            gestores.map((e, i) => (
              <Option key={i} value={e._id}>{`${e.nombre} ${e.apellidos}`}</Option>
            ))
            :
            <Option>Sin data</Option>
          }
          </Select>
          <Button 
            size="small"
            type="primary"
            style={{ marginBottom: ".5rem" }}
            disabled={loadingAsignar.gestor}
            icon={loadingAsignar.gestor ? <LoadingOutlined spin/>: <CheckCircleOutlined/>}
            onClick={() => asignarTecnico('gestor')}
          >Asignar</Button>
          <p>Asignar Auditor:</p>
          <Select
            showSearch
            size="small"
            placeholder="Buscar por nombre"
            loading={loadingAuditores}
            defaultValue={tipoSeleccionado.auditor}
            onChange={auditor => setTipoSeleccionado({...tipoSeleccionado, auditor})} 
            style={{ width: 300, marginBottom: '.5rem', marginRight: '.5rem' }}
            filterOption={(input, option) => {
                return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            }
          >
          {
            auditores.length > 0 ? 
            auditores.map((e, i) => (
              <Option key={i} value={e._id}>{`${e.nombre} ${e.apellidos}`}</Option>
            ))
            :
            <Option>Sin data</Option>
          }
          </Select>
          <Button 
            size="small"
            type="primary"
            disabled={loadingAsignar.auditor}
            style={{ marginBottom: ".5rem" }}
            icon={loadingAsignar.auditor ? <LoadingOutlined spin/>:<CheckCircleOutlined/>}
            onClick={() => asignarTecnico('auditor')}
          >Asignar</Button>
          <p>Asignar Supervisor:</p>
          <Select
            showSearch
            size="small"
            placeholder="Buscar por nombre"
            loading={loadingSupervisores}
            defaultValue={tipoSeleccionado.supervisor}
            onChange={supervisor => setTipoSeleccionado({...tipoSeleccionado, supervisor})} 
            style={{ width: 300, marginBottom: '.5rem', marginRight: '.5rem' }}
            filterOption={(input, option) => {
                return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            }
          >
          {
            supervisores.length > 0 ? 
            supervisores.map((e, i) => (
              <Option key={i} value={e._id}>{`${e.nombre} ${e.apellidos}`}</Option>
            ))
            :
            <Option>Sin data</Option>
          }
          </Select>
          <Button 
            size="small"
            type="primary"
            style={{ marginBottom: ".5rem" }}
            disabled={loadingAsignar.supervisor}
            icon={loadingAsignar.supervisor ? <LoadingOutlined spin/>:<CheckCircleOutlined/>}
            onClick={() => asignarTecnico('supervisor')}
          >Asignar</Button>
        </Col>
        <Col sm={12}>
          <p>Asignar Tipo de Negocio:</p>
          <Select
            size="small"
            placeholder="Buscar Tipo de Negocio"
            defaultValue={tipoSeleccionado.negocio}
            onChange={negocio => setTipoSeleccionado({...tipoSeleccionado, negocio})} 
            style={{ width: 300, marginBottom: '.5rem', marginRight: '.5rem' }}
          >
          {
            tipoNegocio.map((n) => (
              <Option key={n.value} value={n.value}>{n.text}</Option>
            ))
          }
          </Select>
          <Button 
            size="small"
            type="primary"
            style={{ marginBottom: ".5rem" }}
            disabled={loadingAsignar.negocio}
            icon={loadingAsignar.negocio ? <LoadingOutlined spin/>:<CheckCircleOutlined/>}
            onClick={() => asignarTecnico('negocio')}
          >Asignar</Button>
          <p>Asignar Subtipo de Negocio:</p>
          <Select
            size="small"
            placeholder="Buscar Subtipo de Negocio"
            defaultValue={tipoSeleccionado.subNegocio}
            onChange={subNegocio => setTipoSeleccionado({...tipoSeleccionado, subNegocio})}  
            style={{ width: 300, marginBottom: '.5rem', marginRight: '.5rem' }}
          >
          {
            subTipoNegocio.map((n) => (
              <Option key={n.value} value={n.value}>{n.text}</Option>
            ))
          }
          </Select>
          <Button 
            size="small"
            type="primary"
            style={{ marginBottom: ".5rem" }}
            disabled={loadingAsignar.subNegocio}
            icon={loadingAsignar.subNegocio ? <LoadingOutlined spin/>:<CheckCircleOutlined/>}
            onClick={() => asignarTecnico('subNegocio')}
          >Asignar</Button>
        </Col>
      </Row>
      <Table
        title={() => <div>
          <Radio.Group size="small" value={tipoBusqueda} onChange={(e) => setTipoBusqueda(e.target.value)}>
            <Radio value="nombre">Nombre</Radio>
            <Radio value="apellidos">Apellidos</Radio>
            <Radio value="carnet">Carnet</Radio>
          </Radio.Group>
          <Search 
            onChange={realizarBusqueda}
            placeholder={`Buscar ${capitalizar(tipoBusqueda)}`} 
            allowClear
            size="small" 
            style={{ width: 200 }}
          />
        </div>}
        rowKey="_id"
        size="small"
        dataSource={dataTecnicos}
        loading={loadingTecnicos}
        columns={columnas}
        onChange={onChangeTable}
        rowSelection={{
          columnWidth: 30,
          selectedRowKeys: tecnicosSeleccionados,
          onChange: (e) => setTecnicosSeleccionados(e)
        }}
        pagination={{
          defaultPageSize: 50,
          pageSizeOptions: [50,100,200],
        }}
        scroll={{ y: '70vh' }}
        footer={() => <Button type="primary" size="small" icon={<ExportOutlined/>} onClick={exportarTecnicos}>Exportar</Button>}
      />      
    </div>
  )
}

TablaRutasOperativas.propTypes = {
  gestores: PropTypes.array,
  loadingGestores: PropTypes.bool,
  auditores: PropTypes.array,
  loadingAuditores: PropTypes.bool,
  supervisores: PropTypes.array,
  loadingSupervisores: PropTypes.bool,
}

export default TablaRutasOperativas

