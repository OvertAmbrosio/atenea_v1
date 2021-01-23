import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Button, Col, Empty, Row, Statistic, Table, Typography } from "antd";
import moment from 'moment';
import { useJsonToCsv } from 'react-json-csv';

import ChartBucket from './ChartBucket';
import { valoresExcelToa, gponAverias, gponAltas, gponRutinas, hfcAverias, hfcAltas, hfcRutinas } from "../../constants/valoresToa";
import { ordenarResumen, separarBucket } from "../../libraries/separarField";
import { columnasResumen, columnasTotal } from "./columnasResumen";

const { Title } = Typography;
//tecnologia true = gpon, false = hfc
function IndicadorBucket({data=[], titulo, tipo, tecnologia}) {
  const [totalOrdenes, setTotalOrdenes] = useState([]);
  const [dataOrdenes, setDataOrdenes] = useState([]);
  const [loadingOrdenes, setLoadingOrdenes] = useState(false);
  const [estadosOrdenes, setEstadosOrdenes] = useState([])
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
        setTotalOrdenes(ordenesFiltradas);
        return resolve(ordenesFiltradas)
      } else {
        return reject([])
      }
     } catch (error) {
       return reject(error)
     }
    }).then((ordenesFiltradas) => separarBucket(ordenesFiltradas)).then(({ordenes, buckets, estados}) => {
      setEstadosOrdenes(estados);
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
      <Row style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
        <Col sm={24}>
          <ChartBucket data={dataOrdenes} loading={loadingOrdenes}/>
        </Col>
        <Col sm={24}>
          <Row style={{ margin: '1rem 0' }}>
            <Table
              columns={columnasResumen('bucket')}
              dataSource={ordenarResumen(totalOrdenes, 'bucket')}
              size="small"
              bordered
              sticky
              footer={() => <Button onClick={() => 
                  saveAsCsv({ 
                    data: totalOrdenes.map((o) => {
                      return ({
                        ...o,
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
              }
              summary={columnasTotal}
            />
          {/* {
            estadosOrdenes && estadosOrdenes.length > 0 ?
            estadosOrdenes.map((e, i) => (
              <Col key={i} style={{ margin: '1rem' }}>
                <Statistic
                  title={e} 
                  value={totalOrdenes.length > 0 ? totalOrdenes.filter((o) => o.estado === e).length : 0} 
                  suffix={`/ ${totalOrdenes.length} total`}
                />
              </Col>
            )):null
          } */}
          </Row>
          <Row>
            
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