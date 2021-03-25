import React, { useState } from 'react';
import { LoadingOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Modal, Upload } from 'antd';

import Contenedor from '../components/common/Contenedor';
import TituloVista from '../components/common/TituloContent';
import convertirBase64 from '../libraries/convertirBase64';
import axios from 'axios';
import variables from '../constants/config';
import cogoToast from 'cogo-toast';

export default function SubirIndicadores() {
  const [loadingImagenes, setLoadingImagenes] = useState(false);
  const [fileList, setFileList] = useState([]);
  //Estados para la previsualización de las imagenes
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  async function actualizarIndicadores() {
    if (fileList && fileList.length > 0) {
      setLoadingImagenes(true);
      fileList.forEach(async(f,i) => {
        if (i < 8) {
          await axios.post(`${variables.urlApi}/indicadores`, {
            data: {
              titulo: `imagen${i+1}`,
              imagen: await convertirBase64(f)
            }
          }).then(({data}) => {
            if (data && data.status) {
              cogoToast[data.status](data.message, { position: "top-right" });
            } else {
              cogoToast.error("Sin respuesta del servidor.", { position: "top-right" });
            }
          }).catch((err) => console.log(err)).finally(() => setLoadingImagenes(false));
        };
      });

    }
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
    <div>
      <TituloVista titulo="Subir imagenes" subtitulo="Indicadores NPS"/>
      <Contenedor>
        <Upload
          accept=".jpg,.png,.jpeg"
          listType="picture-card"
          beforeUpload={cargarArchivo}
          onRemove={removerArchivo}
          onPreview={imagenPreview}
          maxCount={8}
        >
          <UploadOutlined />{` `}Subir Imagenes
        </Upload>
        <br/><br/>
        <Button
          onClick={actualizarIndicadores}
          disabled={loadingImagenes}
          icon={ loadingImagenes ? <LoadingOutlined/>:<SaveOutlined/>}
          type="primary"
          size="small"
        >
          Guardar
        </Button>
        {/* MODAL PARA PREVISUALIZAR LA IMAGEN */}
        <Modal visible={previewVisible} footer={null} onCancel={modalPreview}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Contenedor>
    </div>
  )
}
