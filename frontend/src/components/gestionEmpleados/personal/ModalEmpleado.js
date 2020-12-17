import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select } from 'antd';

import cargos from '../../../constants/cargos';

const { Option } = Select;

function ModalEmpleado({accion, visible, setVisible, empleado={}, contratas=[], guardar}) {
  const [empleadoObj, setEmpleadoObj] = useState({numero_documento: Number(Date.now())});
  const [form] = Form.useForm();

  useEffect(() => {
    if (empleado._id) setEmpleadoObj({
      ...empleado, 
      email: empleado.usuario.email,
      cargo: empleado.usuario.cargo,
      contrata: empleado.contrata && empleado.contrata._id
    });
  },[empleado])


  const limpiar = () => {
    setVisible(false)
  };

  const onOk = () => {
    form.validateFields().then(async(values) => {
      setEmpleadoObj({numero_documento: Date.now()});
      form.resetFields();
      const obj = {
        ...values,
        usuario: {
          email: values.email,
          cargo: values.cargo
        }
      }
      await guardar(obj);
      setVisible(false);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  return (
    <Modal
      width={300}
      cancelText="Cancelar"
      okText="Guardar"
      title={accion === 'crear' ? "Crear Empleado": "Editar Empleado"}
      visible={visible}
      onOk={onOk}
      onCancel={limpiar}
      destroyOnClose={true}
      centered
    >
      <Form
        name="form_empleado"
        layout="vertical"
        size="small"
        form={form}
        initialValues={empleadoObj}
        onValuesChange={(e) => setEmpleadoObj({...empleadoObj, ...e})}
      >
        <Form.Item
          name="nombre"
          label="Nombre"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="apellidos"
          label="Apellidos"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Correo"
          rules={[{ required: true, type: "email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="cargo"
          label="Cargo"
          rules={[{ required: true, type: "number" }]}
        >
          <Select placeholder="Seleccionar cargo" onChange={(e) => setEmpleadoObj({...empleadoObj, cargo: e})} allowClear>
            <Option value={cargos.ASISTENTE_LOGISTICA}>Asistente de Logistica</Option>
            <Option value={cargos.JEFE_CONTRATA}>Jefe de Contrata</Option>
            <Option value={cargos.GESTOR}>Gestor</Option>
            <Option value={cargos.ALMACENERO}>Almacenero</Option>
            <Option value={cargos.AUDITOR}>Auditor</Option>
            <Option value={cargos.TECNICO}>Tecnico</Option>
          </Select>
        </Form.Item>
        {
          empleadoObj.cargo ? empleadoObj.cargo === cargos.TECNICO || empleadoObj.cargo === cargos.AUDITOR ? 
          <Form.Item
            name="carnet"
            label="Carnet"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>:null:null
        }
        {
          contratas && contratas.length > 0 ? 
          <Form.Item
            name="contrata"
            label="Contrata"
            rules={[{ required: true }]}
          >
            <Select placeholder="Seleccionar contrata" onChange={(e) => setEmpleadoObj({...empleadoObj, contrata: e})} allowClear>
            {
              contratas.map((c,i) => (
                <Option key={i} value={c._id}>{c.nombre}</Option>
              ))
            }
            </Select>
          </Form.Item>:null
        }
        <Form.Item 
          name="tipo_documento"
          label="Tipo de Documento"
        >
          <Select placeholder="Seleccionar tipo" onChange={e => setEmpleadoObj({...empleadoObj, tipo_documento: e})} allowClear>
            <Option value="DNI">DNI</Option>
            <Option value="Otro">Otro</Option>
          </Select>
        </Form.Item>
        <Form.Item 
          name="numero_documento"
          label="Numero de Documento"
          rules={[{ required: false, type: 'string' }]}
        >
          <Input/>
        </Form.Item>
      </Form>
    </Modal>
  )
};

ModalEmpleado.propTypes = {
  accion: PropTypes.string,
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  empleado: PropTypes.object,
  contratas: PropTypes.array,
  guardar: PropTypes.func
};

export default ModalEmpleado;


