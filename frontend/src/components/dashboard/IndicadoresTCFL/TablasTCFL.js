import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Row, Statistic, Table, Tag } from 'antd';
import { CheckCircleOutlined, AlertOutlined,  ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

import { separarBucket, separarContrata, separarGestor } from '../../libraries/separarField';
import { estadosToa } from '../../constants/valoresToa';
import colores from '../../constants/colores';
import { columnasTotalTcfl } from './columnasResumen';
import ModalDetalleOrden from './ModalDetalleOrden';


function TablasTCFL({data=[], horas}) {
  const [dataBuckets, setDataBuckets] = useState([]);
  const [dataContratas, setDataContratas] = useState([]);
  const [dataGestores, setDataGestores] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [modalOrden, setModalOrden] = useState(false);
  const [horaActualizado, setHoraActualizado] = useState(Date.now())

  useEffect(() => {
    setHoraActualizado(Date.now())
    if (data.length > 0) {
      resumenBucket();
      resumenContrata();
      resumenGestor();
    };
  //eslint-disable-next-line
  }, [data])

  async function resumenBucket() {
    try {
      const completados = data.filter(e => e.estado_toa === estadosToa.COMPLETADO);
      const { buckets } = separarBucket(completados);
      if (buckets && buckets.length > 0) {
        let nuevasOrdenes = [];
        buckets.forEach((b, i) => {
          let en_plazo = completados.filter(e => !e.tipo_agenda && e.bucket === b && moment(e.fecha_pre_no_realizado).diff(e.fecha_registro_legados, 'hour') < horas);
          let vencidas = completados.filter(e => !e.tipo_agenda && e.bucket === b && moment(e.fecha_pre_no_realizado).diff(e.fecha_registro_legados, 'hour') >= horas);
          let agendadas = completados.filter(e => e.tipo_agenda && e.bucket === b);

          let a = {
            key: i,
            buckets: b,
            en_plazo,
            vencidas,
            agendadas,
            total: [...en_plazo, ...vencidas, ...agendadas],
          }
          nuevasOrdenes.push(a);
        })
        setDataBuckets(nuevasOrdenes.filter(e => e));
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function resumenContrata() {
    try {
      const completados = data.filter(e => e.estado_toa === estadosToa.COMPLETADO);
      const { contratas } = separarContrata(completados);
      if (contratas && contratas.length > 0) {
        let nuevasOrdenes = [];
        contratas.forEach((c, i) => {
          let en_plazo = completados.filter(e => !e.tipo_agenda && e.contrata && e.contrata.nombre === c && moment(e.fecha_pre_no_realizado).diff(e.fecha_registro_legados, 'hour') < horas);
          let vencidas = completados.filter(e => !e.tipo_agenda && e.contrata && e.contrata.nombre === c && moment(e.fecha_pre_no_realizado).diff(e.fecha_registro_legados, 'hour') >= horas);
          let agendadas = completados.filter(e => e.tipo_agenda && e.contrata && e.contrata.nombre === c);

          let a = {
            key: i,
            contratas: c,
            en_plazo,
            vencidas,
            agendadas,
            total: [...en_plazo, ...vencidas, ...agendadas],
          }
          nuevasOrdenes.push(a);
        })
        setDataContratas(nuevasOrdenes.filter(e => e));
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function resumenGestor() {
    try {
      const completados = data.filter(e => e.estado_toa === estadosToa.COMPLETADO);
      const { gestores } = separarGestor(completados);
      if (gestores && gestores.length > 0) {
        let nuevasOrdenes = [];
        gestores.forEach((g, i) => {
          let en_plazo = completados.filter(e => !e.tipo_agenda && e.gestor && e.gestor.nombre === g && moment(e.fecha_pre_no_realizado).diff(e.fecha_registro_legados, 'hour') < horas);
          let vencidas = completados.filter(e => !e.tipo_agenda && e.gestor && e.gestor.nombre === g && moment(e.fecha_pre_no_realizado).diff(e.fecha_registro_legados, 'hour') >= horas);
          let agendadas = completados.filter(e => e.tipo_agenda && e.gestor && e.gestor.nombre === g);

          let a = {
            key: i,
            gestores: g,
            en_plazo,
            vencidas,
            agendadas,
            total: [...en_plazo, ...vencidas, ...agendadas],
          }
          nuevasOrdenes.push(a);
        })
        setDataGestores(nuevasOrdenes.filter(e => e));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const abrirModalOrden = () => setModalOrden(!modalOrden);

  const abrirDetalle = (ordenes) => {
    setOrdenes(ordenes);
    abrirModalOrden()
  };

  const columnas = (tipo) => {
    return ([
      {
        title: tipo,
        dataTablasTCFL: String(tipo).toLowerCase(),
        width: 150,
        render: (t) => <strong>{t}</strong>
      },
      {
        title: 'En plazo',
        dataTablasTCFL: 'en_plazo',
        width: 80,
        align: 'center',
        render: (o) => {
          if ( o && o.length > 0) {
            return (<Tag color="geekblue" onClick={() => abrirDetalle(o)} style={{ cursor: 'pointer' }}>{o.length}</Tag>)
          } else {
            return 0
          }
        }
      },
      {
        title: 'Vencidas',
        dataTablasTCFL: 'vencidas',
        width: 80,
        align: 'center',
        render: (o) => {
          if ( o && o.length > 0) {
            return (<Tag color="magenta" onClick={() => abrirDetalle(o)} style={{ cursor: 'pointer' }}>{o.length}</Tag>)
          } else {
            return 0
          }
        }
      },
      {
        title: 'Porcentaje',
        width: 90,
        align: 'center',
        render: (_, row) => {
          if (Number(row.en_plazo.length) > 0 || Number(row.vencidas.length) > 0) {
            let p = Math.round((row.en_plazo.length*100) / (row.en_plazo.length + row.vencidas.length) )
            if (p < 80 && p > 50) {
              return <Tag color="warning">{p} %</Tag>
            } else if (p <= 50) {
              return <Tag color="error">{p} %</Tag>
            } else if (p >= 80) {
              return <Tag color="success">{p} %</Tag>
            } else {
              return <Tag>0 %</Tag>
            }
          } else {
            return <Tag>-</Tag>
          }
        }
      },
      {
        title: 'Agendadas',
        dataTablasTCFL: 'agendadas',
        width: 80,
        align: 'center',
        render: (o) => {
          if ( o && o.length > 0) {
            return (<Tag color="purple" onClick={() => abrirDetalle(o)} style={{ cursor: 'pointer' }}>{o.length}</Tag>)
          } else {
            return 0
          }
        }
      },
      {
        title: 'Total',
        dataTablasTCFL: 'total',
        width: 80,
        align: 'center',
        render: (o) => o && o.length > 0 ? o.length : 0
      },
    ])
  };

  return (
    <div>
      <Row gutter={24} style={{ marginBottom: '1rem' }}>
        <Col sm={4}>
          <Card>
            <Statistic
              title="Liquidadas"
              value={data && data.length > 0 ? data.filter(e => e.estado_toa === estadosToa.COMPLETADO).length : 0}
              valueStyle={{ color: colores.success }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col sm={4}>
          <Card>
            <Statistic
              title="Pendientes"
              value={data && data.length > 0 ? data.filter(e => e.estado_toa === estadosToa.PENDIENTE).length : 0}
              valueStyle={{ color: colores.warning }}
              prefix={<AlertOutlined />}
            />
          </Card>
        </Col>
        <Col sm={6}>
          <Card>
            <Statistic
              title="Hora Actualizado"
              value={moment(horaActualizado).format('HH:mm:ss')}
              valueStyle={{ color: colores.NoRealizada }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>
      <h3>Resumen Buckets</h3>
      <Table
        columns={columnas('Buckets')}
        dataSource={dataBuckets}
        pagination={false}
        summary={columnasTotalTcfl}
        style={{ marginBottom: '2rem' }}
        size="small"
        bordered
      />
      <h3>Resumen Contratas</h3>
      <Table
        columns={columnas('Contratas')}
        dataSource={dataContratas}
        pagination={false}
        summary={columnasTotalTcfl}
        style={{ marginBottom: '2rem' }}
        size="small"
        bordered
      />
       <h3>Resumen Gestores</h3>
      <Table
        columns={columnas('Gestores')}
        dataSource={dataGestores}
        pagination={false}
        summary={columnasTotalTcfl}
        style={{ marginBottom: '2rem' }}
        size="small"
        bordered
      />
      {/* MODAL DETALLE DE LA ORDEN */}
      <ModalDetalleOrden ordenes={ordenes} visible={modalOrden} abrir={abrirModalOrden} horas={horas}/>
    </div>
  )
};

TablasTCFL.propTypes = {
  data: PropTypes.array,
  horas: PropTypes.number
};

export default TablasTCFL;

