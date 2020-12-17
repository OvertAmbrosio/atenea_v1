import React, { useState, useEffect } from "react";
import { Button, Col, Row, Statistic, Typography } from "antd";
import moment from 'moment';

import ChartGponBucket from './ChartGponBucket';
import { tipoOrdenes } from "../../constants/tipoOrden";
import { getIndicadores } from "../../services/apiOrden";
import { gpon } from "../../constants/valoresGpon";
import { separarBucket } from "../../libraries/separarBucket";

const { Title } = Typography;

const IndicadorGponAverias = React.memo(({prueba}) => {
  const [totalAverias, setTotalAverias] = useState([]);
  const [dataAverias, setDataAverias] = useState([]);
  const [loadingAverias, setLoadingAverias] = useState(false);
  const [bucketsAverias, setBucketsAverias] = useState([]);
  const [horaActualizado, setHoraActualizado] = useState(null);

  useEffect(() => {
    setLoadingAverias(true);
    setTimeout(() => {
      setLoadingAverias(false);
      console.log(prueba);
    }, 1000);
    
  }, [prueba])

  useEffect(() => {
    cargarAverias();
  // eslint-disable-next-line
  },[]);

  async function cargarAverias() {
    setLoadingAverias(true);
    await getIndicadores(true, { tipo: tipoOrdenes.AVERIAS})
    .then(({data}) => {
      let gponAux = data.filter((d) => gpon.includes(d.subtipo_actividad));
      setTotalAverias(gponAux);
      return gponAux
    }).then((gponData) => separarBucket(gponData))
      .then(({ordenes, buckets}) => {
        setBucketsAverias(buckets)
        setDataAverias(ordenes)
    }).catch((err) => console.log(err))
      .finally(() => {
        setHoraActualizado(moment(new Date()).format('HH:mm'))
        setLoadingAverias(false)
      });
  };

  return (
    <div>
    <Title level={2} style={{ marginTop: '1rem' }}>Indicador Averias Gpon</Title>
      <Row style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
        <Col sm={16}>
          <ChartGponBucket data={dataAverias} loading={loadingAverias} llave="averias"/>
        </Col>
        <Col sm={8}>
          <Row>
          {
            bucketsAverias && bucketsAverias.length > 0 ?
            bucketsAverias.map((b, i) => (
              <Col key={i} style={{ margin: '1rem' }}>
                <Statistic
                  title={b} 
                  value={totalAverias.length > 0 ? totalAverias.filter((e) => e.bucket === b).length : 0} 
                  suffix={`/ ${totalAverias.length} total`}
                />
              </Col>
            )):null
          }
          </Row>
          <Row>
            <Button onClick={cargarAverias}>Click</Button>
          </Row>
        </Col>
      </Row>
    </div>
  );
});

export default IndicadorGponAverias;