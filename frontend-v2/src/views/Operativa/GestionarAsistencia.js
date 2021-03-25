import React from 'react';

import TituloContent from '../../components/common/TituloContent';
import Contenedor from '../../components/common/Contenedor';
import TablaAsistenciaCargo from '../../components/operativa/listaRutas/asistencias/TablaAsistenciaCargo';

export default function Asistencias() {
  return (
    <div>
      <TituloContent titulo="Lista de Rutas" subtitulo="Operativa"/>
      <Contenedor>
        <TablaAsistenciaCargo gestor={true}/>
      </Contenedor>
    </div>
  )
}
