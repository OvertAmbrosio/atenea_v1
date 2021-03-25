import React from 'react';

import Contenedor from '../../../components/common/Contenedor';
import TituloVista from '../../../components/common/TituloContent';
import ConfiguracionCargo from '../../../components/sistemas/confEmpleados/ConfiguracionCargos';

export default function Cargos() {
  return (
    <div>
      <TituloVista titulo="Cargos" subtitulo="Configuracion de Empleados"/>
      <Contenedor>
        <ConfiguracionCargo/>
      </Contenedor>
    </div>
  )
}
