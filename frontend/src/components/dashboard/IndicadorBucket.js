import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Button, Col, Row, Statistic, Typography } from "antd";
import moment from 'moment';
import { useJsonToCsv } from 'react-json-csv';

import ChartBucket from './ChartBucket';
import { gpon, valoresExcelToa } from "../../constants/valoresToa";
import { separarBucket } from "../../libraries/separarField";

const { Title } = Typography;

function IndicadorBucket({data, titulo, tipo, tecnologia}) {
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
        const ordenesFiltradas = data.filter((d) => gpon.includes(d.subtipo_actividad) === tecnologia)
        setTotalOrdenes(ordenesFiltradas);
        return resolve(ordenesFiltradas)
      } else {
        return reject([])
      }
     } catch (error) {
       return reject(error)
     }
    }).then((ordenesFiltradas) => separarBucket(ordenesFiltradas)).then(({ordenes, buckets}) => {
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
          <ChartBucket data={dataOrdenes} loading={loadingOrdenes}/>
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
                  data: totalOrdenes.map((o) => {
                    return ({
                      ...o,
                      carnet: o.tecnico && o.tecnico.carnet,
                      tecnico: o.tecnico && o.tecnico.nombre ? o.tecnico.nombre + ' ' + o.tecnico.apellidos : '-',
                      gestor: o.gestor ? o.gestor.nombre + ' ' + o.gestor.apellidos : '-',
                      auditor: o.auditor ? o.auditor.nombre + ' ' + o.auditor.apellidos : '-',
                      contrata: o.contrata ? o.contrata.nombre : '-'
                    })
                  }), 
                  fields: valoresExcelToa, 
                  filename: `data_${tipo}_${tecnologia ? 'gpon':'hfc'}_${moment().format('DD_MM_YY_HH_mm')}`
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

IndicadorBucket.propTypes = {
  data: PropTypes.array,
  titulo: PropTypes.string,
  tipo: PropTypes.string,
  tecnologia: PropTypes.bool
}

export default IndicadorBucket