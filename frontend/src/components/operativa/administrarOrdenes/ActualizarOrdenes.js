import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Radio, Row, Statistic, Upload } from 'antd';
import { UploadOutlined, SaveOutlined, LoadingOutlined } from '@ant-design/icons';
import cogoToast from 'cogo-toast';

import variables from '../../../constants/config';
import convertirExcel from '../../../libraries/convertirExcel';
import asignarValores from '../../../libraries/asignarValores';
import { getOrdenes, postOrdenes } from '../../../services/apiOrden';
import { ordenes } from '../../../constants/metodos';

function ActualizarOrdenes({tipoOrden}) {
  const [estadoOrden, setEstadoOrden] = useState(1)
  const [estadoArchivo, setEstadoArchivo] = useState('done');
  const [nombreArchivo, setNombreArchivo] = useState('');
  const [ordenesObtenidas, setOrdenesObtenidas] = useState([]);
  const [loadingButton, setLoadingButton] = useState(false);

  useEffect(() => {
    setEstadoArchivo('done');
    setNombreArchivo('');
    setOrdenesObtenidas([]);
  },[estadoOrden]);

  async function guardarArchivo() {
    if (ordenesObtenidas.length === 0) {
      cogoToast.warn('No hay ordenes para subir.', { position: 'top-right' });
    } else {
      setLoadingButton(true);
      await postOrdenes({metodo: ordenes.SUBIR_DATA, ordenes: ordenesObtenidas })
        .then(async() => {
          cogoToast.info('Sincronizando ordenes con TOA...', { position: 'top-right' });
          return await getOrdenes(true, { metodo: ordenes.CRUZAR_DATA, tipo: tipoOrden})
        }).catch((err) => console.log(err));
      setLoadingButton(false);  
    }
  };

  function cargarArchivo(file) {
    //actualizar el estado y el no mbre del archivo
    setEstadoArchivo('uploading');
    setNombreArchivo(file.name);
    //validar si es un archivo excel
    if (!variables.formatosAdmitidos.includes(file.type)) {
      setEstadoArchivo('error');
      cogoToast.warn('Formato Incorrecto.', { position: 'top-right' })
      return false;
    };
    //convertir excel a json
    convertirExcel(file).then(async(objJson) => {
      //obtener los valores necesarios, actualizar estado y guardar
      await asignarValores(objJson, tipoOrden, estadoOrden).then((data) => {
        setEstadoArchivo('done');
        setOrdenesObtenidas(data);
        cogoToast.success(`${data.length} Ordenes encontradas.`, {position: 'top-right'});
      });
    }).catch((err) => {
      setEstadoArchivo('error');
      cogoToast.error('Error convirtiendo el archivo', {position: 'top-right'})
      console.log(err);
    })
    //evita enviar peticiuones http
    return false;
  };

  const removerArchivo = () => {
    setNombreArchivo('');
    setEstadoArchivo('done');
    setOrdenesObtenidas([]);
  };

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
          <Statistic title="Ordenes" value={ordenesObtenidas.length}/>
          <Button 
            style={{ marginTop: '.5rem' }} 
            type="primary" 
            icon={loadingButton ? <LoadingOutlined spin/> : <SaveOutlined/>}
            onClick={guardarArchivo}
          >
            Guardar
          </Button>
        </Col>
      </Row>
     
    </div>
  )
};

ActualizarOrdenes.propTypes = {
  tipoOrden: PropTypes.string
};

export default ActualizarOrdenes

