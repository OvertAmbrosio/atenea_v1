import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Select, Tabs, Typography } from 'antd';
import { DatabaseOutlined, UsergroupAddOutlined, UserOutlined } from '@ant-design/icons';

import { tipoOrdenes, tipoTecnologia } from '../../../constants/tipoOrden';
import { bajas, gponAltas, gponAverias, gponRutinas, hfcAltas, hfcAverias, hfcRutinas } from '../../../constants/valoresToa';
import TabIndicadorActividad from './TabIndicadorActividad';
import { ordenarResumen, ordenarResumenId, separarBucket, separarContrata, separarGestor } from '../../../libraries/separarField';


const { Option } = Select;
const { Text } = Typography;
const { TabPane } = Tabs;

function Index({hora, ordenes=[]}) {
  const [negocio, setNegocio] = useState(tipoOrdenes.AVERIAS);
  const [tecnologia, setTecnologia] = useState(tipoTecnologia.HFC);
  const [ordenesFiltradas, setOrdenesFiltradas] = useState([]);

  useEffect(() => {
    if(negocio === tipoOrdenes.BAJAS && tecnologia !== 'Todo') setTecnologia('Todo')
    aplicarFiltros();
  //eslint-disable-next-line
  },[ordenes, negocio, tecnologia]);

  async function aplicarFiltros() {
    if (ordenes && ordenes.length > 0) {
      return new Promise((resolve) => resolve(filtroNegocio(ordenes)))
        .then((data) => filtroTecnologia(data))
        .then((data2) => setOrdenesFiltradas(data2))
        .catch((err) => console.log(err));
    } else {
      setOrdenesFiltradas([]);
      return;
    };
  };

  function filtroNegocio(data=[]) {
    if(!data && data.length < 1) return [];
    const averiaActicidad = [...hfcAverias, ...gponAverias];
    const altaActividad = [...hfcAltas, ...gponAltas];
    const rutinaActicidad = [...hfcRutinas, ...gponRutinas];

    if (negocio === tipoOrdenes.AVERIAS) {
      return data.filter((e) => e && e.subtipo_actividad && averiaActicidad.includes(e.subtipo_actividad));
    } else if  (negocio === tipoOrdenes.ALTAS) {
      return data.filter((e) => e && e.subtipo_actividad && altaActividad.includes(e.subtipo_actividad));
    } else if (negocio === tipoOrdenes.RUTINAS) {
      return data.filter((e) => e && e.subtipo_actividad && rutinaActicidad.includes(e.subtipo_actividad));
    } else if (negocio === tipoOrdenes.BAJAS) {
      return data.filter((e) => e && e.subtipo_actividad && bajas.includes(e.subtipo_actividad));
    } else {
      return data;
    }
  };

  function filtroTecnologia(data=[]) {
    if(!data && data.length < 1) return [];
    const hfc = [...hfcAverias,...hfcAltas,...hfcRutinas];
    const gpon = [...gponAverias,...gponAltas,...gponRutinas];

    if (tecnologia === tipoTecnologia.HFC) {
      return data.filter((e) => e && e.subtipo_actividad && hfc.includes(e.subtipo_actividad));
    } else if (tecnologia === tipoTecnologia.GPON) {
      return data.filter((e) => e && e.subtipo_actividad && gpon.includes(e.subtipo_actividad));
    } else {
      return data;
    };
  };
  
  return (
    <div>
      <div style={{ marginTop: '.5rem' }}>
        <h3>Indicadores de Actividad - {hora}</h3>
        <Row>
          <Col sm={7}>
            <span>Negocio: </span>
            <Select size="small" style={{ width: '100px', marginLeft: '.5rem' }} value={negocio} onChange={(e) => setNegocio(e)}>
              <Option value={tipoOrdenes.AVERIAS}>Averias</Option>
              <Option value={tipoOrdenes.ALTAS}>Altas</Option>
              <Option value={tipoOrdenes.RUTINAS}>Rutinas</Option>
              <Option value={tipoOrdenes.BAJAS}>Bajas</Option>
              <Option value="Todo">Todo</Option>
            </Select>
          </Col>
          <Col sm={7}>
            <span>Tecnología:</span>
            <Select size="small" disabled={negocio === tipoOrdenes.BAJAS} style={{ width: '100px', marginLeft: '.5rem' }} value={tecnologia} onChange={(e) => setTecnologia(e)}>
              <Option value={tipoTecnologia.HFC}>HFC</Option>
              <Option value={tipoTecnologia.GPON}>GPON</Option>
              <Option value="Todo">Todo</Option>
            </Select>
          </Col>
          <Col sm={7}>
            <span>Zona: </span>
            <Text type="secondary">LIMA</Text>
          </Col>
        </Row>
      </div>
      <Tabs style={{paddingLeft: '1rem'}} animated={false}>
        <TabPane
          tab={
            <span>
              <DatabaseOutlined />
              Bucket
            </span>
          }
          key="1"
        >
          <TabIndicadorActividad 
            dataSource={ordenarResumen(ordenesFiltradas, 'bucket')} 
            dataChart={separarBucket(ordenesFiltradas).ordenes}
            tipo="bucket" 
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <UsergroupAddOutlined />
              Contrata
            </span>
          }
          key="2"
        >
           <TabIndicadorActividad 
            dataSource={ordenarResumenId(ordenesFiltradas.filter((d) => d.tecnico && d.contrata), 'contrata')} 
            dataChart={separarContrata(ordenesFiltradas.filter((d) => d.tecnico && d.contrata)).ordenes}
            tipo="contrata" 
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <UserOutlined />
              Gestor
            </span>
          }
          key="3"
        >
           <TabIndicadorActividad 
            dataSource={ordenarResumenId(ordenesFiltradas.filter((d) => d.tecnico && d.gestor), 'gestor')} 
            dataChart={separarGestor(ordenesFiltradas.filter((d) => d.tecnico && d.gestor)).ordenes}
            tipo="gestor" 
          />
        </TabPane>
      </Tabs>
    </div>
  )
};

Index.propTypes = {
  hora: PropTypes.string,
  ordenes: PropTypes.array
};

export default Index;

