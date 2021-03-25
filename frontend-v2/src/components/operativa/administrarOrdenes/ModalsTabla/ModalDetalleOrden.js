import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Descriptions, Modal, Spin } from 'antd';
import moment from 'moment';

import { getOrdenes } from '../../../../services/apiOrden';
import metodos from '../../../../constants/metodos';
import { tipoOrdenes } from '../../../../constants/tipoOrden';
import TagHoras from '../../../common/TagHoras';


function ModalDetalleOrden({visible, abrir, requerimiento, tipo}) {
  const [ordenDetalle, setOrdenDetalle] = useState({});
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  useEffect(() => {
    if (requerimiento && visible) {
      buscarDetalleOrden();
    }
  //eslint-disable-next-line
  }, [requerimiento]);

  async function buscarDetalleOrden() {
    setLoadingDetalle(true);
    return await getOrdenes(false, { metodo: metodos.ORDENES_BUSCAR_DETALLE, requerimiento: requerimiento })
      .then(({data}) => { 
        if (data) {
          setOrdenDetalle(data)
        } else {
          setOrdenDetalle({})
        };
      }).catch((err) => console.log(err)).finally(() => setLoadingDetalle(false));
  };

  if (tipo === tipoOrdenes.AVERIAS) {
    return (
      <Modal
        title="Detalle Orden"
        visible={visible}
        onCancel={abrir}
        onOk={abrir}
        width='70vw'
        destroyOnClose
        centered
      >
        {
          loadingDetalle ? 
          <Spin spinning/>
          :
          <Descriptions
            bordered
            size="small"
          >
            <Descriptions.Item label="Requerimiento">{ordenDetalle && ordenDetalle.codigo_requerimiento ? ordenDetalle.codigo_requerimiento : '-'}</Descriptions.Item>
            <Descriptions.Item label="Codigo Cliente">{ordenDetalle && ordenDetalle.codigo_cliente ? ordenDetalle.codigo_cliente : '-'}</Descriptions.Item>
            <Descriptions.Item label="Nodo">{ordenDetalle && ordenDetalle.codigo_nodo ? ordenDetalle.codigo_nodo : '-'}</Descriptions.Item>
            <Descriptions.Item label="Distrito">{ordenDetalle && ordenDetalle.distrito ? ordenDetalle.distrito : ''}</Descriptions.Item>
            <Descriptions.Item label="Telefono">{ordenDetalle && ordenDetalle.telefono_contacto ? ordenDetalle.telefono_contacto : ''}</Descriptions.Item>
            <Descriptions.Item label="Referencia">{ordenDetalle && ordenDetalle.telefono_referencia ? ordenDetalle.telefono_referencia : ''}</Descriptions.Item>
            <Descriptions.Item label="Tecnología">{ordenDetalle && ordenDetalle.tipo_tecnologia ? ordenDetalle.tipo_tecnologia : ''}</Descriptions.Item>
            <Descriptions.Item label="Fecha Cita">{ordenDetalle && ordenDetalle.fecha_cita ? moment(ordenDetalle.fecha_cita).format('DD/MM/YY') : '-'}</Descriptions.Item>
            <Descriptions.Item label="Fecha Registro">{ordenDetalle && ordenDetalle.fecha_registro ? moment(ordenDetalle.fecha_registro).format('DD/MM/YY HH:mm') : '-'}</Descriptions.Item>
            <Descriptions.Item label="Horas">
              {ordenDetalle && ordenDetalle.fecha_registro ? 
              <TagHoras fecha={ordenDetalle.fecha_registro} tipo={ordenDetalle.tipo} tipoAgenda={ordenDetalle.tipo_agenda}/>
              : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Cliente" span={2}>{ordenDetalle && ordenDetalle.nombre_cliente ? ordenDetalle.nombre_cliente : ''}</Descriptions.Item>
            <Descriptions.Item label="Dirección" span={3}>{ordenDetalle && ordenDetalle.direccion ? ordenDetalle.direccion : ''}</Descriptions.Item>
            <Descriptions.Item label="Detalle Trabajo" span={3}>{ordenDetalle && ordenDetalle.detalle_trabajo ? ordenDetalle.detalle_trabajo : ''}</Descriptions.Item>
            <Descriptions.Item label="Observacion Gestor" span={3}>{ordenDetalle && ordenDetalle.observacion_gestor ? ordenDetalle.observacion_gestor : ''}</Descriptions.Item>
            <Descriptions.Item label="Observacion Toa" span={3}>{ordenDetalle && ordenDetalle.observacion_toa ? ordenDetalle.observacion_toa : ''}</Descriptions.Item>
          </Descriptions>
        }
      </Modal>
    )
  } else {
    return (
      <Modal
        title="Detalle Orden"
        visible={visible}
        onCancel={abrir}
        onOk={abrir}
        width='70vw'
        destroyOnClose
        centered
      >
      {
          loadingDetalle ? 
          <Spin spinning/>
          :
          <Descriptions
            bordered
            size="small"
          >
            <Descriptions.Item label="Requerimiento">{ordenDetalle && ordenDetalle.codigo_requerimiento ? ordenDetalle.codigo_requerimiento : '-'}</Descriptions.Item>
            <Descriptions.Item label="Codigo Cliente">{ordenDetalle && ordenDetalle.codigo_cliente ? ordenDetalle.codigo_cliente : '-'}</Descriptions.Item>
            <Descriptions.Item label="Nodo">{ordenDetalle && ordenDetalle.codigo_nodo ? ordenDetalle.codigo_nodo : '-'}</Descriptions.Item>
            <Descriptions.Item label="Distrito">{ordenDetalle && ordenDetalle.distrito ? ordenDetalle.distrito : ''}</Descriptions.Item>
            <Descriptions.Item label="Telefono">{ordenDetalle && ordenDetalle.telefono_contacto ? ordenDetalle.telefono_contacto : ''}</Descriptions.Item>
            <Descriptions.Item label="Referencia">{ordenDetalle && ordenDetalle.telefono_referencia ? ordenDetalle.telefono_referencia : ''}</Descriptions.Item>
            <Descriptions.Item label="Tecnología">{ordenDetalle && ordenDetalle.tipo_tecnologia ? ordenDetalle.tipo_tecnologia : ''}</Descriptions.Item>
            <Descriptions.Item label="Fecha Cita">{ordenDetalle && ordenDetalle.fecha_cita ? moment(ordenDetalle.fecha_cita).format('DD/MM/YY') : '-'}</Descriptions.Item>
            <Descriptions.Item label="Fecha Registro">{ordenDetalle && ordenDetalle.fecha_registro ? moment(ordenDetalle.fecha_registro).format('DD/MM/YY HH:mm') : '-'}</Descriptions.Item>
            <Descriptions.Item label="Horas">
              {ordenDetalle && ordenDetalle.fecha_registro ? 
              <TagHoras fecha={ordenDetalle.fecha_registro} tipo={ordenDetalle.tipo} tipoAgenda={ordenDetalle.tipo_agenda}/>
              : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Cliente" span={2}>{ordenDetalle && ordenDetalle.nombre_cliente ? ordenDetalle.nombre_cliente : ''}</Descriptions.Item>
            <Descriptions.Item label="Dirección" span={3}>{ordenDetalle && ordenDetalle.direccion ? ordenDetalle.direccion : ''}</Descriptions.Item>
            <Descriptions.Item label="Detalle Trabajo" span={3}>{ordenDetalle && ordenDetalle.detalle_trabajo ? ordenDetalle.detalle_trabajo : ''}</Descriptions.Item>
            <Descriptions.Item label="Observacion Gestor" span={3}>{ordenDetalle && ordenDetalle.observacion_gestor ? ordenDetalle.observacion_gestor : ''}</Descriptions.Item>
            <Descriptions.Item label="Observacion Toa" span={3}>{ordenDetalle && ordenDetalle.observacion_toa ? ordenDetalle.observacion_toa : ''}</Descriptions.Item>
          </Descriptions>
        }
      </Modal>
    )
  }
};

ModalDetalleOrden.propTypes = {
  visible: PropTypes.bool,
  abrir: PropTypes.func,
  orden: PropTypes.string,
  tipo: PropTypes.string
};

export default ModalDetalleOrden;

