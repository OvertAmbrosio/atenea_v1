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
  readonly page: number,
  readonly limit: number,
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
  readonly requerimiento: string,
  readonly tecnico?: string,
  readonly estado: string,
  readonly bucket: string,
  readonly subtipo_actividad?: string,
  readonly fecha_cita: string,
  readonly sla_inicio: string,
  readonly sla_fin: string
};

type TImagenRegistro = {
  readonly url: string
  readonly public_id: string
}
export type THistorial = {
  readonly fecha_entrada?: Date,
  readonly estado_orden?: string,
  readonly contrata_modificado?: IContrata['_id'],
  readonly empleado_modificado?: IEmpleado['_id'],
  readonly usuario_entrada: IEmpleado['_id']
  readonly imagenes?: Array<TImagenRegistro>,
  readonly observacion: string,
  readonly grupo_entrada: number
}