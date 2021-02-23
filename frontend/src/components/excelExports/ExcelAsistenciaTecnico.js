import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export';
import { Button } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import * as AntColores from '@ant-design/colors'
import moment from 'moment';

import estadoAsistencia from '../../constants/estadoAsistencia';
import capitalizar from '../../libraries/capitalizar'

function ExcelAsistenciaTecnico({ data=[], dias=[], nombre }) {
  let exportarRef = useRef(null);

  const exportarExcel = () => {
    console.log(data);
    guardarArchivo(exportarRef.current)
  };

  function guardarArchivo(component) {
    try {
      let options = component.workbookOptions();
      let rows = options.sheets[0].rows;
      rows.forEach((row) => {
        if (row.type === 'data') {
          row.cells.forEach((cell) => {
            cell.value = cell.value ? String(cell.value).toUpperCase() : cell.value;
            cell.background = colorCelda(cell.value).background;
            cell.color = colorCelda(cell.value).color;
            cell.borderBottom = { size: 1 }; 
            cell.borderLeft = { size: 1 };
            cell.borderRight = { size: 1 };
            cell.borderTop = { size: 1 };
          });
        }
      });
      component.save(options);
    } catch (error) {
      console.log(error);
    }
  };

  const colorCelda = (estado) => {
    switch (estado) {
      case estadoAsistencia.FALTA:
        return {background: AntColores.red[1], color: AntColores.red.primary};
      case 'Inactivo':
        return {background: AntColores.red[1], color: AntColores.red.primary};
      case estadoAsistencia.ASISTIO:
        return {background: AntColores.green[1], color: AntColores.green.primary};
      case estadoAsistencia.DESCANSO:
        return {background: AntColores.gold[1], color: AntColores.gold.primary};
      case estadoAsistencia.PERMISO:
        return {background: AntColores.blue[1], color: AntColores.blue.primary};
      case estadoAsistencia.SUSPENDIDO:
        return {background: AntColores.yellow[1], color: AntColores.yellow.primary};
      case estadoAsistencia.DESCANSO_MEDICO:
        return {background: AntColores.geekblue[1], color: AntColores.geekblue.primary};
      case estadoAsistencia.EXAMEN_MEDICO:
        return {background: AntColores.purple[1], color: AntColores.purple.primary};
      case estadoAsistencia.VACACIONES:
        return {background: AntColores.cyan[1], color: AntColores.cyan.primary};
      case estadoAsistencia.BAJA:
        return {background: AntColores.volcano[1], color: AntColores.volcano.primary};
      default:
        return {background: '', color: ''};
    };
  };

  const headerOptions = {
    background: '#5DADE2', 
    bold: true, 
    fontSize: 17,
    wrap: false,
    autoWidth: true
  };

  return (
    <div>
      <Button icon={<ExportOutlined />} type="primary" onClick={exportarExcel} >Exportar</Button>
      <ExcelExport
        data={data.map((e) => ({...e, cargo: capitalizar(nombre)}))}
        fileName={`asistencia_${nombre}_${moment().format('DD_MM_YYYY')}.xlsx`}
        ref={exportarRef}
      >
        <ExcelExportColumn field="nombre" title="Nombre" locked={true} width={170} headerCellOptions={headerOptions} />
        <ExcelExportColumn field="apellidos" title="Apellidos" locked={true} width={150} headerCellOptions={headerOptions} />
        <ExcelExportColumn field="carnet" title="Carnet" locked={true} width={150} headerCellOptions={headerOptions} />
        <ExcelExportColumn field="dni" title="DNI" locked={true} width={150} headerCellOptions={headerOptions} />
        <ExcelExportColumn field="estado_empresa" title="Estado" width={90} headerCellOptions={headerOptions} />
        <ExcelExportColumn field="cargo" title="Cargo" width={90} headerCellOptions={headerOptions}/>
        <ExcelExportColumn field="contrata.nombre" title="Contrata" width={170} locked={true} headerCellOptions={headerOptions} />
        <ExcelExportColumn field="auditor.apellidos" title="Auditor" width={170} locked={true} headerCellOptions={headerOptions} />
        <ExcelExportColumn field="gestor.apellidos" title="Gestor" width={170} locked={true} headerCellOptions={headerOptions} />
        <ExcelExportColumn field="tipo_negocio" title="Negocio" width={90} locked={true} headerCellOptions={headerOptions} />
        <ExcelExportColumn field="sub_tipo_negocio" title="Sub Negocio" width={90} locked={true} headerCellOptions={headerOptions} />
        {
          dias && dias.length > 0 ?
            dias.map((d, i) => (
              <ExcelExportColumn
                key={i}
                field={`${d}.estado`}
                title={`${d}`} width={60}
                headerCellOptions={headerOptions}
                cellOptions={{ textAlign: 'center'}}
              />
            )) : null
        }
      </ExcelExport>
    </div>
  )
};

ExcelAsistenciaTecnico.propTypes = {
  data: PropTypes.array,
  dias: PropTypes.array,
  nombre: PropTypes.string
};

export default ExcelAsistenciaTecnico;

