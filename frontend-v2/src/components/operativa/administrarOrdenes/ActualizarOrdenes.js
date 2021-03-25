import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Radio, Row, Statistic, Table, Tag, Upload } from 'antd';
import { UploadOutlined, SaveOutlined, LoadingOutlined } from '@ant-design/icons';
import cogoToast from 'cogo-toast';

import variables from '../../../constants/config';
import convertirExcel from '../../../libraries/convertirExcel';
import asignarValores from '../../../libraries/asignarValores';
import { postOrdenes, putOrdenes } from '../../../services/apiOrden';
import metodos from '../../../constants/metodos';
import fragmentarArray from '../../../libraries/fragmentarArray';

function ActualizarOrdenes({tipoOrden, tecnicos}) {
  const [estadoOrden, setEstadoOrden] = useState(1)
  const [estadoArchivo, setEstadoArchivo] = useState('done');
  const [nombreArchivo, setNombreArchivo] = useState('');
  const [ordenesObtenidas, setOrdenesObtenidas] = useState([]);
  const [ordenesTotal, setOrdenesTotal] = useState(0);
  const [ordenesFiltradas, setOrdenesFiltradas] = useState(0);
  const [loadingButton, setLoadingButton] = useState(false);
  const [resultado, setResultado] = useState([])

  useEffect(() => {
    setEstadoArchivo('done');
    setNombreArchivo('');
    setOrdenesObtenidas([]);
    setOrdenesTotal(0);
    setOrdenesFiltradas(0);
    setResultado([]);
  },[estadoOrden]);

  async function enviarOrdenesPendientes(data, i) {
    cogoToast.info(`Enviando paquetes de datos ${i}/${ordenesObtenidas.length} (500u.)...`, { position: 'top-right' });
    return await postOrdenes({
      metodo: metodos.ORDENES_SUBIR_DATA, 
      ordenes: data 
    }).then((res) => {
      let resultadoAux = resultado;
      let infoResponse = res && res.data ? res.data: {};
      resultadoAux.push({
        ...infoResponse,
        id: Date.now(), 
        cantidad: data.length
      })
      setResultado(resultadoAux.filter(e => e))
    }).catch((err) => console.log(err));;
  };

  async function enviarOrdenesLiquidadas(data, i) {
    cogoToast.info(`Enviando paquetes de datos ${i}/${ordenesObtenidas.length} (500u.)...`, { position: 'top-right' });
    await putOrdenes({
      metodo: metodos.ORDENES_ACTUALIZAR_LIQUIDADAS, 
      ordenes: data 
    }).then((res) => {
      let resultadoAux = resultado;
      let infoResponse = res && res.data ? res.data: {};
      resultadoAux.push({
        ...infoResponse,
        id: Date.now(), 
        cantidad: data.length
      })
      setResultado(resultadoAux.filter(e => e))
    }).catch((err) => console.log(err));
  };

  async function guardarArchivo() {
    if (ordenesObtenidas.length === 0) {
      cogoToast.warn('No hay ordenes para subir.', { position: 'top-right' });
    } else {
      if (estadoOrden === 1) {
        try {
          setLoadingButton(true);
          let index = 1;
          for await ( let obj of ordenesObtenidas) {
            await enviarOrdenesPendientes(obj, index)
            index = index+1
          };
        } catch (error) {
          cogoToast.error("Error en el cliente.", { position: 'top-right' });
          console.log(error);
        } finally { setLoadingButton(false) }; 
      } else {
        try {
          setLoadingButton(true);
          let index = 1;
          for await ( let obj of ordenesObtenidas) {
            await enviarOrdenesLiquidadas(obj, index);
            index = index+1
          };
        } catch (error) {
          cogoToast.error("Error en el cliente.", { position: 'top-right' });
          console.log(error);
        } finally { setLoadingButton(false) };
      };
    }
  };

  function cargarArchivo(file) {
    //actualizar el estado y el no mbre del archivo
    setEstadoArchivo('uploading');
    setNombreArchivo(file.name);
    setResultado([]);
    //validar si es un archivo excel
    if (!variables.formatosAdmitidos.includes(file.type)) {
      setEstadoArchivo('error');
      cogoToast.warn('Formato Incorrecto.', { position: 'top-right' })
      return false;
    };
    //convertir excel a json
    convertirExcel(file).then(async(objJson) => {
      //obtener los valores necesarios, actualizar estado y guardar
      await asignarValores(objJson, tipoOrden, estadoOrden, tecnicos).then((data) => {
        setOrdenesTotal(data.length);
        return data.filter((e) => e.verificado)
      }).then(async(data) => {
        setEstadoArchivo('done');
        setOrdenesObtenidas(await fragmentarArray(data, 500));
        setOrdenesFiltradas(data.length);
        cogoToast.success(`${data.length} Ordenes encontradas.`, {position: 'top-right'});
      }).catch((err) => console.log(err, 'Error asignando valores'));
    }).catch((err) => {
      setEstadoArchivo('error');
      cogoToast.error('Error convirtiendo el archivo', {position: 'top-right'})
      console.log(err);
    })
    //evita enviar peticiones http
    return false;
  };

  const removerArchivo = () => {
    setNombreArchivo('');
    setEstadoArchivo('done');
    setOrdenesObtenidas([]);
  };

  const columnas = [
    {
      title: '#',
      width: 50,
      render: (_,__,i) => i+1
    },
    {
      title: 'Cantidad',
      width: 100,
      dataIndex: 'cantidad',
      render: (o) => o ? <Tag color="blue">{o}</Tag> : '-' 
    },
    {
      title: 'Nuevos',
      width: 100,
      dataIndex: 'nuevos',
      render: (o) => o ? <Tag color="green">{o}</Tag> : '-' 
    },
    {
      title: 'Actualizados',
      width: 100,
      dataIndex: 'actualizados',
      render: (o) => o ? <Tag color="geekblue">{o}</Tag> : '-' 
    },
    {
      title: 'Duplicados',
      width: 100,
      dataIndex: 'duplicados',
      render: (o) => o ? <Tag color="warning">{o}</Tag> : '-' 
    },
    {
      title: 'Errores',
      width: 100,
      dataIndex: 'errores',
      render: (e) => e ? <Tag color="error">{e}</Tag> : <Tag>-</Tag>
    }
  ]

  return (
    <div>
      <Row>
        <Col sm={10} md={10} lg={12} xl={12} spellCheck>
          <p>Tipo de Archivo:</p>
          <Radio.Group onChange={(e) => setEstadoOrden(e.target.value)} value={estadoOrden}>
            <Radio value={1}>
              Pendientes
            </Radio>
            <Radio value={2}>
              Liquidadas
            </Radio>
          </Radio.Group>
          <div style={{width: '14rem', margin: '1rem 0', }}>
            <Upload 
              accept=".xls,.xlsx"
              beforeUpload={cargarArchivo}
              onRemove={removerArchivo}
              fileList={[{uid: '-1', name: nombreArchivo, status: estadoArchivo}]}
            >
              <Button>
                <UploadOutlined />{` `}Subir Archivo
              </Button>
            </Upload>
          </div>
        </Col>
        <Col sm={14} md={14} lg={12} xl={12}>
          <Statistic title="Ordenes:" value={ordenesFiltradas} suffix={`/ ${ordenesTotal}`}/>
          <Button 
            disabled={loadingButton}
            style={{ marginTop: '.5rem' }} 
            type="primary" 
            icon={loadingButton ? <LoadingOutlined spin/> : <SaveOutlined/>}
            onClick={guardarArchivo}
          >
            Guardar
          </Button>
        </Col>
      </Row>
      <Table
        rowKey="id"
        columns={columnas}
        dataSource={resultado.filter((e) => e)}
        pagination={false}
        style={{ marginBottom: '1rem' }}
        bordered
      />
    </div>
  )
};

ActualizarOrdenes.propTypes = {
  tipoOrden: PropTypes.string,
  tecnicos: PropTypes.array
};

export default ActualizarOrdenes

