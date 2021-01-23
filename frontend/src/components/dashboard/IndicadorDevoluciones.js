import React, { useState, useEffect } from "react";
import { Col, Empty, Row, Statistic, Typography } from "antd";
import moment from 'moment';

import ChartDevolucionesGpon from './ChartDevoluciones';
import { separarMotivo } from "../../libraries/separarField";
import { gponAltas, hfcAltas } from "../../constants/valoresToa";

const { Title } = Typography;
const estados = ['Cancelado','No Realizada']

function IndicadorGponDevoluciones({data, titulo, tipo, tecnologia}){
  const [totalOrdenes, setTotalOrdenes] = useState([]);
  const [dataOrdenes, setDataOrdenes] = useState([]);
  const [loadingOrdenes, setLoadingOrdenes] = useState(false);
  const [gestores, setGestores] = useState([]);
  const [horaActualizado, setHoraActualizado] = useState(null);

  useEffect(() => {
    if (data && data.length > 0) {
      cargarOrdenes();
    }
  // eslint-disable-next-line
  },[data]);

  async function cargarOrdenes() {
    setLoadingOrdenes(true);
    return new Promise((resolve, reject) => {
      try {
        if (data.length > 0) {
          const ordenesFiltradas = data.filter((d) => tecnologia ? gponAltas.includes(d.subtipo_actividad) && estados.includes(d.estado) : hfcAltas.includes(d.subtipo_actividad) && estados.includes(d.estado));
          setTotalOrdenes(ordenesFiltradas.filter((d) => d.tecnico && d.gestor));
          return resolve(ordenesFiltradas)
        } else {
          return reject([])
        }
      } catch (error) {
        return reject(error)
      }
    }).then((ordenesFiltradas) => separarMotivo(ordenesFiltradas)).then(({ordenes, gestores}) => {
      setGestores(gestores);
      setDataOrdenes(ordenes)
    }).catch((err) => console.log(err)).finally(() => {
      setHoraActualizado(moment(new Date()).format('HH:mm:ss'))
      setLoadingOrdenes(false)
    })
  };

  if (data.length <= 0 || dataOrdenes.length <= 0 ) {
    return (
      <div>
        <Title level={2} style={{ marginTop: '1rem' }}>{titulo} / Actualizado: - </Title>
        <Empty style={{ margin: '5rem' }}/>
      </div>
    )
  }

  return (
    <div>
      <Title level={2} style={{ marginTop: '1rem' }}>{titulo} / Actualizado: {horaActualizado ? horaActualizado : '-'}</Title>
      <Row style={{ marginTop: '2rem', marginBottom: '1rem' }}>
        <Col sm={24}>
          <ChartDevolucionesGpon data={dataOrdenes.filter((d) => d.motivo && d.gestor !== '-' && d.ordenes > 0)} loading={loadingOrdenes}/>
        </Col>
      </Row>
      <Row>
        <Col sm={24}>
        <Row>
          {
            gestores && gestores.length > 0 ?
            gestores.filter((e) => e !== '-').map((g, i) => (
              <Col key={i} style={{ margin: '1rem' }}>
                <Statistic
                  title={g} 
                  value={totalOrdenes.length > 0 ? totalOrdenes.filter((e) => e.gestor.nombre === g).length : 0} 
                  suffix={`/ ${totalOrdenes.length} total`}
                />
              </Col>
            )):null
          }
          </Row>
        </Col>
      </Row>
    </div>
  )
};

export default IndicadorGponDevoluciones;
  

