import { Tag } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import React from 'react';
import cargos from '../../../constants/cargos';
import colores from '../../../constants/colores';
import estadoEmpleado from '../../../constants/estadoEmpleado';

export function CargoTag({cargo}) {
  switch (cargo) {
    case cargos.ADMINISTRADOR:
      return (<Tag color="geekblue">Administrador</Tag>)
    case cargos.JEFE_OPERACIONES:
      return (<Tag color="blue">Jefe de Operaciones</Tag>)
    case cargos.JEFE_LOGISTICA:
      return (<Tag color="cyan">Jefe de Logistica</Tag>)
    case cargos.LIDER_GESTION:
      return (<Tag color="purple">Lider de Gestion</Tag>)
    case cargos.ASISTENTE_LOGISTICA:
      return (<Tag color="green">Asistente de Logistica</Tag>)
    case cargos.JEFE_CONTRATA:
      return (<Tag color="orange">Jefe de Contrata</Tag>)
    case cargos.GESTOR:
      return (<Tag color="magenta">Gestor</Tag>)
    case cargos.ALMACENERO:
      return (<Tag color="red">Almacenero</Tag>)
    case cargos.AUDITOR:
      return (<Tag color="gold">Auditor</Tag>)
    case cargos.TECNICO:
      return (<Tag color="volcano">Tecnico</Tag>)
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
