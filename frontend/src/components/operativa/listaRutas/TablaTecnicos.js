import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Select, Table, Button } from 'antd';
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';

import { getEmpleados, patchEmpleados } from '../../../services/apiEmpleado';
import { empleados } from '../../../constants/metodos';
import { obtenerFiltroId } from '../../../libraries/obtenerFiltro';

const { Option } = Select;

function TablaTecnicos({gestores=[], loadingGestores, auditores=[], loadingAuditores}) {
  const [dataTecnicos, setDataTecnicos] = useState([]);
  const [loadingTecnicos, setLoadingTecnicos] = useState(false);
  const [loadingAsignarGestor, setLoadingAsignarGestor] = useState(false);
  const [loadingAsignarAuditor, setLoadingAsignarAuditor] = useState(false);
  const [tecnicosSeleccionados, setTecnicosSeleccionados] = useState([]);
  const [gestorSeleccionado, setGestorSeleccionado] = useState(null);
  const [auditorSeleccionado, setAuditorSeleccionado] = useState(null);
  const [filtroContrata, setFiltroContrata] = useState([]);
  const [filtroGestor, setFiltroGestor] = useState([]);
  const [filtroAuditor, setFiltroAuditor] = useState([]);

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

  async function asignarTecnico(gestor=true) {
    if (gestor) {
      if (tecnicosSeleccionados.length > 0) {
        setLoadingAsignarGestor(true);
        await patchEmpleados(true, { metodo: empleados.ACTUALIZAR_GESTOR, gestor: gestorSeleccionado, tecnicos: tecnicosSeleccionados })
          .then(async() => {
            setTecnicosSeleccionados([]);
            await cargarEmpleados();
          }).catch((err) => {
            setTecnicosSeleccionados([]);
            console.log(err);
          }).finally(() => setLoadingAsignarGestor(false));
      } else {
        console.log('no hay tecnicos seleccionado')
      }; 
    } else {
      if (auditorSeleccionado && tecnicosSeleccionados.length > 0) {
        setLoadingAsignarAuditor(true);
        await patchEmpleados(true, { metodo: empleados.ACTUALIZAR_AUDITOR, auditor: auditorSeleccionado, tecnicos: tecnicosSeleccionados })
          .then(async() => {
            setTecnicosSeleccionados([]);
            await cargarEmpleados();
          }).catch((err) => {
            setTecnicosSeleccionados([]);
            console.log(err);
          }).finally(() => setLoadingAsignarAuditor(false));
      } else {
        console.log('no hay tecnicos o auditor seleccionado')
      }
    }
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
    }
  ];

  return (
    <div>
      <p>Asignar Gestor:</p>
      <Select
        showSearch
        placeholder="Buscar por nombre"
        loading={loadingGestores}
        defaultValue={gestorSeleccionado}
        onChange={e => setGestorSeleccionado(e)} 
        style={{ width: 300, marginBottom: '.5rem', marginRight: '.5rem' }}
        filterOption={(input, option) => {
            return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        }
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
        onClick={asignarTecnico}
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
            console.log(input, option)
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
        onClick={() => asignarTecnico(false)}
      >Asignar</Button>
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

