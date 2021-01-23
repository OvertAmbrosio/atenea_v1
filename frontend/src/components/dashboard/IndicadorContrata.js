import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Col, Empty, Row, Statistic, Typography } from "antd";
import moment from 'moment';

import ChartContrata from './ChartContrata';
import { separarContrata } from "../../libraries/separarField";
import { gponAltas, gponAverias, gponRutinas, hfcAltas, hfcAverias, hfcRutinas } from "../../constants/valoresToa";

const { Title } = Typography;

function IndicadorGponContrata({data, titulo, tipo, tecnologia}) {
  const [totalOrdenes, setTotalOrdenes] = useState([]);
  const [dataOrdenes, setDataOrdenes] = useState([]);
  const [loadingOrdenes, setLoadingOrdenes] = useState(false);
  const [contratas, setContratas] = useState([]);
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
          const ordenesFiltradas = data.filter((d) => {
            switch (tipo) {
              case 'averias':
                return tecnologia ? gponAverias.includes(d.subtipo_actividad) : hfcAverias.includes(d.subtipo_actividad);
              case 'altas':
                return tecnologia ? gponAltas.includes(d.subtipo_actividad) : hfcAltas.includes(d.subtipo_actividad);
              case 'rutinas':
                return tecnologia ? gponRutinas.includes(d.subtipo_actividad) : hfcRutinas.includes(d.subtipo_actividad);
              default:
                return false;
            };
          })
          setTotalOrdenes(ordenesFiltradas.filter((d) => d.tecnico && d.contrata));
          return resolve(ordenesFiltradas)
        } else {
          return reject([])
        }
      } catch (error) {
        return reject(error)
      }
    }).then((ordenesFiltradas) => separarContrata(ordenesFiltradas)).then(({ordenes, contratas}) => {
      setContratas(contratas);
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
          <ChartContrata data={dataOrdenes} loading={loadingOrdenes}/>
        </Col>
      </Row>
      <Row>
        <Col sm={24}>
        <Row>
          {
            contratas && contratas.length > 0 ?
            contratas.filter((e) => e !== '-').map((g, i) => (
              <Col key={i} style={{ margin: '1rem' }}>
                <Statistic
                  title={g} 
                  value={totalOrdenes.length > 0 ? totalOrdenes.filter((e) => e.contrata.nombre === g).length : 0} 
                  suffix={`/ ${totalOrdenes.length} total`}
                />
              </Col>
            )):null
          }
          </Row>
        </Col>
      </Row>
    </div>
  );
};

IndicadorGponContrata.propTypes = {
  data: PropTypes.array,
  titulo: PropTypes.string,
  tipo: PropTypes.string,
  tecnologia: PropTypes.bool
};

export default IndicadorGponContrata