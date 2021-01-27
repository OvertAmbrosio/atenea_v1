import { IContrata } from "src/api/contratas/interfaces/contrata.interface";
import { IEmpleado } from "src/api/empleados/interfaces/empleados.interface";

export type TRespuesta = {
  readonly status: string,
  readonly message: string,
  readonly data?: Array<any> | any
};

export type TErrorsLogin = {
  readonly username?: string,
  readonly message?: string,
  readonly password?: string,
};

export type TPaginateParams = {
  readonly metodo: string,
  readonly tipo?: string,
  readonly page?: number,
  readonly limit?: number,
  readonly fecha_inicio?: string,
  readonly fecha_fin?: string,
};

export type TPayload = {
  readonly nombre: string,
  readonly id: string,
  readonly gestor: string,
  readonly contrata: string,
  readonly cargo: number,
  readonly imagen: string
};

export type TOrdenesToa = {
  tipo: string,
  requerimiento: string,

  codigo_cliente?: string,
  nombre_cliente?: string,
  direccion?: string,
  fecha_cancelado?: string|Date,
  observacion_toa?: string,

  tecnico?: IEmpleado,
  gestor?: string|IEmpleado,
  gestor_liquidado_toa?: string|IEmpleado,
  auditor?: string|IEmpleado,
  contrata?: string|IContrata,
  estado?: string,
  estado_toa?: string,
  estado_indicador_toa?:string,
  bucket?: string,
  subtipo_actividad?: string,
  fecha_cita?: string|Date,
  tipo_agenda?:string,
  motivo_no_realizado: string,
  sla_inicio?: string|Date,
  sla_fin?: string|Date,

  fecha_pre_no_realizado?: string|Date,
  fecha_registro_legados?: string|Date,
};

export type TInfanciasExternas = {
  readonly codigo_requerimiento: string,
  readonly codigo_trabajo?: string,
  readonly codigo_cliente?: string,
  readonly nombre_cliente?: string,
  readonly codigo_ctr?: string,
  readonly fecha_liquidado?: Date,
  readonly observacion_liquidado?: string,
}

type TImagenRegistro = {
  readonly url: string,
  readonly public_id: string
};

export type THistorial = {
  readonly fecha_entrada?: Date,
  readonly estado_orden?: string,
  readonly contrata_modificado?: IContrata['_id'],
  readonly empleado_modificado?: IEmpleado['_id'],
  readonly usuario_entrada: IEmpleado['_id']
  imagenes?: Array<TImagenRegistro>,
  readonly observacion: string,
  readonly grupo_entrada?: number
};

export type TBodyUpdateOrden = {
  metodo?: string,
  id:string,
  ordenes?: string[],
  bucket?: string,
  tecnico?: string,
  auditor?: string,
  gestor?: string,
  contrata?: string,
  fecha_cita?: string,
  estado?: string,
  observacion?:string,
};
