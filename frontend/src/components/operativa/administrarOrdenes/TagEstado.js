import React from 'react'
import PropTypes from 'prop-types'
import { Tag } from 'antd';
import capitalizar from '../../../libraries/capitalizar';
import { listaEstadosGestor } from '../../../constants/valoresOrdenes';

function TagEstado({estado}) {
  switch (estado) {
    case 'cancelado':
      return <Tag>{capitalizar(estado)}</Tag>
    case 'completado':
      return <Tag color="success">{capitalizar(estado)}</Tag>
    case listaEstadosGestor.LIQUIDADO:
      return <Tag color="success">{capitalizar(estado)}</Tag>
    case listaEstadosGestor.AGENDADO:
      return <Tag color="blue">{capitalizar(estado)}</Tag>
    case listaEstadosGestor.ASIGNADO:
      return <Tag color="cyan">{capitalizar(estado)}</Tag>
    case 'iniciado':
      return <Tag color="geekblue">{capitalizar(estado)}</Tag>
    case 'no realizada':
      return <Tag color="magenta">{capitalizar(estado)}</Tag>
    case listaEstadosGestor.PENDIENTE:
      return <Tag color="orange">{capitalizar(estado)}</Tag>
    case listaEstadosGestor.SUSPENDIDO:
      return <Tag color="red">{capitalizar(estado)}</Tag>
    case listaEstadosGestor.REMEDY:
      return <Tag color="red">{capitalizar(estado)}</Tag>
    case listaEstadosGestor.PEXT:
      return <Tag color="purple">{String(estado).toUpperCase()}</Tag>
    case listaEstadosGestor.MASIVO:
      return <Tag color="purple">{String(estado).toUpperCase()}</Tag>
    case 'efectiva':
      return <Tag color="green">{capitalizar(estado)}</Tag>
    case 'inefectiva':
      return <Tag color="red">{capitalizar(estado)}</Tag>
    default:
      return <Tag>-</Tag>
  }
}

TagEstado.propTypes = {
  estado: PropTypes.string
}

export default TagEstado

