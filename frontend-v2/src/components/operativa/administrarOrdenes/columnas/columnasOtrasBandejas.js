import React from 'react';
import { Tag, Tooltip, Typography } from 'antd';
import { PlusCircleTwoTone } from '@ant-design/icons'
import moment from 'moment';

import TagEstado from '../TagEstado';
import { tipoOrdenes } from '../../../../constants/tipoOrden';
import PopObservacion from './PopObservacion';

const { Text } = Typography;

export default function columnasOtrasBandejas(
  tipo,
  filtroDistrito=[],
  filtroEstadoToa=[],
  filtroEstadoGestor=[],
  filtroTipoReq=[],
  filtroTecnologia=[],
  filtroNodo=[],
  filtroCtr=[],
  abrirDetalle,
  listarOrdenes
) {

  const columnasGenerales = [
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
      width: 120,
      fixed: 'left',
      render: (req) => <Text copyable>{req}</Text>
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
      averias: true,
      altas: true,
      title: 'Descripción CTR',
      dataIndex: 'descripcion_ctr',
      width: 150,
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
      altas: false,
      title: 'Estado Liquidado',
      dataIndex: 'estado_liquidado',
      width: 150,
      align: 'center',
      render: (e) => <TagEstado estado={e}/>
    },
    {
      averias: true,
      altas: true,
      title: 'Tecnico Liquidado',
      dataIndex: 'nombre_liquidado',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (t) => (
        <Tooltip placement="topLeft" title={t}>
          {t}
        </Tooltip>
      )
    },
    {
      averias: true,
      altas: true,
      title: 'Carnet',
      dataIndex: 'carnet_liquidado',
      width: 100
    },
    {
      averias: true,
      altas: false,
      title: 'Tipo Averia',
      dataIndex: 'tipo_averia',
      width: 150,
    },
    {
      averias: true,
      altas: true,
      title: 'Descripción Liquidado',
      dataIndex: 'descripcion_codigo_liquidado',
      width: 250,
    },
    {
      averias: true,
      altas: true,
      title: 'Observación Gestor',
      dataIndex: 'observacion_gestor',
      width: 250,
    },
    {
      averias: true,
      altas: true,
      title: 'Observación Liquidado',
      dataIndex: 'observacion_liquidado',
      width: 250,
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
      title: 'Fecha Liquidado',
      dataIndex: 'fecha_liquidado',
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
      altas: false,
      title: 'Plazo 24h',
      dataIndex: 'fecha_registro',
      width: 100,
      align: 'center',
      fixed: 'right',
      sorter: (a, b) => {
        if (!a.fecha_liquidado) {
          if (moment().diff(a.fecha_registro, 'hours') < moment().diff(b.fecha_registro, 'hours')) {
            return -1;
          } else if (moment().diff(a.fecha_registro, 'hours') > moment().diff(b.fecha_registro, 'hours')) {
            return 1;
          }
        } else if (moment(a.fecha_liquidado).diff(a.fecha_registro, 'hours') < moment(a.fecha_liquidado).diff(b.fecha_registro, 'hours')) {
          return -1;
        }
        if (moment(a.fecha_liquidado).diff(a.fecha_registro, 'hours') > moment(a.fecha_liquidado).diff(b.fecha_registro, 'hours')) {
          return 1;
        }
        return 0;
      },
      render: (fecha, row) => {
        if (!row.fecha_liquidado) {
          let horas = moment().diff(fecha, 'hours');
          return <Tag>{horas}</Tag>
        } else if (fecha) {
          let horas = moment(row.fecha_liquidado).diff(fecha, 'hours');
          return <Tag color={row.agenda ? 'geekblue' : horas < 24 ? 'success': horas === 24 ? 'warning' :  'error' }>{horas}</Tag>
        } else {
          return <Tag>-</Tag>
        }
      }
    },
    {
      averias: false,
      altas: true,
      title: 'Plazo 72h',
      dataIndex: 'fecha_registro',
      width: 100,
      align: 'center',
      fixed: 'right',
      sorter: (a, b) => {
        if (!a.fecha_liquidado) {
          if (moment().diff(a.fecha_registro, 'hours') < moment().diff(b.fecha_registro, 'hours')) {
            return -1;
          } else if (moment().diff(a.fecha_registro, 'hours') > moment().diff(b.fecha_registro, 'hours')) {
            return 1;
          }
        } else if (moment(a.fecha_liquidado).diff(a.fecha_registro, 'hours') < moment(a.fecha_liquidado).diff(b.fecha_registro, 'hours')) {
          return -1;
        }
        if (moment(a.fecha_liquidado).diff(a.fecha_registro, 'hours') > moment(a.fecha_liquidado).diff(b.fecha_registro, 'hours')) {
          return 1;
        }
        return 0;
      },
      render: (fecha, row) => {
        if (!row.fecha_liquidado) {
          let horas = moment().diff(fecha, 'hours');
          return <Tag>{horas}</Tag>
        } else if (fecha) {
          let horas = moment(row.fecha_liquidado).diff(fecha, 'hours');
          return <Tag color={row.agenda ? 'blue' : horas < 72 ? 'success': horas === 72 ? 'warning' :  'error' }>{horas}</Tag>
        } else {
          return <Tag>-</Tag>
        }
      }
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

  const columnasAverias = columnasGenerales.filter(e => e.averias);

  const columnasAltas = columnasGenerales.filter(e => e.altas);

  switch (tipo) {
    case tipoOrdenes.AVERIAS:
      return columnasAverias;  
    case tipoOrdenes.ALTAS:
      return columnasAltas;
    default:
      break;
  }
};