import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Select, Table } from 'antd';
import cogoToast from 'cogo-toast';
import { useJsonToCsv } from 'react-json-csv';

import { obtenerFiltroId } from '../../../libraries/obtenerFiltro';
import { getEmpleados, patchEmpleados } from '../../../services/apiEmpleado';
import metodos from '../../../constants/metodos';
import moment from 'moment';


const { Option } = Select;

function AsignarVista({vistas=[]}) {
  const [listaEmpleados, setListaEmpleados] = useState([]);
  const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState([]);
  const [filtroCargo, setFiltroCargo] = useState([]);
  const [vistasSeleccionadas, setVistasSeleccionadas] = useState([]);
  const [loadingAsignar, setLoadingAsignar] = useState(false);
  const { saveAsCsv } = useJsonToCsv();

  useEffect(() => {
    cargarTodoEmpleados()
  },[]);

  useEffect(() => {
    if (listaEmpleados && listaEmpleados.length > 0) cargarFiltros();
  //eslint-disable-next-line
  },[listaEmpleados]);

  async function cargarTodoEmpleados() {
    setLoadingAsignar(true);
    await getEmpleados(true, { metodo: metodos.EMPLEADOS_TODO_ROOT }).then(({data}) => {
      if (data && data.length > 0) {
        console.log(data);
        setListaEmpleados(data)
      } else {
        setListaEmpleados([]);
      }
    }).catch((err) => console.log(err)).finally(() => setLoadingAsignar(false));
  };

  function cargarFiltros() {
    setFiltroCargo(obtenerFiltroId(listaEmpleados, "cargo", false))
  };

  async function asignarVista() {
    if (vistasSeleccionadas.length < 0 || empleadosSeleccionados.length < 0) return cogoToast.warn('Asignar primero', { position: "top-right"});
    await patchEmpleados(true, { 
      metodo: metodos.EMPLEADOS_AGREGAR_VISTAS,
      vistas: vistasSeleccionadas,
      empleados: empleadosSeleccionados  
    }).catch((err) => console.log(err)).finally(() => cargarTodoEmpleados());
  };

  const exportarTecnicos = () => {
    if (listaEmpleados && listaEmpleados.length > 0) {
      return saveAsCsv({ 
        data: listaEmpleados.map((o) => {
          return ({
            ...o,
            nombre: o.nombre ? o.nombre : '-',
            apellidos: o.apellidos ? o.apellidos: '-',
            dni: o.numero_documento,
            cargo: o.cargo && o.cargo.nombre ? o.cargo.nombre : '',
            contrata: o.contrata ? o.contrata.nombre : '-'
          })
        }), 
        fields: {
          nombre: 'Nombre',
          apellidos: "Apellido",
          dni: "DNI",
          contrata: 'Contrata',
          cargo: "Cargo"
        }, 
        filename: `data_personal_${moment().format('DD_MM_YY_HH_mm')}`
      })
    }
  };

  const columnas = [
    {
      title: "Empleado",
      dataIndex: "apellidos",
      ellipsis:{
        title: true
      },
      width: 150,
    },
    {
      title: "Cargo",
      dataIndex: "cargo",
      filters: filtroCargo,
      onFilter: (v,r) => {
        if (v === '-') {
          return !r.cargo
        } else if( r.cargo !== undefined) {
          return r.cargo._id.indexOf(v) === 0
        } else {
          return false
        }
      },
      render: (cargo) => cargo && cargo.nombre ? cargo.nombre : ''
    },
    {
      title: "Vistas",
      dataIndex: "vistas",
      render: (vista) => vista.length
    }
  ];

  return (
    <div>
      <Select
        allowClear
        mode="multiple"
        style={{ width: '60vw' }}
        size="small"
        value={vistasSeleccionadas}
        onChange={(e) => setVistasSeleccionadas(e)}
      >
      {
        vistas && vistas.length > 0 ? 
        vistas.map((vista, i) => (
          <Option key={i} value={vista._id}>{`${vista.titulo} - ${vista.ruta}`}</Option>
        )):null
      }
      </Select>
      <Button onClick={asignarVista}>Agregar</Button>
      <Table
        rowKey="_id"
        loading={loadingAsignar}
        rowSelection={{
          columnWidth: 30,
          selectedRowKeys: empleadosSeleccionados,
          onChange: (e) => setEmpleadosSeleccionados(e)
        }}
        size="small"
        columns={columnas}
        dataSource={listaEmpleados}
        pagination={{
          defaultPageSize: 50,
          pageSizeOptions: [50,100,200]
        }}
        scroll={{ y: '65vh' }}
      />
      <Button onClick={exportarTecnicos}>Exportar</Button>
    </div>
  )
}

AsignarVista.propTypes = {

}

export default AsignarVista

