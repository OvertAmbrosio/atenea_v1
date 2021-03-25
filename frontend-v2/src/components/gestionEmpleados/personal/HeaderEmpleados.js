import React, { useState } from 'react';
import { Button, Input, Radio  } from 'antd';
import { PlusOutlined } from '@ant-design/icons';


const { Search } = Input;

export default function HeaderEmpleados(abrirModalCrear, totalEmpleados, setDataEmpleados) {
  const [tipoBusqueda, setTipoBusqueda] = useState("nombre");

  async function buscarPersonal(value) {
    if (value && value.target.value) {
      setDataEmpleados(totalEmpleados.filter((e) =>String(e[tipoBusqueda])
        .toUpperCase()
        .indexOf(String(value.target.value).toUpperCase()) === 0))
    } else {
      await setDataEmpleados(totalEmpleados);
    }
  };
  
  return (
    <div className="header-tabla">
      <div className="busqueda">
        <Radio.Group 
          onChange={(e) => setTipoBusqueda(e.target.value)} 
          value={tipoBusqueda}
          style={{ paddingTop: '.22rem' }}
        >
          <Radio value="nombre">Nombre</Radio>
          <Radio value="numero_documento">Documento</Radio>
          <Radio value="carnet">Carnet</Radio>
        </Radio.Group>
        <Search
          placeholder="Buscar personal"
          allowClear
          enterButton={false}
          size="small"
          onChange={buscarPersonal}
          style={{ width: 200, margin: 0 }}
        />
      </div>
      {/* <div className="boton-agregar"> */}
        <Button
          size="small"
          type="primary"
          icon={<PlusOutlined/>}
          onClick={abrirModalCrear}
        >
          Agregar
        </Button>
      {/* </div> */}
    </div>
  )
}
