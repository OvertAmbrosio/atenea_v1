import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { DatePicker, Descriptions, Input, Modal, Select } from 'antd';

import moment from 'moment';
import metodos from '../../../constants/metodos';
import cogoToast from 'cogo-toast';

const { Option } = Select;

function ModalEmpleado({
  accion, 
  visible, 
  abrir, 
  empleado={}, 
  cargos=[],
  tipos=[],
  areas=[],
  zonas=[],
  contratas=[], 
  guardar
}) {
  const [empleadoObj, setEmpleadoObj] = useState({carnet: null, numero_documento:null});

  useEffect(() => {
    if (empleado._id) {
      setEmpleadoObj({
        ...empleado,
        cargo: empleado.cargo ? empleado.cargo._id : null,
        tipo_empleado:  empleado.tipo_empleado ? empleado.tipo_empleado._id : null,
        area: empleado.area ? empleado.area._id : null,
        zonas: empleado.zonas ? empleado.zonas.map((e) => e._id) : null,
        contrata: empleado.contrata ? empleado.contrata._id : null
      }) 
    }
  //eslint-disable-next-line
  },[empleado]);

  async function onOk() {
    if (accion === "editar" && !empleadoObj._id) return cogoToast.warn("No se encuentra el ID del Usuario", {position: "top-right"});
    if (!empleadoObj.usuario && !empleadoObj.usuario.email) return cogoToast.warn("Falta el Email", {position: "top-right"});
    if (!empleadoObj.nombre) return cogoToast.warn("Falta el nombre", {position: "top-right"});
    if (!empleadoObj.cargo) return cogoToast.warn("Falta el Cargo", {position: "top-right"});
    if (!empleadoObj.area) return cogoToast.warn("Falta el Area", {position: "top-right"});
    if (!empleadoObj.tipo_empleado) return cogoToast.warn("Falta el Tipo de Empleado", {position: "top-right"});
    if (!empleadoObj.numero_documento) return cogoToast.warn("Falta el Número de Documento", {position: "top-right"});
    
    await guardar({
      id: empleadoObj._id, 
      metodo: accion === "crear" ?  metodos.EMPLEADOS_CREAR : metodos.EMPLEADOS_ACTUALIZAR, 
      email: empleadoObj.usuario.email, 
      empleado: empleadoObj
    });
    
  };

  return (
    <Modal
      width="75vw"
      okButtonProps={{ size:"small" }}
      cancelButtonProps={{ size:"small" }}
      cancelText="Cancelar"
      okText="Guardar"
      title={accion === 'crear' ? "Crear Empleado": "Editar Empleado"}
      visible={visible}
      onOk={onOk}
      onCancel={abrir}
      destroyOnClose
      centered
    >
      <Descriptions bordered size="small" column={4}>
        <Descriptions.Item label="Nombre:" span={2}>
          <Input
            placeholder="Nombre"
            size="small"
            value={empleadoObj && empleadoObj.nombre ? empleadoObj.nombre : null}
            onChange={(e) => setEmpleadoObj({...empleadoObj, nombre: e.target.value})}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Apellidos:" span={2}>
          <Input
            placeholder="Nombre"
            size="small"
            value={empleadoObj && empleadoObj.apellidos ? empleadoObj.apellidos : null}
            onChange={(e) => setEmpleadoObj({...empleadoObj, apellidos: e.target.value })}
          />
        </Descriptions.Item>
        
        <Descriptions.Item label="Email:" span={2}>
          <Input
            placeholder="Email"
            size="small"
            type="email"
            value={empleadoObj && empleadoObj.usuario && empleadoObj.usuario.email ? empleadoObj.usuario.email : null}
            onChange={(e) => setEmpleadoObj({...empleadoObj, usuario: { email: e.target.value } })}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Carnet:" span={1}>
          <Input
            placeholder="Carnet"
            size="small"
            value={empleadoObj && empleadoObj.carnet ? empleadoObj.carnet : null}
            onChange={(e) => setEmpleadoObj({...empleadoObj, carnet: e.target.value })}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Cargo:" span={1}>
          <Select 
            size="small" 
            style={{ width: "100%" }}
            placeholder="Seleccionar Cargo"
            disabled={accion === "editar"}
            value={empleadoObj && empleadoObj.cargo ? empleadoObj.cargo : null} 
            onChange={(e) => setEmpleadoObj({...empleadoObj, cargo: e})}
          >
          {
            cargos && cargos.length > 0 ?
            cargos.map((obj,i) => (
              <Option key={i} value={obj._id}>{obj.nombre}</Option>
            )):null
          }
          </Select>
        </Descriptions.Item>
       
        <Descriptions.Item label="Tipo:" span={2}>
          <Select 
            size="small" 
            style={{ width: "100%" }}
            placeholder="Seleccionar Tipo"
            value={empleadoObj && empleadoObj.tipo_empleado ? empleadoObj.tipo_empleado : null} 
            onChange={(e) => setEmpleadoObj({...empleadoObj, tipo_empleado: e})}
          >
          {
            tipos && tipos.length > 0 ?
            tipos.map((obj, i) => (
              <Option key={i} value={obj._id}>{obj.nombre}</Option>
            )):null
          }
          </Select>
        </Descriptions.Item>
        <Descriptions.Item label="Area:" span={1}>
          <Select 
            size="small" 
            style={{ width: "100%" }}
            placeholder="Seleccionar Area"
            value={empleadoObj && empleadoObj.area ? empleadoObj.area : null} 
            onChange={(e) => setEmpleadoObj({...empleadoObj, area: e})}
          >
          {
            areas && areas.length > 0 ?
            areas.map((obj, i) => (
              <Option key={i} value={obj._id}>{obj.nombre}</Option>
            )):null
          }
          </Select>
        </Descriptions.Item>
        <Descriptions.Item label="Contrata:" span={1}>
          <Select 
            size="small"
            placeholder="Seleccionar Contrata"
            style={{ width: "100%" }}
            value={empleadoObj && empleadoObj.contrata ? empleadoObj.contrata : null} 
            onChange={(e) => setEmpleadoObj({...empleadoObj, contrata: e})}
          >
          {
            contratas && contratas.length > 0 ?
            contratas.map((obj,i) => (
              <Option key={i} value={obj._id}>{obj.nombre}</Option>
            )):null
          }
          </Select>
        </Descriptions.Item>
        
        <Descriptions.Item label="Zonas:" span={2}>
          <Select 
            size="small" 
            mode="multiple"
            placeholder="Seleccionar Zonas"
            style={{ width: "100%" }}
            value={empleadoObj && empleadoObj.zonas ? empleadoObj.zonas : []}
            onChange={(e) => setEmpleadoObj({...empleadoObj, zonas: e})} 
          >
          {
            zonas && zonas.length > 0 ?
            zonas.map((obj) => (
              <Option key={obj._id}>{obj.nombre}</Option>
            )):null
          }
          </Select>
        </Descriptions.Item>
        <Descriptions.Item label="Fecha de Ingreso:" span={1}>
          <DatePicker
            size="small"
            placeholder="Fecha de Ingreso"
            value={empleadoObj && empleadoObj.fecha_ingreso ? moment(empleadoObj.fecha_ingreso) : null}
            onChange={(e) => setEmpleadoObj({...empleadoObj, fecha_ingreso: e.toDate()})}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Fecha de Nacimiento:" span={1}>
          <DatePicker
            size="small"
            placeholder="Fecha de Nacimiento"
            value={empleadoObj && empleadoObj.fecha_nacimiento ? moment(empleadoObj.fecha_nacimiento) : null}
            onChange={(e) => setEmpleadoObj({...empleadoObj, fecha_nacimiento: e ? e.toDate(): e})}
          />
        </Descriptions.Item>
        
        <Descriptions.Item label="Numero de Documento:" span={2}>
          <Input
            placeholder="Documento de Identidad"
            size="small"
            value={empleadoObj && empleadoObj.numero_documento ? empleadoObj.numero_documento : null}
            onChange={(e) => setEmpleadoObj({...empleadoObj, numero_documento: e.target.value})}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Tipo de Documento:" span={1}>
          <Select 
            size="small"
            style={{ width: "100%"}}
            placeholder="Tipo Documento"
            value={empleadoObj && empleadoObj.tipo_documento ? empleadoObj.tipo_documento : null}
            onChange={(e) => setEmpleadoObj({...empleadoObj, tipo_documento: e})}
          >
            <Option value="DNI">DNI</Option>
            <Option value="OTRO">OTRO</Option>
          </Select>
        </Descriptions.Item>
        <Descriptions.Item label="Nacionalidad:" span={1}>
          <Input
            placeholder="Nacionalidad"
            size="small"
            value={empleadoObj && empleadoObj.nacionalidad ? empleadoObj.nacionalidad : null}
            onChange={(e) => setEmpleadoObj({...empleadoObj, nacionalidad: e.target.value})}
          />
        </Descriptions.Item>
        
        <Descriptions.Item label="Observacion:" span={4}>
          <Input
            placeholder="Observacion"
            size="small"
            value={empleadoObj && empleadoObj.observacion ? empleadoObj.observacion : null}
            onChange={(e) => setEmpleadoObj({...empleadoObj, observacion: e.target.value})}
          />
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  )
};

ModalEmpleado.propTypes = {
  accion: PropTypes.string,
  visible: PropTypes.bool,
  abrir: PropTypes.func,
  empleado: PropTypes.object,
  cargos: PropTypes.array,
  tipos: PropTypes.array,
  areas: PropTypes.array,
  zonas: PropTypes.array,
  contratas: PropTypes.array,
  guardar: PropTypes.func
};

export default ModalEmpleado;


