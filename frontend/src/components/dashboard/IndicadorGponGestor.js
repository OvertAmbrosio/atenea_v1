import React, { useState, useEffect } from "react";
import { Button, Col, Row, Statistic, Typography } from "antd";
import moment from 'moment';

import ChartGponGestor from './ChartGponGestor';
import { tipoOrdenes } from "../../constants/tipoOrden";
import { getIndicadores } from "../../services/apiOrden";
import { gpon } from "../../constants/valoresGpon";
import { separarGestor } from "../../libraries/separarField";

const { Title } = Typography;

const IndicadorGponGestor = React.memo(({prueba}) => {
  const [totalOrdenes, setTotalOrdenes] = useState([]);
  const [dataOrdenes, setDataOrdenes] = useState([]);
  const [loadingOrdenes, setLoadingOrdenes] = useState(false);
  const [gestores, setGestores] = useState([]);
  const [horaActualizado, setHoraActualizado] = useState(null);

  useEffect(() => {
    setLoadingOrdenes(true);
    setTimeout(() => {
      setLoadingOrdenes(false);
      console.log(prueba);
    }, 1000);
    
  }, [prueba])

  useEffect(() => {
    cargarOrdenes();
  // eslint-disable-next-line
  },[]);

  async function cargarOrdenes() {
    setLoadingOrdenes(true);
    let gestoresAux = [];
    const ordenesAltas = await getIndicadores(false, { tipo: tipoOrdenes.ALTAS}).then(({data}) => {
                            let gponAux = data.filter((d) => gpon.includes(d.subtipo_actividad));
                            return gponAux;
                          }).catch((err) => console.log(err));
    const ordenesAverias = await getIndicadores(false, { tipo: tipoOrdenes.AVERIAS}).then(({data}) => {
                              let gponAux = data.filter((d) => gpon.includes(d.subtipo_actividad));
                              return gponAux;
                            }).catch((err) => console.log(err));
    try {
      const totalAux = separarGestor([...ordenesAltas,...ordenesAverias])
      totalAux.gestores.forEach((g) => {if(!gestoresAux.includes(g)) gestoresAux.push(g)});
      setDataOrdenes(totalAux.ordenes);
      setTotalOrdenes([...ordenesAltas, ...ordenesAverias]);
      setGestores(gestoresAux);
      setHoraActualizado(moment(new Date()).format('HH:mm'))
      setLoadingOrdenes(false);
    } catch (error) {
      console.log(error);
    };
  };

  return (
    <div>
      <Title level={2} style={{ marginTop: '1rem' }}>Indicador Gestores Gpon</Title>
      <Row style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
        <Col sm={24}>
          <ChartGponGestor data={dataOrdenes} loading={loadingOrdenes} gestores={gestores}/>
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
                      console.log(e, e.tecnico === '-')
                      return false
                    }
                  }).length : 0} 
                  suffix={`/ ${totalOrdenes.length} total`}
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
  );
});

export default IndicadorGponGestor