import React from 'react';

import TituloVista from '../../../components/common/TituloContent';
import Contenedor from '../../../components/common/Contenedor';
import ConfiguracionAreas from '../../../components/sistemas/confEmpleados/ConfiguracionAreas';

export default function Areas() {
  return (
    <div>
      <TituloVista titulo="Areas" subtitulo="Configuracion de Empleados"/>
      <Contenedor>
        <ConfiguracionAreas/>
      </Contenedor>
    </div>
  )
}
