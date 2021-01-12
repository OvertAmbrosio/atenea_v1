import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Select, Input, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import { listaEstadosGestor } from '../../../constants/valoresOrdenes';
import capitalizar from '../../../libraries/capitalizar';
import convertirBase64 from '../../../libraries/convertirBase64';

const { Option } = Select;
const { TextArea } = Input;

function ModalEstado({visible, abrir, actualizarEstado}) {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
  const [observacion, setObservacion] = useState(null);
  const [fileList, setFileList] = useState([]);
  //Estados para la previsualización de las imagenes
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    setEstadoSeleccionado(null);
    setObservacion(null);
    setFileList([]);
  }, []);

  async function actualizarOrden() {
    await actualizarEstado(estadoSeleccionado, observacion, fileList);
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
      title="Editar estado de la orden"
      visible={visible}
      onOk={actualizarOrden}
      onCancel={abrir}
      width={300}
      destroyOnClose
      centered
    >
      <Select 
        placeholder="Seleccionar estado"
        defaultValue={estadoSeleccionado} 
        onChange={e => setEstadoSeleccionado(e)}
        style={{ width: 250, marginBottom: '.5rem' }}
      >
        <Option value={listaEstadosGestor.PENDIENTE}>{capitalizar(listaEstadosGestor.PENDIENTE)}</Option>
        <Option value={listaEstadosGestor.ASIGNADO}>{capitalizar(listaEstadosGestor.ASIGNADO)}</Option>
        <Option value={listaEstadosGestor.AGENDADO}>{capitalizar(listaEstadosGestor.AGENDADO)}</Option>
        <Option value={listaEstadosGestor.INICIADO}>{capitalizar(listaEstadosGestor.INICIADO)}</Option>
        <Option value={listaEstadosGestor.LIQUIDADO}>{capitalizar(listaEstadosGestor.LIQUIDADO)}</Option>
        <Option value={listaEstadosGestor.SUSPENDIDO}>{capitalizar(listaEstadosGestor.SUSPENDIDO)}</Option>
        <Option value={listaEstadosGestor.PEXT}>{capitalizar(listaEstadosGestor.PEXT)}</Option>
        <Option value={listaEstadosGestor.REMEDY}>{capitalizar(listaEstadosGestor.REMEDY)}</Option>
      </Select>
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

ModalEstado.propTypes = {
  visible: PropTypes.bool,
  abrir: PropTypes.func,
  actualizarEstado: PropTypes.func
};

export default ModalEstado

