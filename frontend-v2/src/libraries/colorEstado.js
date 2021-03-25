import * as AntColores from '@ant-design/colors'
import { tipoOrdenes } from '../constants/tipoOrden';

import { listaEstadosGestor } from "../constants/valoresOrdenes";

export const colorEstado = (estado) => {
  switch (estado) {
    case 'cancelado':
      return {background: AntColores.grey[1], color: AntColores.grey.primary};
    case 'completado':
      return {background: AntColores.green[1], color: AntColores.green.primary};
    case listaEstadosGestor.LIQUIDADO:
      return {background: AntColores.green[1], color: AntColores.green.primary};
    case listaEstadosGestor.AGENDADO:
      return {background: AntColores.blue[1], color: AntColores.blue.primary};
    case listaEstadosGestor.ASIGNADO:
      return {background: AntColores.cyan[1], color: AntColores.cyan.primary};
    case 'iniciado':
      return {background: AntColores.geekblue[1], color: AntColores.geekblue.primary};
    case 'no realizada':
      return {background: AntColores.magenta[1], color: AntColores.magenta.primary};
    case listaEstadosGestor.PENDIENTE:
      return {background: AntColores.orange[1], color: AntColores.orange.primary};
    case listaEstadosGestor.SUSPENDIDO:
      return {background: AntColores.red[1], color: AntColores.red.primary};
    case listaEstadosGestor.REMEDY:
      return {background: AntColores.red[1], color: AntColores.red.primary};
    case listaEstadosGestor.PEXT:
      return {background: AntColores.purple[1], color: AntColores.purple.primary};
    case listaEstadosGestor.MASIVO:
      return {background: AntColores.purple[1], color: AntColores.purple.primary};
    case 'efectiva':
      return {background: AntColores.green[1], color: AntColores.green.primary};
    case 'inefectiva':
      return {background: AntColores.red[1], color: AntColores.red.primary};
    case 'no_corresponde':
      return {background: '#DBDBDB', color: AntColores.grey.primary};
    default:
      return {background: '', color: ''};
  };
};

export const colorHora = (hora, tipo, fechaCita) => {
  if (fechaCita && fechaCita !== '-') {
    return {background: AntColores.blue[1], color: AntColores.blue.primary};
  } else {
    if (tipo === tipoOrdenes.AVERIAS) {
      if (Number(hora) < 12) {
        return {background: AntColores.green[1], color: AntColores.green.primary};
      } else if (Number(hora) >= 12 && Number(hora) < 24 ) {
        return {background: AntColores.orange[1], color: AntColores.orange.primary};
      } else if (Number(hora) >= 24) {
        return {background: AntColores.red[1], color: AntColores.red.primary};
      } else {
        return {background: '', color: '' };
      }
    } else if ((tipo === tipoOrdenes.ALTAS)){
      if (Number(hora) < 24) {
        return {background: AntColores.green[1], color: AntColores.green.primary};
      } else if (Number(hora) >= 24 && Number(hora) < 72 ) {
        return {background: AntColores.orange[1], color: AntColores.orange.primary};
      } else if (Number(hora) >= 72) {
        return {background: AntColores.red[1], color: AntColores.red.primary};
      } else {
        return {background: '', color: '' };
      }
    } else {
      return {background: '', color: '' };
    }
  }
};

export const colorDia = (dia, fechaCita) => {
  if (fechaCita && fechaCita !== '-') {
    return {background: AntColores.blue[1], color: AntColores.blue.primary};
  } else {
    if (Number(dia) < 1) {
      return {background: AntColores.green[1], color: AntColores.green.primary};
    } else if (Number(dia) >= 1 && Number(dia) < 5 ) {
      return {background: AntColores.orange[1], color: AntColores.orange.primary};
    } else if (Number(dia) >= 5) {
      return {background: AntColores.red[1], color: AntColores.red.primary};
    } else {
      return {background: '', color: '' };
    }
  }
};