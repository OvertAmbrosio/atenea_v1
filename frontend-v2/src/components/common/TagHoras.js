import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Tag } from 'antd';
import { tipoOrdenes } from '../../constants/tipoOrden';

function TagHoras({fecha, tipo, tipoAgenda}) {
  let horas = moment().diff(fecha, 'hours');
  if (tipoAgenda && String(tipoAgenda).length > 1 && fecha) {
    return <Tag color="blue">{horas}</Tag>
  } else if (!tipoAgenda || String(tipoAgenda).length < 2){
    if (fecha && tipo === tipoOrdenes.ALTAS) {
      return <Tag color={horas >= 72 ? 'error' : horas < 72 && horas >= 24 ? 'warning' : horas < 24 ? 'success' : ''}>{horas}</Tag>
    } else if (fecha && tipo === tipoOrdenes.AVERIAS){
      return <Tag color={horas >= 24 ? 'error' : horas < 24 && horas >= 12 ? 'warning' : horas < 12 ? 'success' : ''}>{horas}</Tag>
    } else {
      return <Tag>-</Tag>
    }
  } else {
    return <Tag color="blue">-</Tag>
  }
};

TagHoras.propTypes = {
  fecha: PropTypes.any,
  tipo: PropTypes.string,
  tipoAgenda: PropTypes.any
};

export default TagHoras;

