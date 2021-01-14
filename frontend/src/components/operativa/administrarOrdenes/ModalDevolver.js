import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Modal, Input, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import convertirBase64 from '../../../libraries/convertirBase64';

const { TextArea } = Input;

function ModalDevolver({ visible, abrir, loading, devolverOrden }) {
  const [observacion, setObservacion] = useState(null);
  const [fileList, setFileList] = useState([]);
  //Estados para la previsualización de las imagenes
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    setObservacion(null);
    setFileList([]);
  }, []);

  async function devolver() {
    await devolverOrden(observacion, fileList);
    abrir();
  };

  //guardar localmente las fotos
  function cargarArchivo (file) {
    let lista = fileList;
    file.status = 'done'
    lista.push(file)
    setFileList(lista)
    return false
  }
  //remover archivo seleccionado
  function removerArchivo (a) {
    let nuevaLista = fileList.filter((f) => f.uid !== a.uid);
    setFileList(nuevaLista)
  };

  const modalPreview = () => setPreviewVisible(!previewVisible);

  // funcion para cargar la previsualización de la imagen seleccionada
  const imagenPreview = async (file) => {
    try {
      const preview = await convertirBase64(file.originFileObj);
      setPreviewVisible(true)
      setPreviewImage(preview);
    } catch (error) {
      console.log(error);
    };
  };

  return (
    <Modal
      title="Desvolver Orden"
      visible={visible}
      onCancel={abrir}
      width={300}
      destroyOnClose
      centered
      footer={[
        <Button key="back" onClick={abrir}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={devolver}>
          Aceptar
        </Button>,
      ]}
    >
      <div style={{ marginBottom: '.5rem' }}>Observación:</div>
      <TextArea
        placeholder="Observacion"
        defaultValue={observacion}
        rows={4}
        onChange={(e) => setObservacion(e.target.value)}
        style={{ marginBottom: '.5rem' }}
      />
      <div style={{ marginBottom: '.5rem' }}>Adjuntar imágenes:</div>
      <Upload
        accept=".jpg,.png,.jpeg"
        listType="picture-card"
        beforeUpload={cargarArchivo}
        onRemove={removerArchivo}
        onPreview={imagenPreview}
        multiple={true}
      >
        <UploadOutlined />{` `}Imagen
      </Upload>
      {/* MODAL PARA PREVISUALIZAR LA IMAGEN */}
      <Modal visible={previewVisible} footer={null} onCancel={modalPreview}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>

    </Modal>
  )
};

ModalDevolver.propTypes = {
  visible: PropTypes.bool,
  abrir: PropTypes.func,
  loading: PropTypes.bool,
  devolverOrden: PropTypes.func
};

export default ModalDevolver

