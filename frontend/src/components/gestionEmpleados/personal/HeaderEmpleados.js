import React, { useState } from 'react';
import { Button, Input, Radio  } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { buscarEmpleado } from '../../../services/apiEmpleado';

const { Search } = Input;

export default function HeaderEmpleados(abrirModalCrear, listarEmpleado, setEmpleados, setPageNumber, setTotalDocs) {
  const [tipoBusqueda, setTipoBusqueda] = useState("nombre");

  async function buscarPersonal(value) {
    if (value.length > 1) {
      await buscarEmpleado(value, tipoBusqueda)
        .then(({data}) => {
          if (data.length > 0) {
            setEmpleados(data)
            setPageNumber(1)
            setTotalDocs(data.length)
          };
        })
        .catch((err) => console.log(err))
    } else {
      await listarEmpleado();
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
          onSearch={buscarPersonal}
          style={{ width: 200, margin: 0 }}
        />
      </div>
      <div className="boton-agregar">
        <Button
          icon={<PlusOutlined/>}
          onClick={abrirModalCrear}
        >
          Agregar
        </Button>
      </div>
    </div>
  )
}
