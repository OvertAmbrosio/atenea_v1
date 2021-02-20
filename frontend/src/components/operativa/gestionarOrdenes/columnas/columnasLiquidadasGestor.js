import React from 'react';
import { Tag, Tooltip, Typography } from 'antd';
import { PlusCircleTwoTone } from '@ant-design/icons'
import moment from 'moment';

import TagEstado from '../../administrarOrdenes/TagEstado';
import { tipoOrdenes } from '../../../../constants/tipoOrden';
import PopObservacion from '../../administrarOrdenes/columnas/PopObservacion';

const { Text } = Typography;

export default function columnasLiquidadasGestor(
  filtroDistrito=[],
  filtroEstadoToa=[],
  filtroEstadoGestor=[],
  filtroContrata=[], 
  filtroTecnologia=[],
  filtroNodo=[],
  filtroCtr=[],
  filtroTecnico=[],
  filtroTimeSlot=[],
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
      title: 'Negocio',
      dataIndex: 'tipo',
      width: 100,
      fixed: 'left',
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
      title: 'Tecnologia',
      dataIndex: 'tipo_tecnologia',
      align: 'center',
      width: 120,
      filters: filtroTecnologia ? filtroTecnologia : [],
      onFilter: (v,r) => r.tipo_tecnologia.indexOf(v) === 0,
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
      width: 70,
      filters: filtroNodo ? filtroNodo : [],
      onFilter: (v,r) => r.codigo_nodo.indexOf(v) === 0,
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
      title: 'Tecnico Liquidado',
      dataIndex: 'tecnico_liquidado',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      filters: filtroTecnico ? filtroTecnico : [],
      onFilter: (v,r) => {
        if (v === '-') {
          return !r.tecnico_liquidado
        } else if( r.tecnico_liquidado ) {
          return r.tecnico_liquidado._id.indexOf(v) === 0
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
      title: 'Usuario Liquidado',
      dataIndex: 'codigo_usuario_liquidado',
      width: 150,
    },
    {
      title: 'Tipo Averia',
      dataIndex: 'tipo_averia',
      width: 150,
    },
    {
      title: 'Descripción Liquidado',
      dataIndex: 'descripcion_codigo_liquidado',
      width: 250,
    },
    {
      title: 'Observación Gestor',
      dataIndex: 'observacion_gestor',
      width: 250,
    },
    {
      title: 'Observación Liquidado',
      dataIndex: 'observacion_liquidado',
      width: 250,
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
      render: (fecha, row) => {
        if (!row.fecha_cita && fecha) {
          if (row.tipo === tipoOrdenes.ALTAS && row.fecha_asignado) {
            let horas = moment().diff(row.fecha_asignado, 'hours')
            return <Tag color={horas >= 72 ? 'error' : horas < 72 && horas >= 24 ? 'warning' : horas < 24 ? 'success' : ''}>{horas}</Tag>
          } else if (row.tipo === tipoOrdenes.AVERIAS) {
            let horas = moment().diff(fecha, 'hours')
            return <Tag color={horas >= 24 ? 'error' : horas < 24 && horas >= 12 ? 'warning' : horas < 12 ? 'success' : ''}>{horas}</Tag>
          } else {
            return <Tag>-</Tag>
          }
        } else {
          return <Tag color="blue">{moment().diff(fecha, 'hours')}</Tag>
        }
      }
    },
    {
      title: 'Acciones',
      dataIndex: '_id',
      width: 100,
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