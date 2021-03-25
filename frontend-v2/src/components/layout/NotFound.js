import React from 'react';
import { Button, Result  } from 'antd';

import Contenedor from '../common/Contenedor';
import { rutas } from '../../constants/listaRutas';


export default function NotFound() {

  return (
    <Contenedor>
      <Result
        status="403"
        title="403"
        subTitle="Lo sentimos, no tienes autorizacion para entrar a esta página."
        extra={<Button type="primary" onClick={() => window.location.pathname = rutas.resumenGeneral}>Inicio</Button>}
      />
    </Contenedor>
  )
};
