import React, { useState, useEffect } from "react";
import { Button, Col, Row, Statistic, Typography } from "antd";
import moment from 'moment';

import ChartDevolucionesGpon from './ChartDevolucionesGpon';
import { tipoOrdenes } from "../../constants/tipoOrden";
import { getIndicadores } from "../../services/apiOrden";
import { gpon } from "../../constants/valoresGpon";
import { separarMotivo } from "../../libraries/separarField";

const { Title } = Typography;
const estados = ['Cancelado','No Realizada']

const IndicadorGponDevoluciones = React.memo(() => {
  const [totalOrdenes, setTotalOrdenes] = useState([]);
  const [dataOrdenes, setDataOrdenes] = useState([]);
  const [loadingOrdenes, setLoadingOrdenes] = useState(false);
  const [gestores, setGestores] = useState([]);
  const [horaActualizado, setHoraActualizado] = useState(null);

  useEffect(() => {
    cargarOrdenes();
  // eslint-disable-next-line
  },[]);

  async function cargarOrdenes() {
    setLoadingOrdenes(true);
    await getIndicadores(false, { tipo: tipoOrdenes.ALTAS}).then(({data}) => {
      let gponAux = data.filter((d) => gpon.includes(d.subtipo_actividad) && estados.includes(d.estado));
      return gponAux;
    }).then((gData) => {
      setTotalOrdenes(gData);
      return separarMotivo(gData)
    }).then(({ordenes, gestores}) => {
      // console.log(ordenes)
      setGestores(gestores.filter((g) => g !== '-'));
      setDataOrdenes(ordenes.filter((o) => o.gestor !== '-' && o.motivo));
      setHoraActualizado(moment(new Date()).format('HH:mm'));
    }).catch((err) => console.log(err)).finally(() => setLoadingOrdenes(false));
    
  };

  return (
    <div>
      <Title level={2} style={{ marginTop: '1rem' }}>Indicador Devoluciones Gpon</Title>
      <Row style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
        <Col sm={24}>
          <ChartDevolucionesGpon data={dataOrdenes} loading={loadingOrdenes} gestores={gestores}/>
        </Col>
      </Row>
      <Row>
        <Col sm={24}>
          <Row>
          {
            gestores && gestores.length > 0 ?
            gestores.map((b, i) => (
              <Col key={i} style={{ margin: '1rem' }}>
                <Statistic
                  title={b} 
                  value={totalOrdenes.length > 0 ? totalOrdenes.filter((e) => {
                    if (e.tecnico === '-') {
                      return e.tecnico === b
                    } else if (e.tecnico !== undefined && e.tecnico.gestor && e.tecnico.gestor.nombre) {
                      return e.tecnico.gestor.nombre === b;
                    } else {
                      return false
                    }
                  }).length : 0} 
                  suffix={`/ ${totalOrdenes.filter((o) => o.tecnico !== '-' && o.motivo_no_realizado).length} total`}
                />
              </Col>
            )):null
          }
          </Row>
          <Row>
            <Button onClick={cargarOrdenes}>Click</Button>
          </Row>
        </Col>
      </Row>
    </div>
  )
});

export default IndicadorGponDevoluciones;
  

