import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Button, Col, Row, Statistic, Typography } from "antd";
import moment from 'moment';
import { useJsonToCsv } from 'react-json-csv';

import ChartGponBucket from './ChartGponBucket';
import { gpon, valoresExcelToa } from "../../../constants/valoresToa";
import { separarBucket } from "../../../libraries/separarField";

const { Title } = Typography;

function IndicadorGponBucket({data, titulo, tipo}) {
  const [totalOrdenes, setTotalOrdenes] = useState([]);
  const [dataOrdenes, setDataOrdenes] = useState([]);
  const [loadingOrdenes, setLoadingOrdenes] = useState(false);
  const [bucketsOrdenes, setBucketsOrdenes] = useState([]);
  const [horaActualizado, setHoraActualizado] = useState(null);
  const { saveAsCsv } = useJsonToCsv();

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
        const dataGpon = data.filter((d) => gpon.includes(d.subtipo_actividad))
        setTotalOrdenes(dataGpon);
        return resolve(dataGpon)
      } else {
        return reject([])
      }
     } catch (error) {
       return reject(error)
     }
    }).then((dataGpon) => separarBucket(dataGpon)).then(({ordenes, buckets}) => {
      setBucketsOrdenes(buckets);
      setDataOrdenes(ordenes)
    }).catch((err) => console.log(err)).finally(() => {
      setHoraActualizado(moment(new Date()).format('HH:mm:ss'))
      setLoadingOrdenes(false)
    })
  };

  return (
    <div>
      <Title level={2} style={{ marginTop: '1rem' }}>{titulo} / Actualizado: {horaActualizado ? horaActualizado : '-'}</Title>
      <Row style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
        <Col sm={16}>
          <ChartGponBucket data={dataOrdenes} loading={loadingOrdenes}/>
        </Col>
        <Col sm={8}>
          <Row>
          {
            bucketsOrdenes && bucketsOrdenes.length > 0 ?
            bucketsOrdenes.map((b, i) => (
              <Col key={i} style={{ margin: '1rem' }}>
                <Statistic
                  title={b} 
                  value={totalOrdenes.length > 0 ? totalOrdenes.filter((e) => e.bucket === b).length : 0} 
                  suffix={`/ ${totalOrdenes.length} total`}
                />
              </Col>
            )):null
          }
          </Row>
          <Row>
            <Button onClick={() => 
                saveAsCsv({ 
                  data:totalOrdenes, 
                  fields: valoresExcelToa, 
                  filename: `data_${tipo}_gpon_${moment().format('DD_MM_YY_HH_mm')}`
                })
            }>
              Exportar
            </Button>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

IndicadorGponBucket.propTypes = {
  data: PropTypes.array,
  titulo: PropTypes.string
}

export default IndicadorGponBucket