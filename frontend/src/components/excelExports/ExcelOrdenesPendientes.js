import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export';
import { Menu } from 'antd';
import moment from 'moment';

import capitalizar from '../../libraries/capitalizar'
import { getOrdenes } from '../../services/apiOrden';
import { tipoOrdenes } from '../../constants/tipoOrden';
import { colorDia, colorEstado, colorHora } from '../../libraries/colorEstado';

function ExcelOrdenesPendientes({ metodo, tipo, setLoading, ordenesSeleccionadas=[]}) {
  const [dataOrdenes, setDataOrdenes] = useState([]);
  let exportarRef = useRef(null);
  
  useEffect(() => {
    if (dataOrdenes && dataOrdenes.length > 0) {
      guardarArchivo(exportarRef.current)
    }
  },[dataOrdenes]);

  async function exportarExcel(todo) {
    if (!todo && ordenesSeleccionadas.length <= 0) return;
    setLoading(true);
    return await getOrdenes(true, { 
      metodo: metodo, todo, tipo, id_ordenes: ordenesSeleccionadas, 
    }).then(async({data}) => { 
      if (data && data.length > 0) {
        return await setDataOrdenes(data.map((d) => ({
          ...d, 
          infancia_registro: d.infancia && d.infancia.fecha_registro ? moment(d.infancia.fecha_registro).format('DD/MM/YY HH:mm'): '-',
          infancia_liquidado: d.infancia && d.infancia.fecha_liquidado ? moment(d.infancia.fecha_liquidado).format('DD/MM/YY HH:mm'): '-',
          fecha_cita: d.fecha_cita ? moment(d.fecha_cita).format('DD/MM/YY'):'-',
          fecha_registro: d.fecha_registro ? moment(d.fecha_registro).format('DD/MM/YY HH:mm'):'-',
          fecha_asignado: d.fecha_asignado ? moment(d.fecha_asignado).format('DD/MM/YY HH:mm'):'-',
          horas_registro: d.fecha_registro ? moment().diff(d.fecha_registro, 'hours') : '-',
          horas_asignado: d.fecha_asignado ? moment().diff(d.fecha_asignado, 'hours') : '-',
          dias_asignado: d.fecha_asignado ? moment().diff(d.fecha_asignado, 'days') : '-',
        })))
      }
    }).catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  function guardarArchivo(component) {
    try {
      let options = component.workbookOptions();
      let rows = options.sheets[0].rows;
      let indexTipo = -1;
      let indexEstado = -1;
      let indexEstadoGestor = -1;
      let indexHoraRegistro = -1;
      let indexHoraAsignado = -1;
      let indexDiaAsignado = -1;
      let indexFechaCita = -1;
      rows.forEach((row) => {
        if (row.type === 'header') {
          indexTipo = row.cells.findIndex((e) => e.value === 'Negocio');
          indexEstado = row.cells.findIndex((e) => e.value === 'Estado Toa');
          indexEstadoGestor = row.cells.findIndex((e) => e.value === 'Estado Gestor');
          indexHoraRegistro = row.cells.findIndex((e) => e.value === 'Horas Registro');
          indexHoraAsignado = row.cells.findIndex((e) => e.value === 'Horas Asignado');
          indexDiaAsignado = row.cells.findIndex((e) => e.value === 'Dias Asignado');
          indexFechaCita = row.cells.findIndex((e) => e.value === 'Time Slot');
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
          if (indexDiaAsignado > -1 && indexFechaCita > -1) {
            row.cells[indexDiaAsignado].background = colorDia(row.cells[indexDiaAsignado].value, row.cells[indexFechaCita].value).background;
            row.cells[indexDiaAsignado].color = colorDia(row.cells[indexDiaAsignado].value, row.cells[indexFechaCita].value).color;
            row.cells[indexDiaAsignado].textAlign = 'center';
          }
        }
      });
      component.save(options);
    } catch (error) {
      console.log(error);
    }
  };

  const headerOptions = {
    background: '#F3C775', 
    bold: true, 
    fontSize: 17,
    autoWidth: true
  };

  return (
    <Menu>
      <Menu.Item style={{ margin: 0, heigth: '2.1rem' }} key={1} onClick={() => exportarExcel(true)}>Todo</Menu.Item>
      <Menu.Item style={{ margin: 0, heigth: '2.1rem' }} key={2} onClick={() => exportarExcel(false)}>Seleccionado</Menu.Item>
      <ExcelExport
        data={dataOrdenes}
        fileName={`pendientes_${tipo}_${moment().format('DD_MM_YYYY')}.xlsx`}
        ref={exportarRef}
      >
        {tipo === 'gestor' ? <ExcelExportColumn field="tipo" title="Negocio" locked={true} width={90} headerCellOptions={headerOptions} /> : null}
        <ExcelExportColumn field="codigo_requerimiento" title="Requerimiento" locked={true} width={90} headerCellOptions={headerOptions} />
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
        {tipo === 'gestor' || tipo === tipoOrdenes.AVERIAS ? <ExcelExportColumn field="infancia.tecnico_liquidado.apellidos" title="Infancia Tecnico" width={200} headerCellOptions={headerOptions} /> : null}
        {tipo === 'gestor' || tipo === tipoOrdenes.AVERIAS ? <ExcelExportColumn field="infancia.tecnico_liquidado.carnet" title="Infancia Carnet" width={120} headerCellOptions={headerOptions} /> : null}
        {tipo === 'gestor' || tipo === tipoOrdenes.AVERIAS ? <ExcelExportColumn field="infancia_registro" title="Infancia Registro" width={120} headerCellOptions={headerOptions} /> : null}
        {tipo === 'gestor' || tipo === tipoOrdenes.AVERIAS ? <ExcelExportColumn field="infancia_liquidado" title="Infancia Liquidado" width={120} headerCellOptions={headerOptions} /> : null}
        <ExcelExportColumn field="distrito" title="Distrito" width={200} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="direccion" title="Dirección" width={300} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="bucket" title="Bucket" width={200} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="contrata.nombre" title="Contrata" width={250} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="gestor_liteyca.nombre" title="Gestor Asignado" width={250} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="auditor.nombre" title="Auditor" width={250} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="tecnico_liteyca.nombre" title="Tecnico Nombre" width={200} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="tecnico_liteyca.apellidos" title="Tecnico Apellidos" width={200} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="tecnico_liteyca.carnet" title="Tecnico Carnet" width={120} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="estado_toa" title="Estado Toa" width={120} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="estado_gestor" title="Estado Gestor" width={120} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="tipo_agenda" title="Time Slot" width={100} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="fecha_cita" title="Fecha Cita" width={100} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="fecha_registro" title="Fecha Registro" width={150} headerCellOptions={headerOptions}/>
        {tipo === 'gestor' || tipo === tipoOrdenes.ALTAS ?  <ExcelExportColumn field="fecha_asignado" title="Fecha Asignado" width={150} headerCellOptions={headerOptions}/> : null}
        {tipo === 'gestor' || tipo === tipoOrdenes.AVERIAS ?  <ExcelExportColumn field="horas_registro" title="Horas Registro" width={90} headerCellOptions={headerOptions}/> : null}
        {tipo === 'gestor' || tipo === tipoOrdenes.ALTAS ?  <ExcelExportColumn field="horas_asignado" title="Horas Asignado" width={90} headerCellOptions={headerOptions}/> : null}
        {tipo === 'gestor' || tipo === tipoOrdenes.ALTAS ?  <ExcelExportColumn field="dias_asignado" title="Dias Asignado" width={90} headerCellOptions={headerOptions}/> : null}
        <ExcelExportColumn field="detalle_trabajo" title="Detalle Ttrabajo" width={340} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="observacion_gestor" title="Observacion Gestor" width={340} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="observacion_toa" title="Observacion Toa" width={340} headerCellOptions={headerOptions}/>
        {tipo !== 'gestor' ? <ExcelExportColumn field="tipo" title="Negocio" locked={true} width={90} headerCellOptions={headerOptions} /> : null}
      </ExcelExport>
    </Menu>
  )
};

ExcelOrdenesPendientes.propTypes = {
  metodo: PropTypes.string,
  tipo: PropTypes.string,
  setLoading: PropTypes.func,
  ordenesSeleccionadas: PropTypes.array,
};

export default ExcelOrdenesPendientes;

