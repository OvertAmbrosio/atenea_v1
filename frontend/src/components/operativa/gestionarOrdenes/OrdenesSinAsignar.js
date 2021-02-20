import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'antd';
import { LoadingOutlined, ReloadOutlined, UserSwitchOutlined } from '@ant-design/icons';

import TablaOrdenes from './TablaOrdenes';
import ModalRegistro from '../administrarOrdenes/ModalsTabla/ModalRegistro';
import ModalInfancia from '../administrarOrdenes/ModalsTabla/ModalInfancia';
import ModalReiterada from '../administrarOrdenes/ModalsTabla/ModalReiterada';
import { getOrdenes, patchOrdenes } from '../../../services/apiOrden';
import { ordenes, ordenes as ordenesMetodo } from '../../../constants/metodos';
import ModalAsignar from '../administrarOrdenes/ModalsTabla/ModalAsignar';
import cogoToast from 'cogo-toast';

const { Search } = Input;

function OrdenesSinAsignar({gestores=[], tecnicos=[]}) {
  const [listaOrdenes, setListaOrdenes] = useState([]);
  const [dataOrdenes, setDataOrdenes] = useState([]);
  const [loadingOrdenes, setLoadingOrdenes] = useState(false);
  const [dataRegistros, setDataRegistros] = useState([]);
  const [dataInfancia, setDataInfancia] = useState([]);
  const [ordenesSeleccionadas, setOrdenesSeleccionadas] = useState([]);
  const [loadingRegistro, setLoadingRegistro] = useState(false);
  const [loadingAsignar, setLoadingAsignar] = useState(false);
  const [modalReiterada, setModalReiterada] = useState(false);
  const [modalInfancia, setModalInfancia] = useState(false);
  const [modalRegistro, setModalRegistro] = useState(false);
  const [modalAsignar, setModalAsignar] = useState(false);
  const [codigoCliente, setCodigoCliente] = useState(null);

  useEffect(() => {
    listarOrdenes()
  }, []);

  useEffect(() => {
    if (listaOrdenes.length>0) {
      setDataOrdenes(listaOrdenes);
    }
  // eslint-disable-next-line
  },[listaOrdenes]);

  async function listarOrdenes() {
    setLoadingOrdenes(true);
    return await getOrdenes(true, { metodo: ordenesMetodo.ORDENES_HOY_GESTOR, todo: false })
      .then(({data}) => {
        if(data) setListaOrdenes(data);
      }).catch((err) => console.log(err)).finally(() => setLoadingOrdenes(false));
  };

  async function buscarInfancia(infancia) {
    setDataInfancia([infancia]);
  };

  async function buscarRegistro(id_orden) {
    setLoadingRegistro(true);
    await getOrdenes( true, { metodo: ordenesMetodo.BUSCAR_REGISTROS, id: id_orden })
      .then(({data}) => {
        if (data && data.length > 0) {
          setDataRegistros(data);
        }
      }).catch((err) => console.log(err)).finally(() => setLoadingRegistro(false));
  };

  const abrirModalReiterada = () => setModalReiterada(!modalReiterada);
  const abrirModalInfancia = () => setModalInfancia(!modalInfancia);
  const abrirModalRegistro = () => setModalRegistro(!modalRegistro);
  const abrirModalAsignar = () => setModalAsignar(!modalAsignar);
 
  const abrirReiterada = (c) => {
    setCodigoCliente(c);
    abrirModalReiterada();
  };

  const abrirInfancia = async (id) => {
    abrirModalInfancia();
    await buscarInfancia(id);
  };

  const abrirRegistro = async (id) => {
    abrirModalRegistro();
    await buscarRegistro(id);
  };

  async function asignarOrdenes(data) {
    if (ordenesSeleccionadas && ordenesSeleccionadas.length > 0) {
      const auxData = data;
      setLoadingAsignar(true);
      abrirModalAsignar();
      await patchOrdenes({
        metodo: ordenes.ASIGNAR_ORDEN, ordenes: ordenesSeleccionadas, ...auxData
      }).then(async() => await listarOrdenes()).catch((err) => console.log(err)).finally(() => setLoadingAsignar(false));
    } else {
      cogoToast.warn('No hay ordenes seleccionadas.', { position: 'top-right' })
    }
  };

  function buscarRequerimiento(e) {
    if (e && e.length > 1) {
      setDataOrdenes(listaOrdenes.filter((o) => String(o.codigo_requerimiento).includes(e)))
    } else {
      setDataOrdenes(listaOrdenes);
    }
  };

  return (
    <div style={{ marginBottom: '.5rem', marginTop: '1rem' }}>
      <div>
        <Button 
          type="primary"
          icon={loadingOrdenes ? <LoadingOutlined spin/>:<ReloadOutlined/>}
          style={{ marginBottom: '1rem', marginRight: '.5rem' }}
          onClick={listarOrdenes}
        >Actualizar</Button>
        <Button 
          icon={loadingAsignar ? <LoadingOutlined spin/>:<UserSwitchOutlined/>}
          style={{ marginBottom: '1rem', marginRight: '.5rem' }}
          disabled={ordenesSeleccionadas.length === 0}
          onClick={abrirModalAsignar}
        >Asignar</Button>  
        <Search
          placeholder="Requerimiento..." 
          onSearch={buscarRequerimiento} 
          style={{ width: 180, marginRight: '.5rem' }} 
          allowClear 
        />      
      </div>
      <TablaOrdenes
        data={dataOrdenes} 
        loading={loadingOrdenes} 
        ordenesSeleccionadas={ordenesSeleccionadas} 
        setOrdenesSeleccionadas={setOrdenesSeleccionadas}
        abrirReiterada={abrirReiterada}
        abrirInfancia={abrirInfancia}
        abrirRegistro={abrirRegistro}
      />
      {/* MODAL PARA ASIGNAR CONTRATA, GESTOR O TECNICO */}
      <ModalAsignar tipo={true} visible={modalAsignar} abrir={abrirModalAsignar} gestores={gestores} tecnicos={tecnicos} asignar={asignarOrdenes}/>
      {/* MODAL PARA BUSCAR LA REITERADA */}
      <ModalReiterada visible={modalReiterada} abrir={abrirModalReiterada} codigo_cliente={codigoCliente}/>
      {/* MODAL PARA BUSCAR LA INFANCIA */}
      <ModalInfancia visible={modalInfancia} abrir={abrirModalInfancia} loading={false} orden={dataInfancia} />
      {/* MODAL DETALLE PARA VER EL HISTORIAL DE CAMBIOS */}
      <ModalRegistro visible={modalRegistro} abrir={abrirModalRegistro} loading={loadingRegistro} registros={dataRegistros}/>
    </div>
  )
};

OrdenesSinAsignar.propTypes = {
  gestores: PropTypes.array,
  tecnicos: PropTypes.array,
  loadingTecnicos: PropTypes.bool
};

export default OrdenesSinAsignar;
