import React from 'react';
import { Tag, Tooltip, Typography } from 'antd';
import { PlusCircleTwoTone } from '@ant-design/icons'
import moment from 'moment';

import TagEstado from '../TagEstado';
import { tipoOrdenes } from '../../../../constants/tipoOrden';
import PopObservacion from './PopObservacion';
import { ordenesB2B } from '../../../../constants/valoresToa';
import TagHoras from '../../../common/TagHoras';

const { Text } = Typography;


export default function columnasOrdenes(
  tipo,
  filtroDistrito=[],
  filtroBucket=[],
  filtroEstadoToa=[],
  filtroEstadoGestor=[],
  filtroContrata=[], 
  filtroGestorAsignado=[],
  filtroTecnicoToa=[],
  filtroTecnicoAsignado=[],
  filtroTipoReq=[],
  filtroTecnologia=[],
  filtroNodo=[],
  filtroTroba=[],
  filtroCtr=[],
  filtroTimeSlot=[],
  filtroObservacion=[],
  abrirReiterada,
  abrirInfancia,
  abrirDetalle,
  listarOrdenes
) {

  const columnasGeneral = [
    {
      averias: true,
      altas: true,
      title: '#',
      width: 50,
      fixed: 'left',
      render: (_,__,i) => i+1
    },
    {
      averias: true,
      altas: true,
      title: 'Requerimiento',
      dataIndex: 'codigo_requerimiento',
      width: 140,
      fixed: 'left',
      render: (req, row) => {
        if (row.subtipo_actividad && ordenesB2B.includes(row.subtipo_actividad)) {
          return <Text copyable strong style={{ color: '#003055'}}><Tag color="#108ee9" style={{ fontSize: '1rem' }}>{req}</Tag></Text>
        } else {
          return <Text copyable strong>{req}</Text>
        }
      },
    },
    {
      averias: false,
      altas: true,
      title: 'Orden Trabajo',
      dataIndex: 'codigo_trabajo',
      width: 120,
      render: (req) => <Text copyable>{req}</Text>
    },
    {
      averias: false,
      altas: true,
      title: 'Peticion',
      dataIndex: 'codigo_peticion',
      width: 120,
      render: (req) => <Text copyable>{req}</Text>
    },
    {
      averias: true,
      altas: true,
      title: 'Codigo Cliente',
      dataIndex: 'codigo_cliente',
      width: 120,
      render: (req) => <Text copyable>{req}</Text>
    },
    {
      averias: true,
      altas: true,
      title: 'Tecnologia',
      dataIndex: 'tipo_tecnologia',
      align: 'center',
      width: 120,
      filters: filtroTecnologia ? filtroTecnologia : [],
      onFilter: (v,r) => r.tipo_tecnologia.indexOf(v) === 0,
    },
    {
      averias: true,
      altas: true,
      title: 'CTR',
      dataIndex: 'codigo_ctr',
      width: 60,
      filters: filtroCtr ? filtroCtr : [],
      onFilter: (v,r) => String(r.codigo_ctr).indexOf(String(v)) === 0,
    },
    {
      averias: false,
      altas: true,
      title: 'Tipo Req.',
      dataIndex: 'tipo_requerimiento',
      align:'center',
      width: 100,
      filters: filtroTipoReq ? filtroTipoReq : [],
      onFilter: (v,r) => r.tipo_requerimiento.indexOf(v) === 0
    },
    {
      averias: true,
      altas: true,
      title: 'Nodo',
      dataIndex: 'codigo_nodo',
      width: 70,
      filters: filtroNodo ? filtroNodo : [],
      onFilter: (v,r) => r.codigo_nodo.indexOf(v) === 0,
    },
    {
      averias: true,
      altas: true,
      title: 'Troba',
      dataIndex: 'codigo_troba',
      width: 90,
      sorter: (a, b) => {
        if (a.codigo_troba < b.codigo_troba) {
          return -1;
        }
        if (a.codigo_troba > b.codigo_troba) {
          return 1;
        }
        return 0;
      },
      filters: filtroTroba ? filtroTroba : [],
      onFilter: (v,r) => r.codigo_troba.indexOf(v) === 0,
    },
    {
      averias: true,
      altas: false,
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
      averias: true,
      altas: false,
      title: 'Infancia',
      dataIndex: 'infancia',
      width: 90,
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
      averias: true,
      altas: false,
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
      averias: true,
      altas: true,
      title: 'Distrito',
      dataIndex: 'distrito',
      width: 160,
      filters: filtroDistrito ? filtroDistrito : [],
      onFilter: (v,r) => r.distrito.indexOf(v) === 0
    },
    {
      averias: true,
      altas: false,
      title: 'Dirección',
      dataIndex: 'direccion',
      width: 250,
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
      averias: true,
      altas: true,
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
      averias: true,
      altas: true,
      title: 'Estado Toa',
      dataIndex: 'estado_toa',
      width: 150,
      align: 'center',
      filters: filtroEstadoToa ? filtroEstadoToa : [],
      onFilter: (v,r) => r.estado_toa.indexOf(v) === 0,
      render: (e) => <TagEstado estado={e}/>
    },
    {
      averias: true,
      altas: true,
      title: 'Estado Gestor',
      dataIndex: 'estado_gestor',
      width: 150,
      align: 'center',
      filters: filtroEstadoGestor ? filtroEstadoGestor : [],
      onFilter: (v,r) => r.estado_gestor.indexOf(v) === 0,
      render: (e) => <TagEstado estado={e}/>
    },
    {
      averias: true,
      altas: true,
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
      averias: true,
      altas: true,
      title: 'Gestor Asignado',
      dataIndex: 'gestor_liteyca',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      filters: filtroGestorAsignado ? filtroGestorAsignado : [],
      onFilter: (v,r) => {
        if (v === '-') {
          return !r.gestor_liteyca
        } else if(r.gestor_liteyca) {
          return r.gestor_liteyca._id.indexOf(v) === 0
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
      averias: true,
      altas: true,
      title: 'Tecnico Toa',
      dataIndex: 'tecnico',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      filters: filtroTecnicoToa ? filtroTecnicoToa : [],
      onFilter: (v,r) => {
        if (v === '-') {
          return !r.tecnico
        } else if(r.tecnico) {
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
      averias: true,
      altas: true,
      title: 'Tecnico Asignado',
      dataIndex: 'tecnico_liteyca',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      filters: filtroTecnicoAsignado ? filtroTecnicoAsignado : [],
      onFilter: (v,r) => {
        if (v === '-') {
          return !r.tecnico_liteyca
        } else if(r.tecnico_liteyca) {
          return r.tecnico_liteyca._id.indexOf(v) === 0
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
      averias: true,
      altas: true,
      title: 'Observacion Gestor',
      dataIndex: 'observacion_gestor',
      width: 250,
      ellipsis: {
        showTitle: false,
      },
      filters: filtroObservacion ? filtroObservacion : [],
      onFilter: (v,r) => {
        if (v === '-') {
          return !r.observacion_gestor
        } else if(r.observacion_gestor) {
          return String(r.observacion_gestor).toLowerCase().replace(/ /g, "").indexOf(String(v).toLowerCase().replace(/ /g, "")) === 0
        } else {
          return false
        }
      },
      render: (o) => <Tooltip placement="topLeft" title={o}>{o} </Tooltip>
    },
    {
      averias: true,
      altas: true,
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
      averias: false,
      altas: true,
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
      averias: true,
      altas: true,
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
      averias: true,
      altas: true,
      title: 'Time Slot',
      dataIndex: 'tipo_agenda',
      width: 100,
      align: 'center',
      fixed: 'right',
      filters: filtroTimeSlot ? filtroTimeSlot.filter((e) => e.text) : [],
      onFilter: (v,r) => {
        if (r.tipo_agenda && v ) {
          return  r.tipo_agenda.indexOf(v) === 0;
        } else {
          return false;
        }
      },
      render: (ts) => {
        if (ts) {
          return <Tag color="#f50">{ts}</Tag>
        } else {
          return;
        }
      }
    },
    {//tcfl 24h
      averias: true,
      altas: false,
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
      render: (fecha, row) => <TagHoras fecha={fecha} tipo={tipoOrdenes.AVERIAS} tipoAgenda={row.tipo_agenda}/>
    },
    {//tcfl 72h
      averias: false,
      altas: true,
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
      render: (fecha, row) => <TagHoras fecha={fecha} tipo={tipoOrdenes.ALTAS} tipoAgenda={row.tipo_agenda}/>
    },
    {
      averias: true,
      altas: true,
      title: 'Acciones',
      dataIndex: '_id',
      width: 100,
      align: 'center',
      fixed: 'right',
      render: (id, row) => (
        <div>
          <PlusCircleTwoTone
            style={{ fontSize: '1.5rem', marginRight: '.5rem' }}
            onClick={() => abrirDetalle(id)}
          />
          <PopObservacion row={row} listarOrdenes={listarOrdenes}/>
        </div>
      )
    }
  ]

  const columnasAverias = columnasGeneral.filter(e => e.averias);

  const columnasAltas = columnasGeneral.filter(e => e.altas);

  switch (tipo) {
    case tipoOrdenes.AVERIAS:
      return columnasAverias;  
    case tipoOrdenes.ALTAS:
      return columnasAltas;
    default:
      break;
  }
};