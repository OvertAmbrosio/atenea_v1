import React, { useState } from 'react';
import { EditTwoTone, SettingTwoTone } from '@ant-design/icons'

import colores from '../../../constants/colores';
import ModalEmpleado from './ModalEmpleado';
import ModalConfiguracion from './ModalConfiguracion';
import { putEmpleados } from '../../../services/apiEmpleado';

export default function EmpleadoAcciones({ id, empleado, listarEmpleados, listaContratas }) {
  const [visibleEmpleado, setVisibleEmpleado] = useState(false);
  const [visibleConf, setVisibleConf] = useState(false);

  async function actualizarEmpleado(data) {
    await putEmpleados(id, data)
      .then(async() => await listarEmpleados())
      .catch((error) => console.log(error));
  }

  return (
    <span>
      <EditTwoTone 
        title="Editar"
        twoToneColor={colores.warning} 
        style={{paddingRight:'8px', fontSize: '1.5rem'}}
        onClick={() => setVisibleEmpleado(true)}
      />
      <SettingTwoTone 
        title="Configuraciones"
        style={{paddingRight:'8px', fontSize: '1.5rem'}}
        onClick={() => setVisibleConf(true)}
      />
      {/* MODAL PARA EDITAR EMPLEADO */}
      <ModalEmpleado
        accion="editar"
        empleado={empleado}
        contratas={listaContratas}
        visible={visibleEmpleado}
        setVisible={setVisibleEmpleado}
        guardar={actualizarEmpleado}
      />
      {/* MODAL PARA CONFIGURAR */}
      <ModalConfiguracion
        visible={visibleConf}
        setVisible={setVisibleConf}
        listarEmpleados={listarEmpleados}
        id={id}
      />
    </span>
  )
};
