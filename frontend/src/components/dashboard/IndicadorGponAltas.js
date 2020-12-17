import React, { useState, useEffect } from "react";
import { Button, Col, Row, Statistic, Typography } from "antd";
import moment from 'moment';
import { useJsonToCsv } from 'react-json-csv';

import ChartGponBucket from './ChartGponBucket';
import { tipoOrdenes } from "../../constants/tipoOrden";
import { getIndicadores } from "../../services/apiOrden";
import { gpon } from "../../constants/valoresGpon";
import { separarBucket } from "../../libraries/separarField";
import extraerDatosTecnico from "../../libraries/extraerDatosTecnico";

const { Title } = Typography;

const IndicadorGponAverias = React.memo(({prueba}) => {
  const [totalAltas, setTotalAltas] = useState([]);
  const [dataAltas, setDataAltas] = useState([]);
  const [loadingAltas, setLoadingAltas] = useState(false);
  const [bucketsAltas, setBucketsAltas] = useState([]);
  const [horaActualizado, setHoraActualizado] = useState(null);
  const { saveAsCsv } = useJsonToCsv();

  useEffect(() => {
    setLoadingAltas(true);
    setTimeout(() => {
      setLoadingAltas(false);
      console.log(prueba);
    }, 1000);
    
  }, [prueba])

  useEffect(() => {
    cargarAltas();
  // eslint-disable-next-line
  },[]);

  async function cargarAltas() {
    setLoadingAltas(true);
    await getIndicadores(true, { tipo: tipoOrdenes.ALTAS})
      .then(({data}) => {
        let gponAux = data.filter((d) => gpon.includes(d.subtipo_actividad));
        setTotalAltas(extraerDatosTecnico(gponAux));
        return gponAux;
      }).then((gponData) => separarBucket(gponData))
      .then(({ordenes, buckets}) => {
        setBucketsAltas(buckets)
        setDataAltas(ordenes)
    }).catch((err) => console.log(err))
    .finally(() => {
      setHoraActualizado(moment(new Date()).format('HH:mm'))
      setLoadingAltas(false)
    });
  };

  const fieldsExcel = {
    bucket: "Bucket", 
    requerimiento: "Requerimiento",
    estado: "Estado",
    fecha_cita: "Fecha Cita",
    motivo_no_realizado: "Motivo No Realizado",
    subtipo_actividad: "Subtipo Actividad",
    carnet: "Carnet",
    tecnico: "Tecnico",
    gestor: "Gestor",
    auditor: "auditor",
    contrata: "Contrata",
    tipo_agenda: "Time Slot",
    sla_inicio: "SLA_INICIO",
    sla_fin: "SLA_FIN"
  };

  return (
    <div>
      <Title level={2} style={{ marginTop: '1rem' }}>Indicador Altas Gpon</Title>
      <Row style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
        <Col sm={16}>
          <ChartGponBucket data={dataAltas} loading={loadingAltas}/>
        </Col>
        <Col sm={8}>
          <Row>
          {
            bucketsAltas && bucketsAltas.length > 0 ?
            bucketsAltas.map((b, i) => (
              <Col key={i} style={{ margin: '1rem' }}>
                <Statistic
                  title={b} 
                  value={totalAltas.length > 0 ? totalAltas.filter((e) => e.bucket === b).length : 0} 
                  suffix={`/ ${totalAltas.length} total`}
                />
              </Col>
            )):null
          }
          </Row>
          <Row>
            <Button onClick={cargarAltas} style={{ marginRight: '.5rem' }}>Click</Button>
            <Button onClick={() => 
                saveAsCsv({ 
                  data:totalAltas, 
                  fields: fieldsExcel, 
                  filename: `data_altas_gpon_${moment().format('DD_MM_YY_HH_mm')}`
                })
            }>
              Exportar
            </Button>
          </Row>
        </Col>
      </Row>
    </div>
  );
});

export default IndicadorGponAverias