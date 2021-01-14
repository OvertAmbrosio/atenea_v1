import React, { useState, useEffect } from 'react';

import Contenedor from '../../../components/common/Contenedor';
import TituloVista from '../../../components/common/TituloContent';
import ListaOrdenesGestor from '../../../components/operativa/gestionarOrdenes/ListaOrdenesGestor';
import { empleados, ordenes } from '../../../constants/metodos';
import { getOrdenes } from '../../../services/apiOrden';
import { getEmpleados } from '../../../services/apiEmpleado';

export default function ListaOrdenes() {
  const [listaOrdenes, setListaOrdenes] = useState([]);
  const [listaTecnicos, setListaTecnicos] = useState([]);
  const [loadingOrdenes, setLoadingOrdenes] = useState(false);
  const [loadingTecnicos, setLoadingTecnicos] = useState(false);

  useEffect(() => {
    listarTecnicos();
    listarOrdenes();
  }, []);

  async function listarOrdenes() {
    setLoadingOrdenes(true);
    return await getOrdenes(true, { metodo: ordenes.ORDENES_HOY_GESTOR })
      .then(({data}) => {
        if(data) setListaOrdenes(data);
      }).catch((err) => console.log(err)).finally(() => setLoadingOrdenes(false));
  };

  async function listarTecnicos() {
    setLoadingTecnicos(true);
    return await getEmpleados(false, { metodo: empleados.LISTA_TECNICOS_GESTOR })
      .then(({data}) => {
        if(data) setListaTecnicos(data);
      }).catch((err) => console.log(err)).finally(() => setLoadingTecnicos(false));
  }

  return (
    <div>
      <TituloVista titulo="Lista de Ordenes" subtitulo="Gestionar Ordenes"/>
      <Contenedor>
        <ListaOrdenesGestor ordenes={listaOrdenes} loadingOrdenes={loadingOrdenes} tecnicos={listaTecnicos} loadingTecnicos={loadingTecnicos} listarOrdenes={listarOrdenes}/>
      </Contenedor>
    </div>
  )
}
