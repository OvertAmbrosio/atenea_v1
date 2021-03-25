import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Input, Row, Space } from 'antd';
import { ScheduleOutlined, LoadingOutlined, FileSyncOutlined, UserSwitchOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';

import TablaOrdenes from './TablaOrdenes';

import { AuthToken } from '../../../services/authToken';
import variables from '../../../constants/config';


const { Search } = Input;

function OrdenesPendientesGestor({ordenes=[], gestores=[], tecnicos=[]}) {
  const [usuario] = useState(new AuthToken(Cookies.get(variables.TOKEN_STORAGE_KEY)).decodedToken);
  const [ordenesSeleccionadas, setOrdenesSeleccionadas] = useState([]);
  const [requerimiento, setRequerimiento] = useState(null);
  const [codigoCliente, setCodigoCliente] = useState(null);
  const [modalAgendar, setModalAgendar] = useState(false);
  const [modalAsignar, setModalAsignar] = useState(false);
  const [modalEstado, setModalEstado] = useState(false);
  const [loadingAgendar, setLoadingAgendar] = useState(false);
  const [loadingAsignar, setLoadingAsignar] = useState(false);
  const [loadingEstados, setLoadingEstados] = useState(false);

  const abrirModalAgendar = () => setModalAgendar(!modalAgendar);
  const abrirModalAsignar = () => setModalAsignar(!modalAsignar);
  const abrirModalEstado = () => setModalEstado(!modalEstado);


  return (
    <div style={{ marginBottom: '.5rem', }}>
      <div>
       {/* BOTONES DE ACCION */}
      <Row style={{ marginBottom: '.5rem' }}>
        <Space>
          <Button
            size="small"
            type="primary"
            disabled={ordenesSeleccionadas.length < 1 || loadingAgendar}
            icon={loadingAgendar ? <LoadingOutlined spin/>:<ScheduleOutlined />}
            onClick={abrirModalAgendar}
          >
            Agendar
          </Button>
          <Button
            size="small"
            type="primary"
            disabled={ordenesSeleccionadas.length < 1 || loadingAsignar}
            icon={loadingAsignar ? <LoadingOutlined spin/>:<UserSwitchOutlined/>}
            onClick={abrirModalAsignar}
          >
            Asignar
          </Button>
          <Button
            size="small"
            type="primary"
            disabled={ordenesSeleccionadas.length < 1 || loadingEstados}
            icon={loadingEstados ? <LoadingOutlined spin/>:<FileSyncOutlined/>}
            onClick={abrirModalEstado}
          >
            Estado
          </Button>
        </Space>
      </Row>
      {/* COMENTARIOS Y ESTADISTICA */}
      </div>
      <TablaOrdenes
        asignadas={true}
        data={ordenes} 
        loading={ordenes.length <= 0} 
        ordenesSeleccionadas={ordenesSeleccionadas} 
        setOrdenesSeleccionadas={setOrdenesSeleccionadas}
      />
     
    </div>
  )
};

OrdenesPendientesGestor.propTypes = {
  gestores: PropTypes.array,
  tecnicos: PropTypes.array,
  loadingTecnicos: PropTypes.bool
};

export default OrdenesPendientesGestor;
