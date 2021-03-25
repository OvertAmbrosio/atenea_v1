import React from 'react';
import { Tag, Tooltip, Typography } from 'antd';
import { PlusCircleTwoTone } from '@ant-design/icons'
import moment from 'moment';

import TagEstado from '../../administrarOrdenes/TagEstado';
import PopObservacion from '../../administrarOrdenes/columnas/PopObservacion';
import capitalizar from '../../../../libraries/capitalizar';
import { ordenesB2B } from '../../../../constants/valoresToa';
import TagHoras from '../../../common/TagHoras';

const { Text } = Typography;

export default function columnasSinBandejaGestor(
  filtroDistrito=[],
  filtroTipo=[],
  filtroBucket=[],
  filtroEstadoToa=[],
  filtroEstadoGestor=[],
  filtroContrata=[], 
  filtroTecnico=[],
  filtroTecnicoAsignado=[],
  filtroTipoRequerimiento=[],
  filtroTipoTecnologia=[],
  filtroCtr=[],
  filtroNodo=[],
  filtroTroba=[],
  filtroTimeSlot=[],
  abrirReiterada,
  abrirInfancia,
  abrirRegistro,
  listarOrdenes
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
      render: (req, row) => {
        if (row.subtipo_actividad && ordenesB2B.includes(row.subtipo_actividad)) {
          return {
            props: {
              style: { background: "#CCE9FF" },
            },
            children: <Text copyable strong style={{ color: '#003055'}}>{req}</Text>,
          };
        } else {
          return <Text copyable strong>{req}</Text>
        }
      },
    },
    {
      title: 'Codigo Cliente',
      dataIndex: 'codigo_cliente',
      width: 120,
      fixed: 'left',
      render: (req) => <Text copyable>{req}</Text>
    },
    {
      title: 'Tipo Req.',
      dataIndex: 'tipo_requerimiento',
      width: 120,
      align: 'center',
      filters: filtroTipoRequerimiento ? filtroTipoRequerimiento : [],
      onFilter: (v,r) => r.tipo_requerimiento.indexOf(v) === 0
    },
    {
      title: 'Tecnologia',
      dataIndex: 'tipo_tecnologia',
      width: 120,
      filters: filtroTipoTecnologia ? filtroTipoTecnologia : [],
      onFilter: (v,r) => r.tipo_tecnologia.indexOf(v) === 0
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
      title: 'CTR',
      dataIndex: 'codigo_ctr',
      width: 60,
      filters: filtroCtr ? filtroCtr : [],
      onFilter: (v,r) => String(r.codigo_ctr).indexOf(String(v)) === 0,
    },
    {
      title: 'Nodo',
      dataIndex: 'codigo_nodo',
      width: 75,
      filters: filtroNodo ? filtroNodo : [],
      onFilter: (v,r) => String(r.codigo_nodo).indexOf(String(v)) === 0,
    },
    {
      title: 'Troba',
      dataIndex: 'codigo_troba',
      width: 90,
      filters: filtroTroba ? filtroTroba : [],
      onFilter: (v,r) => String(r.codigo_troba).indexOf(String(v)) === 0,
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
      title: 'Tecnico TOA',
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
        } else if( r.tecnico_liteyca !== undefined) {
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
      title: 'Observacion Gestor',
      dataIndex: 'observacion_gestor',
      width: 250,
      ellipsis: {
        showTitle: false,
      },
      render: (o) => <Tooltip placement="topLeft" title={o}>{o} </Tooltip>
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
      render: (fecha, row) => <TagHoras fecha={fecha} tipo={row.tipo} tipoAgenda={row.tipo_agenda}/>
    },
    {
      title: 'Acciones',
      dataIndex: '_id',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (id, row) => (
        <div>
          <PlusCircleTwoTone
            style={{ fontSize: '1.5rem', marginRight: '.5rem' }}
            onClick={() => abrirRegistro(id)}
          />
          <PopObservacion row={row} listarOrdenes={listarOrdenes}/>
        </div>
      )
    }
  ];
};