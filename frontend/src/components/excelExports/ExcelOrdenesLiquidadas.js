import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export';
import { Menu } from 'antd';
import moment from 'moment';
import cogoToast from 'cogo-toast';

import capitalizar from '../../libraries/capitalizar'
import { getOrdenes } from '../../services/apiOrden';
import { tipoOrdenes } from '../../constants/tipoOrden';
import { colorEstado, colorHora } from '../../libraries/colorEstado';
import { ordenes } from '../../constants/metodos';

function ExcelOrdenesLiquidadas({ tipo, setLoading, ordenesSeleccionadas=[], fechaInicio, fechaFin}) {
  const [dataOrdenes, setDataOrdenes] = useState([]);
  let exportarRef = useRef(null);

  async function exportarExcel(numero) {
    if (numero === 2 && ordenesSeleccionadas.length <= 0) {
      return cogoToast.warn('Debes seleccionar algunas ordenes primero.', { position: 'top-right' });
    } else if (numero === 3 && !fechaInicio) {
      return cogoToast.warn('Debes seleccionar la fecha de inicio.', { position: 'top-right' });
    } else if (numero === 3 && !fechaFin) {
      return cogoToast.warn('Debes seleccionar la fecha de fin.', { position: 'top-right' });
    } else {
      setLoading(true);
      return await getOrdenes(true, { 
        metodo: ordenes.EXPORTAR_LIQUIDADAS, 
        todo: numero === 1 ? true : false, 
        tipo, 
        id_ordenes: ordenesSeleccionadas, 
        fechaInicio: numero === 3 ? fechaInicio : null, 
        fechaFin: numero === 3 ? fechaFin : null, 
      }).then(async({data}) => await actualizarEstadoData(data))
        .then(() => guardarArchivo(exportarRef.current))
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    };
  };

  function guardarArchivo(component) {
    try {
      let options = component.workbookOptions();
      let rows = options.sheets[0].rows;
      let indexTipo = -1;
      let indexEstado = -1;
      let indexEstadoGestor = -1;
      let indexEstadoLiquidado = -1;
      let indexHoraRegistro = -1;
      let indexHoraAsignado = -1;
      let indexFechaCita = -1;
      rows.forEach((row) => {
        if (row.type === 'header') {
          indexTipo = row.cells.findIndex((e) => e.value === 'Negocio');
          indexEstado = row.cells.findIndex((e) => e.value === 'Estado Toa');
          indexEstadoGestor = row.cells.findIndex((e) => e.value === 'Estado Gestor');
          indexEstadoLiquidado = row.cells.findIndex((e) => e.value === 'Estado Liquidado');
          indexHoraRegistro = row.cells.findIndex((e) => e.value === 'Horas Registro');
          indexHoraAsignado = row.cells.findIndex((e) => e.value === 'Horas Asignado');
          indexFechaCita = row.cells.findIndex((e) => e.value === 'Fecha Cita');
        };
        if (row.type === 'data') {
          row.cells.forEach((cell) => {
            cell.borderBottom = { size: .5 }; 
            cell.borderLeft = { size: .5 };
            cell.borderRight = { size: .5 };
            cell.borderTop = { size: .5 };
          });
          if (indexEstado > -1) {
            row.cells[indexEstado].background = colorEstado(row.cells[indexEstado].value).background;
            row.cells[indexEstado].color = colorEstado(row.cells[indexEstado].value).color;
            row.cells[indexEstado].value = capitalizar(row.cells[indexEstado].value);
            row.cells[indexEstado].textAlign = 'center';
          }
          if (indexEstadoGestor > -1) {
            row.cells[indexEstadoGestor].background = colorEstado(row.cells[indexEstadoGestor].value).background;
            row.cells[indexEstadoGestor].color = colorEstado(row.cells[indexEstadoGestor].value).color;
            row.cells[indexEstadoGestor].value = capitalizar(row.cells[indexEstadoGestor].value);
            row.cells[indexEstadoGestor].textAlign = 'center';
          }
          if (indexEstadoLiquidado > -1) {
            row.cells[indexEstadoLiquidado].background = colorEstado(row.cells[indexEstadoLiquidado].value).background;
            row.cells[indexEstadoLiquidado].color = colorEstado(row.cells[indexEstadoLiquidado].value).color;
            row.cells[indexEstadoLiquidado].value = capitalizar(row.cells[indexEstadoLiquidado].value);
            row.cells[indexEstadoLiquidado].textAlign = 'center';
          }
          if (indexHoraRegistro > -1 && indexFechaCita > -1 && indexTipo > -1) {
            row.cells[indexHoraRegistro].background = colorHora(row.cells[indexHoraRegistro].value, row.cells[indexTipo].value, row.cells[indexFechaCita].value).background;
            row.cells[indexHoraRegistro].color = colorHora(row.cells[indexHoraRegistro].value, row.cells[indexTipo].value, row.cells[indexFechaCita].value).color;
            row.cells[indexHoraRegistro].textAlign = 'center';
          }
          if (indexHoraAsignado > -1 && indexFechaCita > -1 && indexTipo > -1) {
            row.cells[indexHoraAsignado].background = colorHora(row.cells[indexHoraAsignado].value, row.cells[indexTipo].value, row.cells[indexFechaCita].value).background;
            row.cells[indexHoraAsignado].color = colorHora(row.cells[indexHoraAsignado].value, row.cells[indexTipo].value, row.cells[indexFechaCita].value).color;
            row.cells[indexHoraAsignado].textAlign = 'center';
          }
        }
      });
      component.save(options);
    } catch (error) {
      console.log(error);
    }
  };

  async function actualizarEstadoData (data) {
    if (data && data.length > 0) {
      return await setDataOrdenes(data.map((d) => ({
        ...d, 
        fecha_cita: d.fecha_cita ? moment(d.fecha_cita).format('DD/MM/YY'):'-',
        fecha_registro: d.fecha_registro ? moment(d.fecha_registro).format('DD/MM/YY HH:mm'):'-',
        fecha_asignado: d.fecha_asignado ? moment(d.fecha_asignado).format('DD/MM/YY HH:mm'):'-',
        fecha_liquidado: d.fecha_liquidado ? moment(d.fecha_liquidado).format('DD/MM/YY HH:mm'):'-',
        horas_registro: d.fecha_registro ? moment(d.fecha_liquidado).diff(d.fecha_registro, 'hours') : '-',
        horas_asignado: d.fecha_asignado ? moment(d.fecha_liquidado).diff(d.fecha_asignado, 'hours') : '-',
      })))
    } else {
      setDataOrdenes([]);
    }
  }

  const headerOptions = {
    background: '#60CE48', 
    bold: true, 
    fontSize: 17,
    autoWidth: true
  };

  return (
    <Menu>
      <Menu.Item style={{ margin: 0, heigth: '2.1rem' }} key={1} onClick={() => exportarExcel(1)}>Hoy</Menu.Item>
      <Menu.Item style={{ margin: 0, heigth: '2.1rem' }} key={2} onClick={() => exportarExcel(2)}>Seleccionado</Menu.Item>
      <Menu.Item style={{ margin: 0, heigth: '2.1rem' }} key={3} onClick={() => exportarExcel(3)}>Fechas</Menu.Item>
      <ExcelExport
        data={dataOrdenes}
        fileName={`liquidadas_${tipo}_${moment().format('DD_MM_YYYY')}.xlsx`}
        ref={exportarRef}
      >
        {tipo === 'gestor' ? <ExcelExportColumn field="tipo" title="Negocio" locked={true} width={90} headerCellOptions={headerOptions} /> : null}
        <ExcelExportColumn field="codigo_requerimiento" title="Requerimiento" locked={true} width={90} headerCellOptions={headerOptions} />
        <ExcelExportColumn field="tipo_averia" title="Tipo Averia" locked={true} width={90} headerCellOptions={headerOptions} />
        <ExcelExportColumn field="codigo_cliente" title="Codigo Cliente" headerCellOptions={headerOptions} />
        <ExcelExportColumn field="nombre_cliente" title="Cliente" width={340} headerCellOptions={headerOptions} />
        {tipo === 'gestor' || tipo === tipoOrdenes.ALTAS ? <ExcelExportColumn field="codigo_trabajo" title="Orden Trabajo" width={90} headerCellOptions={headerOptions} /> : null}
        {tipo === 'gestor' || tipo === tipoOrdenes.ALTAS ? <ExcelExportColumn field="codigo_peticion" title="Petición" width={90} headerCellOptions={headerOptions} /> : null}
        {tipo === 'gestor' || tipo === tipoOrdenes.ALTAS ? <ExcelExportColumn field="tipo_requerimiento" title="Tipo Req." width={90} headerCellOptions={headerOptions} /> : null}
        <ExcelExportColumn field="tipo_tecnologia" title="Tecnología" width={90} headerCellOptions={headerOptions} />
        {tipo === 'gestor' || tipo === tipoOrdenes.ALTAS ? <ExcelExportColumn field="indicador_pai" title="PAI" width={90} headerCellOptions={headerOptions} /> : null}
        <ExcelExportColumn field="codigo_ctr" title="CTR" width={60} headerCellOptions={headerOptions} />
        <ExcelExportColumn field="codigo_nodo" title="Nodo" width={60} headerCellOptions={headerOptions} />
        <ExcelExportColumn field="codigo_troba" title="Troba" width={60} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="subtipo_actividad" title="Subtipo Actividad" width={170} headerCellOptions={headerOptions}/>
        {tipo === 'gestor' || tipo === tipoOrdenes.AVERIAS ? <ExcelExportColumn field="numero_reiterada" title="Reiterada" width={90} headerCellOptions={headerOptions} /> : null} 
        {tipo === 'gestor' || tipo === tipoOrdenes.AVERIAS ? <ExcelExportColumn field="infancia.codigo_requerimiento" title="Infancia Req." width={90} headerCellOptions={headerOptions} /> : null}
        {tipo === 'gestor' || tipo === tipoOrdenes.AVERIAS ? <ExcelExportColumn field="infancia.codigo_ctr" title="Infancia CTR" width={120} headerCellOptions={headerOptions} /> : null}
        <ExcelExportColumn field="distrito" title="Distrito" width={200} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="bucket" title="Bucket" width={200} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="contrata.nombre" title="Contrata" width={250} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="gestor.nombre" title="Gestor" width={250} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="auditor.nombre" title="Auditor" width={250} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="tecnico.nombre" title="Tecnico Nombre" width={200} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="tecnico.apellidos" title="Tecnico Apellidos" width={200} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="tecnico.carnet" title="Tecnico Carnet" width={120} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="estado_toa" title="Estado Toa" width={120} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="estado_gestor" title="Estado Gestor" width={120} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="estado_liquidado" title="Estado Liquidado" width={120} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="tipo_agenda" title="Time Slot" width={100} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="fecha_cita" title="Fecha Cita" width={100} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="fecha_registro" title="Fecha Registro" width={150} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="fecha_liquidado" title="Fecha Liquidado" width={150} headerCellOptions={headerOptions}/>
        {tipo === 'gestor' || tipo === tipoOrdenes.ALTAS ?  <ExcelExportColumn field="fecha_asignado" title="Fecha Asignado" width={150} headerCellOptions={headerOptions}/> : null}
        {tipo === 'gestor' || tipo === tipoOrdenes.AVERIAS ?  <ExcelExportColumn field="horas_registro" title="Horas Registro" width={90} headerCellOptions={headerOptions}/> : null}
        {tipo === 'gestor' || tipo === tipoOrdenes.ALTAS ?  <ExcelExportColumn field="horas_asignado" title="Horas Asignado" width={90} headerCellOptions={headerOptions}/> : null}
        <ExcelExportColumn field="observacion_gestor" title="Observacion Gestor" width={340} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="observacion_toa" title="Observacion Toa" width={340} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="observacion_liquidado" title="Observacion Liquidado" width={340} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="descripcion_codigo_liquidado" title="Descripción Liquidado" width={150} headerCellOptions={headerOptions}/>
        {tipo !== 'gestor' ? <ExcelExportColumn field="tipo" title="Negocio" locked={true} width={90} headerCellOptions={headerOptions} /> : null}
      </ExcelExport>
    </Menu>
  )
};

ExcelOrdenesLiquidadas.propTypes = {
  tipo: PropTypes.string,
  setLoading: PropTypes.func,
  ordenesSeleccionadas: PropTypes.array,
  fechaInicio: PropTypes.string,
  fechaFin: PropTypes.string
};

export default ExcelOrdenesLiquidadas;

