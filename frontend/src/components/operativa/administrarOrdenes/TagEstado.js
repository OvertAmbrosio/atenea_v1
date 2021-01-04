import React from 'react'
import PropTypes from 'prop-types'
import { Tag } from 'antd';
import capitalizar from '../../../libraries/capitalizar';

function TagEstado({estado}) {
  switch (estado) {
    case 'cancelado':
      return <Tag>{capitalizar(estado)}</Tag>
    case 'completado':
      return <Tag color="success">{capitalizar(estado)}</Tag>
    case 'agendado':
      return <Tag color="purple">{capitalizar(estado)}</Tag>
    case 'asignado':
      return <Tag color="cyan">{capitalizar(estado)}</Tag>
    case 'iniciado':
      return <Tag color="geekblue">{capitalizar(estado)}</Tag>
    case 'no realizada':
      return <Tag color="magenta">{capitalizar(estado)}</Tag>
    case 'pendiente':
      return <Tag color="orange">{capitalizar(estado)}</Tag>
    case 'suspendido':
      return <Tag color="red">{capitalizar(estado)}</Tag>
    default:
      return <Tag>-</Tag>
  }
}

TagEstado.propTypes = {
  estado: PropTypes.string
}

export default TagEstado

