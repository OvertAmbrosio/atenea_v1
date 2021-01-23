export type IUsuario = {
  readonly email: string,
  password?: string,
  readonly imagen?: string,
  readonly cargo: number
  readonly activo?: boolean
};

export type IAuth = {
  readonly email?: string,
  readonly carnet?: string,
  readonly pasword: string
}