import React from 'react';
import { Tag, Tooltip, Typography } from 'antd';
import { PlusCircleTwoTone } from '@ant-design/icons'
import moment from 'moment';

import TagEstado from '../administrarOrdenes/TagEstado';
import colores from '../../../constants/colores';
import capitalizar from '../../../libraries/capitalizar';

const { Text } = Typography;

export default function columnasOrdenes(
  filtroDistrito=[],
  filtroTipo=[],
  filtroBucket=[],
  filtroEstadoToa=[],
  filtroEstadoGestor=[],
  filtroContrata=[], 
  filtroTecnico=[],
  filtroGestor=[],
  abrirReiterada,
  abrirInfancia,
  abrirDetalle
) {

  return [
    {
      title: '#',
      width: 50,
      fixed: 'left',
      render: (_,__,i) => i+1
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      width: 100,
      fixed: 'left',
      filters: filtroTipo ? filtroTipo : [],
      onFilter: (v,r) => r.tipo.indexOf(v) === 0,
      render: (t) => t ? capitalizar(t) : '-'
    },
    {
      title: 'Requerimiento',
      dataIndex: 'codigo_requerimiento',
      width: 120,
      fixed: 'left',
      render: (req) => <Text copyable>{req}</Text>
    },
    {
      title: 'Tipo Requerimiento',
      dataIndex: 'tipo_requerimiento',
      width: 120,
    },
    {
      title: 'Tipo Tecnologia',
      dataIndex: 'tipo_tecnologia',
      width: 120
    },
    {
      title: 'Orden Trabajo',
      dataIndex: 'codigo_trabajp',
      width: 120,
      render: (req) => <Text copyable>{req}</Text>
    },
    {
      title: 'Peticion',
      dataIndex: 'codigo_peticion',
      width: 120,
      render: (req) => <Text copyable>{req}</Text>
    },
    {
      title: 'Codigo Cliente',
      dataIndex: 'codigo_cliente',
      width: 120,
      render: (req) => <Text copyable>{req}</Text>
    },
    {
      title: 'CTR',
      dataIndex: 'codigo_ctr',
      width: 60,
    },
    {
      title: 'Nodo',
      dataIndex: 'codigo_nodo',
      width: 60
    },
    {
      title: 'Troba',
      dataIndex: 'codigo_troba',
      width: 70,
      sorter: (a, b) => {
        if (a.codigo_troba < b.codigo_troba) {
          return -1;
        }
        if (a.codigo_troba > b.codigo_troba) {
          return 1;
        }
        return 0;
      },
    },
    {
      title: 'Reiterada',
      dataIndex: 'numero_reiterada',
      width: 100,
      align: 'center',
      sorter: (a,b) => a.numero_reiterada - b.numero_reiterada,
      render: (r, obj) => {
        if (r && r !== '0') {
          return <Tag color="#E5302F" onClick={() => abrirReiterada(obj.codigo_cliente)} style={{ cursor: 'pointer' }}>{r}</Tag>
        } else {
          return '-'
        }
      }
    },
    {
      title: 'Infancia',
      dataIndex: 'infancia',
      width: 100,
      align: 'center',
      filters: [{text: 'Si', value: true}, {text: 'No', value: false}],
      onFilter: (v,r) => {
        if (v) {
          return r.infancia
        } else {
          return !r.infancia
        }
      },
      render: (inf) => {
        if (inf && inf.codigo_requerimiento) {
          return <Tag color="blue" onClick={() => abrirInfancia(inf)} style={{ cursor: 'pointer' }}>Si</Tag>
        } else {
          return '-'
        }
      }
    },
    {
      title: 'Distrito',
      dataIndex: 'distrito',
      width: 160,
      filters: filtroDistrito ? filtroDistrito : [],
      onFilter: (v,r) => r.distrito.indexOf(v) === 0
    },
    {
      title: 'Bucket',
      dataIndex: 'bucket',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      filters: filtroBucket ? filtroBucket : [],
      onFilter: (v,r) => r.bucket.indexOf(v) === 0,
      render: (bckt) => (
        <Tooltip placement="topLeft" title={bckt}>
          {bckt}
        </Tooltip>
      )
    },
    {
      title: 'Estado Toa',
      dataIndex: 'estado_toa',
      width: 150,
      align: 'center',
      filters: filtroEstadoToa ? filtroEstadoToa : [],
      onFilter: (v,r) => r.estado_toa.indexOf(v) === 0,
      render: (e) => <TagEstado estado={e}/>
    },
    {
      title: 'Estado Gestor',
      dataIndex: 'estado_gestor',
      width: 150,
      align: 'center',
      filters: filtroEstadoGestor ? filtroEstadoGestor : [],
      onFilter: (v,r) => r.estado_gestor.indexOf(v) === 0,
      render: (e) => <TagEstado estado={e}/>
    },
    {
      title: 'Contrata',
      dataIndex: 'contrata',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      filters: filtroContrata ? filtroContrata : [],
      onFilter: (v,r) => {
        if (v === '-') {
          return !r.contrata
        } else if( r.contrata !== undefined) {
          return r.contrata._id.indexOf(v) === 0
        } else {
          return false
        }
      },
      render: (c) => (
        <Tooltip placement="topLeft" title={c ? c.nombre:'-'}>
          {c ? c.nombre:'-'}
        </Tooltip>
      )
    },
    {
      title: 'Gestor',
      dataIndex: 'gestor',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      filters: filtroGestor ? filtroGestor : [],
      onFilter: (v,r) => {
        if (v === '-') {
          return !r.gestor
        } else if( r.gestor !== undefined && r.gestor !== null) {
          return r.gestor._id.indexOf(v) === 0
        } else {
          return false
        }
      },
      render: (g) => (
        <Tooltip placement="topLeft" title={g ? g.nombre+' '+g.apellidos:'-'}>
          {g ? g.nombre+' '+g.apellidos:'-'}
        </Tooltip>
      )
    },
    {
      title: 'Tecnico',
      dataIndex: 'tecnico',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      filters: filtroTecnico ? filtroTecnico : [],
      onFilter: (v,r) => {
        if (v === '-') {
          return !r.tecnico
        } else if( r.tecnico !== undefined) {
          return r.tecnico._id.indexOf(v) === 0
        } else {
          return false
        }
      },
      render: (t) => (
        <Tooltip placement="topLeft" title={t ? t.nombre+' '+t.apellidos:'-'}>
          {t ? t.nombre+' '+t.apellidos:'-'}
        </Tooltip>
      )
    },
    {
      title: 'Auditor',
      dataIndex: 'auditor',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (t) => (
        <Tooltip placement="topLeft" title={t ? t.nombre+' '+t.apellidos:'-'}>
          {t ? t.nombre+' '+t.apellidos:'-'}
        </Tooltip>
      )
    },
    {
      title: 'Fecha Cita',
      dataIndex: 'fecha_cita',
      width: 150,
      render: (fecha) => {
        if (fecha) {
          return moment(fecha).format('DD/MM/YY');
        } else {
          return '-';
        }
      }
    },
    {
      title: 'Fecha Asignado',
      dataIndex: 'fecha_asignado',
      width: 150,
      render: (fecha) => {
        if (fecha) {
          return moment(fecha).format('DD/MM/YY HH:mm');
        } else {
          return '-';
        }
      }
    },
    {
      title: 'Fecha Registro',
      dataIndex: 'fecha_registro',
      width: 150,
      render: (fecha) => {
        if (fecha) {
          return moment(fecha).format('DD/MM/YY HH:mm');
        } else {
          return '-';
        }
      }
    },
    {
      title: 'Orden Devuelta',
      dataIndex: 'orden_devuelta',
      width: 150,
      align: 'center',
      filters: [{text: 'Si', value: true}, {text: 'No', value: false}],
      onFilter: (v,r) => {
        if (v) {
          return r.orden_devuelta
        } else {
          return !r.orden_devuelta
        }
      },
      render: (inf) => {
        if (inf && inf.length > 0) {
          return <Tag color={colores.warning}>Si</Tag>
        } else {
          return '-'
        }
      }
    },
    {
      title: 'Horas',
      dataIndex: 'fecha_registro',
      width: 80,
      align: 'center',
      fixed: 'right',
      sorter: (a, b) => {
        if (moment().diff(a.fecha_registro, 'hours') < moment().diff(b.fecha_registro, 'hours')) {
          return -1;
        }
        if (moment().diff(a.fecha_registro, 'hours') > moment().diff(b.fecha_registro, 'hours')) {
          return 1;
        }
        return 0;
      },
      render: (fecha) => {
        if (fecha) {
          return <Tag>{moment().diff(fecha, 'hours')}</Tag>
        } else {
          return <Tag>-</Tag>
        }
      }
    },
    {
      title: 'Acciones',
      dataIndex: '_id',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (id) => (
        <div>
          <PlusCircleTwoTone
            style={{ fontSize: '1.5rem', marginRight: '.5rem' }}
            onClick={() => abrirDetalle(id)}
          />
        </div>
      )
    }
  ];
};