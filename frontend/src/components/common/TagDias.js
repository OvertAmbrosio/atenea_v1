import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Tag } from 'antd';

function TagDias({fecha}) {
  let dias = moment().diff(fecha, 'days');
  if (fecha && moment(fecha).isValid()){
    return <Tag color={dias >= 3 ? 'error' : dias < 3 && dias >= 2 ? 'warning' : dias < 2 && dias >= 1 ? 'lime' : dias < 1 ? 'success' : ''}>{dias}</Tag>
  } else {
    return <Tag color="blue">-</Tag>
  };
};

TagDias.propTypes = {
  fecha: PropTypes.any
};

export default TagDias;

