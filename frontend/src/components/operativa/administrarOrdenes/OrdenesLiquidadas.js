import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Button, Dropdown, Menu, Table } from 'antd';
import { ExportOutlined, LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useJsonToCsv } from 'react-json-csv';

import { getOrdenes } from '../../../services/apiOrden';
import { ordenes } from '../../../constants/metodos';
import { valoresExcelPendientes } from '../../../constants/valoresOrdenes';
import cogoToast from 'cogo-toast';

function OrdenesLiquidadas({tipo}) {
  const [totalOrdenes, setTotalOrdenes] = useState([]);
  const [dataOrdenes, setDataOrdenes] = useState([]);
  const [ordenesSeleccionadas, setOrdenesSeleccionadas] = useState([]);
  const [loadingOrdenes, setLoadingOrdenes] = useState(false);
  const [loadingExportar, setLoadingExportar] = useState(false);
  const { saveAsCsv } = useJsonToCsv();

  useEffect(() => {
    listarOrdenes();
  // eslint-disable-next-line
  },[]);

  async function listarOrdenes() {
    setLoadingOrdenes(true);
    setOrdenesSeleccionadas([]);
    await getOrdenes(true, { metodo: ordenes.ORDENES_LIQUIDADAS, tipo })
      .then(({data}) => {
        if (data && data.length > 0) {
          setTotalOrdenes(data);
          setDataOrdenes(data);
        }
      }).catch((err) => console.log(err)).finally(() => setLoadingOrdenes(false));
  };

  async function exportarExcel(todo) {
    setLoadingExportar(true);
    return await getOrdenes(true, { 
      metodo: ordenes.EXPORTAR_PENDIENTES, todo, tipo, id_ordenes: ordenesSeleccionadas, 
    }).then(({data}) => {
      if (data && data.length > 0) {
        return data.map((o) => ({
          ...o,
          infancia_requerimiento: o.infancia && o.infancia.codigo_requerimiento ? o.infancia.codigo_requerimiento: '-',
          infancia_tecnico_nombre: o.infancia && o.infancia.tecnico_liquidado ? o.infancia.tecnico_liquidado.nombre+' '+o.infancia.tecnico_liquidado.apellidos:'-',
          infancia_tecnico_carnet: o.infancia && o.infancia.tecnico_liquidado ? o.infancia.tecnico_liquidado.carnet:'-',
          infancia_tecnico_gestor: o.infancia && o.infancia.tecnico_liquidado && o.infancia.tecnico_liquidado.gestor ? o.infancia.tecnico_liquidado.gestor.nombre+' '+o.infancia.tecnico_liquidado.gestor.apellidos:'-',
          infancia_registro: o.infancia && o.infancia.fecha_registro ? moment(o.infancia.fecha_registro).format('DD/MM/YY HH:mm'): '-',
          infancia_liquidado: o.infancia && o.infancia.fecha_liquidado ? moment(o.infancia.fecha_liquidado).format('DD/MM/YY HH:mm'): '-',
          infancia_externa_requerimiento: o.infancia_externa ? o.infancia_externa.codigo_requerimiento : '-',
          infancia_externa_ctr: o.infancia_externa ? o.infancia_externa.codigo_ctr : '-',
          infancia_externa_observacion: o.infancia_externa ? o.infancia_externa.observacion : '-',
          contrata: o.contrata && o.contrata.nombre ? o.contrata.nombre : '-',
          gestor: o.gestor && o.gestor.nombre ? o.gestor.nombre+' '+ o.gestor.apellidos : '-',
          gestor_carnet: o.gestor && o.gestor.carnet ? o.gestor.carnet : '-',
          auditor: o.auditor && o.auditor.nombre ? o.auditor.nombre+' '+o.auditor.apellidos : '-',
          tecnico: o.tecnico && o.tecnico.nombre ? o.tecnico.nombre+' '+o.tecnico.apellidos : '-',
          tecnico_carnet: o.tecnico && o.tecnico.carnet ? o.tecnico.carnet : '-',
          fecha_cita: o.fecha_cita ? moment(o.fecha_cita).format('DD/MM/YY HH:mm'):'-',
          fecha_registro: o.fecha_registro ? moment(o.fecha_registro).format('DD/MM/YY HH:mm'):'-',
          fecha_asignado: o.fecha_asignado ? moment(o.fecha_asignado).format('DD/MM/YY HH:mm'):'-',
          fecha_liquidado: o.fecha_liquidado ? moment(o.fecha_liquidado).format('DD/MM/YY HH:mm'):'-',
          horas_registro: o.fecha_registro ? moment().diff(o.fecha_registro, 'hours') : '-',
          horas_asignado: o.fecha_asignado ? moment().diff(o.fecha_asignado, 'hours') : '-',
          orden_devuelta: o.orden_devuelta ? 'Si':'-'
        }))
      } else {
        return [];
      };
    }).then((nuevaData) => {
      if (nuevaData && nuevaData.length > 0) {
        return saveAsCsv({ 
          data: nuevaData, 
          fields: valoresExcelPendientes, 
          filename: `data_${tipo}_pendientes_${moment().format('DD_MM_YY_HH_mm')}`
        })
      } else {
        cogoToast.warn('No se encontró datos disponibles.', { position: 'top-right' })
      }
    }).catch((err) => console.log(err)).finally(() => setLoadingExportar(false));
  };

  return (
    <div>
      <div>
        <Button 
          type="primary"
          icon={loadingOrdenes ? <LoadingOutlined spin/>:<ReloadOutlined/>}
          style={{ marginBottom: '1rem', marginRight: '.5rem' }}
          onClick={listarOrdenes}
        >Actualizar</Button>
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key={1} onClick={() => exportarExcel(true)}>
                Todo
              </Menu.Item>
              <Menu.Item key={2} onClick={() => exportarExcel(false)}>
                Seleccionado
              </Menu.Item>
            </Menu>
          } 
          placement="bottomLeft" 
          trigger={['click']}
          arrow
        >
          <Button
            icon={loadingExportar ? <LoadingOutlined spin/>:<ExportOutlined/>}
            style={{ marginBottom: '1rem', marginRight: '.5rem' }}
          >
            Exportar
          </Button>
        </Dropdown>
      </div>
      <Table
        dataSource={dataOrdenes}
        loading={loadingOrdenes}
        size="small"
        scroll={{ y: '65vh' }}
        pagination={{
          defaultPageSize: 50,
          pageSizeOptions: [50,100,200]
        }}
      />
    </div>
  )
};

OrdenesLiquidadas.propTypes = {
  tipo: PropTypes.string
};

export default OrdenesLiquidadas;

