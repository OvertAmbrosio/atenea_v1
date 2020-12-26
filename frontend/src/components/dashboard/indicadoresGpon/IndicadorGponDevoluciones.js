import React, { useState, useEffect } from "react";
import { Col, Row, Statistic, Typography } from "antd";
import moment from 'moment';

import ChartDevolucionesGpon from './ChartDevolucionesGpon';
import { gpon } from "../../../constants/valoresToa";
import { separarMotivo } from "../../../libraries/separarField";

const { Title } = Typography;
const estados = ['Cancelado','No Realizada']

function IndicadorGponDevoluciones({data}){
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
          const dataGpon = data.filter((d) => gpon.includes(d.subtipo_actividad) && estados.includes(d.estado));
          setTotalOrdenes(dataGpon.filter((d) => d.tecnico && d.tecnico.gestor));
          return resolve(dataGpon)
        } else {
          return reject([])
        }
      } catch (error) {
        return reject(error)
      }
    }).then((dataGpon) => separarMotivo(dataGpon)).then(({ordenes, gestores}) => {
      setGestores(gestores);
      setDataOrdenes(ordenes)
    }).catch((err) => console.log(err)).finally(() => {
      setHoraActualizado(moment(new Date()).format('HH:mm:ss'))
      setLoadingOrdenes(false)
    })
  };

  return (
    <div>
      <Title level={2} style={{ marginTop: '1rem' }}>Indicador Devoluciones Gpon / Actualizado: {horaActualizado ? horaActualizado : '-'}</Title>
      <Row style={{ marginTop: '2rem', marginBottom: '1rem' }}>
        <Col sm={24}>
          <ChartDevolucionesGpon data={dataOrdenes} loading={loadingOrdenes}/>
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
                  value={totalOrdenes.length > 0 ? totalOrdenes.filter((e) => e.tecnico.gestor.nombre === g).length : 0} 
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
  

