import { IEmpleado } from "src/api/empleados/interfaces/empleados.interface";
import { THistorial } from "src/helpers/types"

export class CreateOrdeneDto {
  readonly tipo?: string;
  readonly codigo_zonal?: string;
  readonly codigo_requerimiento: string;
  readonly codigo_trabajo?: string;
  readonly codigo_peticion?: string;
  readonly codigo_cliente?: string;
  readonly nombre_cliente?: string;
  readonly codigo_ctr?: number;
  readonly descripcion_ctr?: string;
  readonly codigo_nodo?: string;
  readonly codigo_troba?: string;
  readonly distrito?: string;
  readonly direccion?: string;
  readonly fecha_asignado?: Date;
  readonly fecha_registro?: Date;
  readonly codigo_motivo?: string;
  readonly detalle_motivo?: string;
  readonly tipo_requerimiento?: string;
  readonly indicador_pai?: string;
  readonly detalle_trabajo?: string;
  readonly telefono_contacto?: string;
  readonly telefono_referencia?: string;
  readonly numero_reiterada?: string;
  readonly tipo_tecnologia?: string;
  ///////////////////////////////////////
  readonly historial_registro: THistorial[];
}
