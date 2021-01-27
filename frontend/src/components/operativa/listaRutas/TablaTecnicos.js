import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Select, Table, Button, Row, Col } from 'antd';
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useJsonToCsv } from 'react-json-csv';
import moment from 'moment';

import { getEmpleados, patchEmpleados } from '../../../services/apiEmpleado';
import { empleados } from '../../../constants/metodos';
import { obtenerFiltroId } from '../../../libraries/obtenerFiltro';
import { tipoNegocio, subTipoNegocio } from '../../../constants/tipoOrden';

const { Option } = Select;

const valoresTecnicos = {
  contrata: "Contrata",
  carnet: "Carnet",
  tecnico: "Tecnico",
  gestor: "Gestor",
  auditor: "auditor",
  tipo_negocio: "Negocio",
  sub_tipo_negocio: "Sub Negocio"
};

function TablaTecnicos({gestores=[], loadingGestores, auditores=[], loadingAuditores}) {
  const [dataTecnicos, setDataTecnicos] = useState([]);
  const [loadingTecnicos, setLoadingTecnicos] = useState(false);
  const [loadingAsignarGestor, setLoadingAsignarGestor] = useState(false);
  const [loadingAsignarAuditor, setLoadingAsignarAuditor] = useState(false);
  const [loadingAsignarNegocio, setLoadingAsignarNegocio] = useState(false);
  const [loadingAsignarSubNegocio, setLoadingAsignarSubNegocio] = useState(false);
  const [tecnicosSeleccionados, setTecnicosSeleccionados] = useState([]);
  const [gestorSeleccionado, setGestorSeleccionado] = useState(null);
  const [auditorSeleccionado, setAuditorSeleccionado] = useState(null);
  const [negocioSeleccionado, setNegocioSeleccionado] = useState(null);
  const [subNegocioSeleccionado, setSubNegocioSeleccionado] = useState(null);
  const [filtroContrata, setFiltroContrata] = useState([]);
  const [filtroGestor, setFiltroGestor] = useState([]);
  const [filtroAuditor, setFiltroAuditor] = useState([]);
  const { saveAsCsv } = useJsonToCsv();

  useEffect(() => {
    cargarEmpleados();
  },[]);

  async function cargarEmpleados() {
    setLoadingTecnicos(true);
    await getEmpleados(true, { metodo: empleados.LISTA_TECNICOS_GLOBAL }).then(async({data}) => {
        if (data) {
          obtenerFiltroId(data, 'contrata').then((f) => setFiltroContrata(f))
          obtenerFiltroId(data, 'gestor', true).then((f) => setFiltroGestor(f))
          obtenerFiltroId(data, 'auditor', true).then((f) => setFiltroAuditor(f))
          setDataTecnicos(data);
        }
      }).catch((error) => console.log(error)).finally(() => setLoadingTecnicos(false));
  };

  async function asignarTecnico(tipo) {
    if (tipo === 'gestor') {
      if (tecnicosSeleccionados.length > 0) {
        setLoadingAsignarGestor(true);
        await patchEmpleados(true, { metodo: empleados.ACTUALIZAR_GESTOR, gestor: gestorSeleccionado === '-' ? null: gestorSeleccionado, tecnicos: tecnicosSeleccionados })
          .then(async() => await cargarEmpleados()).catch((err) => console.log(err)).finally(() => setLoadingAsignarGestor(false));
      } else {
        console.log('no hay tecnicos seleccionado')
      }; 
    } else if (tipo === 'auditor') {
      if (auditorSeleccionado && tecnicosSeleccionados.length > 0) {
        setLoadingAsignarAuditor(true);
        await patchEmpleados(true, { metodo: empleados.ACTUALIZAR_AUDITOR, auditor: auditorSeleccionado, tecnicos: tecnicosSeleccionados })
          .then(async() => await cargarEmpleados()).catch((err) => console.log(err)).finally(() => setLoadingAsignarAuditor(false));
      } else {
        console.log('no hay tecnicos o auditor seleccionado')
      }
    } else if (tipo === 'negocio') {
      if (negocioSeleccionado && tecnicosSeleccionados.length > 0) {
        setLoadingAsignarNegocio(true);
        await patchEmpleados(true, { metodo: empleados.ACTUALIZAR_NEGOCIO, negocio: negocioSeleccionado, tecnicos: tecnicosSeleccionados })
          .then(async() => await cargarEmpleados()).catch((err) => console.log(err)).finally(() => setLoadingAsignarNegocio(false));
      } else {
        console.log('no hay tecnicos o negocio seleccionado')
      }
    } else if (tipo === 'subNegocio') {
      if (subNegocioSeleccionado && tecnicosSeleccionados.length > 0) {
        setLoadingAsignarSubNegocio(true);
        await patchEmpleados(true, { metodo: empleados.ACTUALIZAR_SUB_NEGOCIO, subNegocio: subNegocioSeleccionado, tecnicos: tecnicosSeleccionados })
          .then(async() => await cargarEmpleados()).catch((err) => console.log(err)).finally(() => setLoadingAsignarSubNegocio(false));
      } else {
        console.log('no hay tecnicos o sub negocio seleccionado')
      }
    }
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
  }

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
      dataIndex: 'nombre',
    },
    {
      title: 'Apellidos',
      width: 150,
      dataIndex: 'apellidos',
    },
    {
      title: 'Carnet',
      width: 100,
      dataIndex: 'carnet'
    },
    {
      title: 'Contrata',
      width: 150,
      dataIndex: 'contrata',
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
      render: (c) => c.nombre && c.nombre
    },
    {
      title: 'Gestor',
      width: 150,
      dataIndex: 'gestor',
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
          return gestor.nombre + ' ' + gestor.apellidos
        } else {
          return '-'
        }
      }
    },
    {
      title: 'Auditor',
      width: 150,
      dataIndex: 'auditor',
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
          return auditor.nombre + ' ' + auditor.apellidos
        } else {
          return '-'
        }
      }
    },
    {
      title: 'Negocio',
      width: 150,
      dataIndex: 'tipo_negocio',
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
      width: 150,
      dataIndex: 'sub_tipo_negocio',
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
            loading={loadingGestores}
            defaultValue={gestorSeleccionado}
            onChange={e => setGestorSeleccionado(e)} 
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
            icon={loadingAsignarGestor ? <LoadingOutlined spin/>: <CheckCircleOutlined/>}
            onClick={() => asignarTecnico('gestor')}
          >Asignar</Button>
          <p>Asignar Auditor:</p>
          <Select
            showSearch
            placeholder="Buscar por nombre"
            loading={loadingAuditores}
            defaultValue={auditorSeleccionado}
            onChange={e => setAuditorSeleccionado(e)} 
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
            icon={loadingAsignarAuditor ? <LoadingOutlined spin/>:<CheckCircleOutlined/>}
            onClick={() => asignarTecnico('auditor')}
          >Asignar</Button>
        </Col>
        <Col sm={12}>
          <p>Asignar Tipo de Negocio:</p>
          <Select
            placeholder="Buscar Tipo de Negocio"
            defaultValue={negocioSeleccionado}
            onChange={e => setNegocioSeleccionado(e)} 
            style={{ width: 300, marginBottom: '.5rem', marginRight: '.5rem' }}
          >
          {
            tipoNegocio.map((n) => (
              <Option key={n.value} value={n.value}>{n.text}</Option>
            ))
          }
          </Select>
          <Button 
            icon={loadingAsignarNegocio ? <LoadingOutlined spin/>:<CheckCircleOutlined/>}
            onClick={() => asignarTecnico('negocio')}
          >Asignar</Button>
          <p>Asignar Subtipo de Negocio:</p>
          <Select
            placeholder="Buscar Subtipo de Negocio"
            defaultValue={subNegocioSeleccionado}
            onChange={e => setSubNegocioSeleccionado(e)} 
            style={{ width: 300, marginBottom: '.5rem', marginRight: '.5rem' }}
          >
          {
            subTipoNegocio.map((n) => (
              <Option key={n.value} value={n.value}>{n.text}</Option>
            ))
          }
          </Select>
          <Button 
            icon={loadingAsignarSubNegocio ? <LoadingOutlined spin/>:<CheckCircleOutlined/>}
            onClick={() => asignarTecnico('subNegocio')}
          >Asignar</Button>
        </Col>
      </Row>
      <Table
        rowKey="_id"
        size="small"
        dataSource={dataTecnicos}
        loading={loadingTecnicos}
        columns={columnas}
        rowSelection={{
          columnWidth: 30,
          selectedRowKeys: tecnicosSeleccionados,
          onChange: (e) => setTecnicosSeleccionados(e)
        }}
        pagination={{
          defaultPageSize: 20,
          pageSizeOptions: [20,50,100],
        }}
        scroll={{ y: '60vh' }}
        footer={() => <Button onClick={exportarTecnicos}>Exportar</Button>}
      />      
    </div>
  )
}

TablaTecnicos.propTypes = {
  gestores: PropTypes.array,
  loadingGestores: PropTypes.bool,
  auditores: PropTypes.array,
  loadingAuditores: PropTypes.bool
}

export default TablaTecnicos

