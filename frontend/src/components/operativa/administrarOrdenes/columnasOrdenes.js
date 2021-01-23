import React from 'react';
import { Tag, Tooltip, Typography } from 'antd';
import { PlusCircleTwoTone, RollbackOutlined } from '@ant-design/icons'
import moment from 'moment';

import TagEstado from './TagEstado';
import { tipoOrdenes } from '../../../constants/tipoOrden';
import colores from '../../../constants/colores';

const { Text } = Typography;

export default function columnasOrdenes(
  tipo,
  filtroDistrito=[],
  filtroBucket=[],
  filtroEstadoToa=[],
  filtroEstadoGestor=[],
  filtroContrata=[], 
  filtroGestor=[], 
  filtroTipoReq=[],
  abrirReiterada,
  abrirInfancia,
  abrirInfanciaExterna,
  abrirDetalle,
  abrirDevolver
) {

  const columnasAverias = [
    {
      title: '#',
      width: 50,
      fixed: 'left',
      render: (_,__,i) => i+1
    },
    {
      title: 'Requerimiento',
      dataIndex: 'codigo_requerimiento',
      width: 120,
      fixed: 'left',
      render: (req) => <Text copyable>{req}</Text>
    },
    {
      title: 'Codigo Cliente',
      dataIndex: 'codigo_cliente',
      width: 120,
      render: (req) => <Text copyable>{req}</Text>
    },
    {
      title: 'Tipo Tecnologia',
      dataIndex: 'tipo_tecnologia',
      align: 'center',
      width: 120
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
        if (r && r !== '0' && r !== '-') {
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
        if (inf && inf.length > 0) {
          return <Tag color="purple" onClick={() => abrirInfancia(inf)} style={{ cursor: 'pointer' }}>Si</Tag>
        } else {
          return '-'
        }
      }
    },
    {
      title: 'Infancia Externa',
      dataIndex: 'infancia_externa',
      width: 100,
      align: 'center',
      filters: [{text: 'Si', value: true}, {text: 'No', value: false}],
      onFilter: (v,r) => {
        if (v) {
          return r.infancia_externa
        } else {
          return !r.infancia_externa
        }
      },
      render: (inf) => {
        if (inf && inf.codigo_requerimiento) {
          return <Tag color="geekblue" onClick={() => abrirInfanciaExterna(inf)} style={{ cursor: 'pointer' }}>Si</Tag>
        } else {
          return '-'
        }
      }
    },
    {
      title: 'Cliente',
      dataIndex: 'nombre_cliente',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (c) => (
        <Tooltip placement="topLeft" title={c}>
          {c}
        </Tooltip>
      )
    },
    {
      title: 'Distrito',
      dataIndex: 'distrito',
      width: 160,
      filters: filtroDistrito ? filtroDistrito : [],
      onFilter: (v,r) => r.distrito.indexOf(v) === 0
    },
    {
      title: 'Dirección',
      dataIndex: 'direccion',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (g) => (
        <Tooltip placement="topLeft" title={g}>
          {g}
        </Tooltip>
      )
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
      title: 'Estado Liquidado',
      dataIndex: 'estado_liquidado',
      width: 150,
      align: 'center',
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
        } else if( r.gestor !== undefined) {
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
      width: 100,
      align: 'center',
      fixed: 'right',
      render: (id) => (
        <div>
          <PlusCircleTwoTone
            style={{ fontSize: '1.5rem', marginRight: '.5rem' }}
            onClick={() => abrirDetalle(id)}
          />
          <RollbackOutlined
            style={{ fontSize: '1.5rem', color: colores.error }}
            onClick={() => abrirDevolver(id)}
          />
        </div>
      )
    }
  ];

  const columnasAltas = [
    {
      title: '#',
      width: 50,
      fixed: 'left',
      render: (_,__,i) => i+1
    },
    {
      title: 'Requerimiento',
      dataIndex: 'codigo_requerimiento',
      width: 120,
      fixed: 'left',
      render: (req) => <Text copyable>{req}</Text>
    },
    {
      title: 'Orden Trabajo',
      dataIndex: 'codigo_trabajo',
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
      title: 'Tipo Req.',
      dataIndex: 'tipo_requerimiento',
      align:'center',
      width: 100,
      filters: filtroTipoReq ? filtroTipoReq : [],
      onFilter: (v,r) => r.tipo_requerimiento.indexOf(v) === 0
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
        } else if( r.gestor !== undefined) {
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
      width: 100,
      align: 'center',
      fixed: 'right',
      render: (id) => (
        <div>
          <PlusCircleTwoTone
            style={{ fontSize: '1.5rem', marginRight: '.5rem' }}
            onClick={() => abrirDetalle(id)}
          />
          <RollbackOutlined
            style={{ fontSize: '1.5rem', color: colores.error }}
            onClick={() => abrirDevolver(id)}
          />
        </div>
      )
    }
  ];

  switch (tipo) {
    case tipoOrdenes.AVERIAS:
      return columnasAverias;  
    case tipoOrdenes.ALTAS:
      return columnasAltas;
    default:
      break;
  }
};