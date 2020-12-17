import React from 'react';

import TituloContent from '../../components/common/TituloContent';
import TablaContratas from '../../components/gestionEmpleados/contrata/TablaContratas';

export default function ListaContratas() {
  return (
    <div>
      <TituloContent titulo="Lista de Contratas" subtitulo="Usuarios y Personal"/>
      <TablaContratas/>
    </div>
  )
}
