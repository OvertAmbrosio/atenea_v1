import React from 'react';
import PropTypes from 'prop-types';

import { niveles } from '../../../constants/cargos';
import ExcelAsistenciaDefault from './ExcelAsistenciaDefault';
import ExcelAsistenciaTecnico from './ExcelAsistenciaTecnico';
import ExcelAsistenciaSemillero from './ExcelAsistenciaSemillero';

function Index({nivel, data=[], dias=[], cargo }) {
  if (nivel && nivel <= niveles.BACK_OFFICE) {
    return <ExcelAsistenciaDefault data={data} dias={dias} nombre={cargo}/>
  } else if (nivel && nivel === niveles.OPERATIVO) {
    return <ExcelAsistenciaTecnico data={data} dias={dias} nombre="tecnico"/>
  } else if (nivel && nivel === niveles.FUERA_SISTEMA) {
    return <ExcelAsistenciaSemillero data={data} dias={dias} nombre={cargo}/>
  } else {
    return null;
  }
};

Index.propTypes = {
  nivel: PropTypes.number,
  data: PropTypes.array,
  dias: PropTypes.array,
  cargo: PropTypes.string
}

export default Index

