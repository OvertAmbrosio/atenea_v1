import { Tag } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import React from 'react';

import { niveles } from '../../../constants/cargos';
import capitalizar from '../../../libraries/capitalizar'
import colores from '../../../constants/colores';
import estadoEmpleado from '../../../constants/estadoEmpleado';

export function CargoTag({nivel, cargo}) {
  switch (nivel) {
    case niveles.ROOT:
      return (<Tag color="geekblue">{capitalizar(cargo)}</Tag>)
    case niveles.ADMINISTRADOR:
      return (<Tag color="blue">{capitalizar(cargo)}</Tag>)
    case niveles.JEFES_AREA:
      return (<Tag color="cyan">{capitalizar(cargo)}</Tag>)
    case niveles.JEFES_PERSONAL:
      return (<Tag color="purple">{capitalizar(cargo)}</Tag>)
    case niveles.JEFES_MINI_PERSONAL:
      return (<Tag color="green">{capitalizar(cargo)}</Tag>)
    case niveles.BACK_OFFICE:
      return (<Tag color="orange">{capitalizar(cargo)}</Tag>)
    case niveles.OPERATIVO:
      return (<Tag color="magenta">{capitalizar(cargo)}</Tag>)
    case niveles.FUERA_SISTEMA:
      return (<Tag>{capitalizar(cargo)}</Tag>)
    default:
      return (<Tag>Sin cargo</Tag>)
  }
};

export function EstadoTag({estado}) {
  switch (estado) {
    case estadoEmpleado.ACTIVO: 
      return (<Tag icon={<CheckCircleOutlined/>} color={colores.success}>{estado}</Tag>);
    case estadoEmpleado.SUSPENDIDO:
      return (<Tag icon={<ExclamationCircleOutlined/>} color={colores.warning}>{estado}</Tag>)
    case estadoEmpleado.INACTIVO:
      return (<Tag icon={<CloseCircleOutlined />} color={colores.error}>{estado}</Tag>)
    default:
      return (<Tag>Desconocido</Tag>);
  }
}
