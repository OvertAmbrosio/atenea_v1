import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Select } from 'antd';
import ChartProduccion from '../ChartProduccion';
import { tipoOrdenes } from '../../../constants/tipoOrden';

const { Option } = Select;

const todo = "Todo";

function Index({ordenes=[], hora}) {
  const [listaContratas, setListaContratas] = useState([]);
  const [contrataSeleccionada, setContrataSeleccionada] = useState(todo);
  const [filtradosAverias, setFiltradosAverias] = useState([]);
  const [filtradosAltas, setFiltradosAltas] = useState([]);
  const [heightChart, setHeightChart] = useState(500);

  useEffect(() => {
    listarContratas();
    filtrarData();
  //eslint-disable-next-line
  },[ordenes]);

  useEffect(() => {
    filtrarData();
  //eslint-disable-next-line
  },[contrataSeleccionada]);

  useEffect(() => {
    if (filtradosAverias.length > 0 || filtradosAltas.length > 0) {
      const tamaño = filtradosAverias.length > filtradosAltas.length ? filtradosAverias.length : filtradosAltas.length;
      setHeightChart(tamaño > 35 ? tamaño*19 : tamaño*23)
    } else {
      setHeightChart(400)
    }
  },[filtradosAverias, filtradosAltas])

  async function listarContratas() {
    if (ordenes && ordenes.length > 0) {
      let contratas = ["Todo"];
      ordenes.forEach((e) => {
        if (e.contrata && e.contrata.nombre && !contratas.includes(e.contrata.nombre)) {
          contratas.push(e.contrata.nombre);
        }
      });
      setListaContratas(contratas.filter((e) => e));
    };
  };

  async function filtrarData() {
    if (ordenes && ordenes.length > 0) {
      const averias = ordenes.filter((e) => e.tipo === tipoOrdenes.AVERIAS);
      const altas = ordenes.filter((e) => e.tipo === tipoOrdenes.ALTAS);
      
      setFiltradosAverias(filtrarOrdenes(averias));
      setFiltradosAltas(filtrarOrdenes(altas));
    } else {
      setFiltradosAverias([]);
      setFiltradosAltas([]);
    }
  };

  function filtrarOrdenes(data) {
    let tecnicos = [];
    let apellidos = [];
    let obj = [{
      nombre: false,
      tecnico: false,
      cantidad: false
    }]

    data.forEach((e) => {
      let condicion = contrataSeleccionada === todo ? true : e.contrata.nombre === contrataSeleccionada;
      if (condicion && !tecnicos.includes(`${e.tecnico.nombre} ${e.tecnico.apellidos}`)) {
        tecnicos.push(`${e.tecnico.nombre} ${e.tecnico.apellidos}`);
        apellidos.push(e.tecnico.apellidos)
      }
    });
    apellidos = apellidos.filter(e => e);
    tecnicos.filter(e => e).forEach((t) => {
      const ordenesF = data.filter((e) => {
        let condicion = contrataSeleccionada === todo ? true : e.contrata.nombre === contrataSeleccionada;
        return ((e.tecnico.nombre+' '+e.tecnico.apellidos) === t && condicion)
      });
      const aux =  String(ordenesF[0].tecnico.nombre).substring(0,1)+'. '+ordenesF[0].tecnico.apellidos;
      const nombre = String(aux).length > 20 ? String(aux).substring(0,20) + '...' : String(aux);
      obj.push({
        nombre: nombre.replace(/ {3}/g," "),
        tecnico: String(t).replace(/ {3}/g," "),
        cantidad: ordenesF.length
      })
    });
    obj = obj.filter(e => e.nombre)
    return obj;
  }

  return (
    <div>
      <div style={{ marginTop: '.5rem' }}>
        <h3>Indicadores de Producción - {hora}</h3>
        <Row style={{ marginTop: '1rem' }}>
          <span>Contrata: </span>
          <Select size="small" style={{ width: '260px', marginLeft: '.5rem' }} value={contrataSeleccionada} onChange={(e) => setContrataSeleccionada(e)}>
          {
            listaContratas.length > 0 ?
            listaContratas.map((c, i) => (
              <Option key={i} value={c}>{c}</Option>
            )):
            <Option value={0}>-</Option>
          }
          </Select>
        </Row>
      </div>
      <Row style={{ margin: '1rem 0' }}>
        <Col sm={12} style={{ textAlign: 'center', margin: 0, padding: 0 }}>
          <h4>Averias</h4>
          <ChartProduccion data={filtradosAverias} field="tecnico" height={heightChart} paddinLeft={180}/>
        </Col>
        <Col sm={12} style={{ textAlign: 'center', margin: 0, padding: 0 }}>
          <h4>Altas</h4>
          <ChartProduccion data={filtradosAltas} field="tecnico" height={heightChart} paddinLeft={180}/>
        </Col>
      </Row>
    </div>
  )
};

Index.propTypes = {
  ordenes: PropTypes.array,
  hora: PropTypes.string,
};

export default Index;

