import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Modal, Transfer } from 'antd';

function ModalColumnas({visible, abrir, columnasBase, columnasUsuario=[], guardar}) {
  const [columnasSeleccionadas, setColumnasSeleccionadas] = useState([]);

  useEffect(() => {
    if ( columnasUsuario && columnasUsuario.length > 0) {
      setColumnasSeleccionadas(columnasUsuario); 
    };
  }, [columnasUsuario])

  const guardarConfiguracion = async () => {
    guardar(columnasSeleccionadas);
  };

  return (
    <Modal
      title="Configurar Columnas"
      visible={visible}
      width={550}
      onCancel={abrir}
      onOk={guardarConfiguracion}
      centered
    >
      <p>Seleccionar columnas</p>
      <Transfer
        dataSource={columnasBase}
        targetKeys={columnasSeleccionadas}
        titles={['Disponibles', 'Usuario']}
        listStyle={{
          width: 300,
          height: 600,
        }}
        onChange={(e) => setColumnasSeleccionadas(e)}
        render={item => item.title}
      />
    </Modal>
  )
};

ModalColumnas.propTypes = {
  visible: PropTypes.bool,
  abrir: PropTypes.func,
  columnasBase: PropTypes.array,
  columnasUsuario: PropTypes.array,
  guardar: PropTypes.func
};

export default ModalColumnas;

