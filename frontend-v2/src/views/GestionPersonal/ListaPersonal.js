import React from 'react';

import TituloVista from '../../components/common/TituloContent';
import TablaEmpleados from '../../components/gestionEmpleados/personal/TablaEmpleados';

export default function ListaPersonal() {
  return (
    <div>
      <TituloVista
        titulo="Lista de Personal"
        subtitulo="Usuarios y Personal"
      />
      <TablaEmpleados/>
    </div>
  )
}
