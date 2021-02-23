import cargos from './cargos';

export const rutas = {
  login: "/login",
  perfilUsuario: "/perfil-usuario",
  indicadoresGpon: "/dashboard/indicadores-gpon",
  indicadoresHfc: "/dashboard/indicadores-hfc",
  resumenTcfl: "/dashboard/resumen-tcfl",
  listaPersonal: "/lista-personal",
  listaContratas: "/lista-contratas",
  asignarRutas: "/lista-rutas/asignar-rutas",
  listaAsistencia: "/lista-rutas/asistencias",
  adminAveriasHfc: "/administrar-ordenes/averias-hfc",
  adminAltasHfc: "/administrar-ordenes/altas-hfc",
  adminBasicas: "/administrar-ordenes/basicas",
  adminspeedy: "/administrar-ordenes/speedy",
  gestionarAsistencia: "/gestionar-ordenes/asistencia",
  gestionarListaOrdenes: "/gestionar-ordenes/lista-ordenes",
  gestionarLiquidarOrdenes: "/gestionar-ordenes/liquidar-ordenes",
};

export const permisos = {
  todos: cargos.TODO,
  listaContratas: [
    cargos.ADMINISTRADOR,
    cargos.JEFE_OPERACIONES,
    cargos.JEFE_LOGISTICA,
    cargos.LIDER_GESTION
  ],
  grupoOperativa: [
    cargos.ADMINISTRADOR,
    cargos.JEFE_OPERACIONES,
    cargos.JEFE_LOGISTICA,
    cargos.LIDER_GESTION,
    cargos.JEFE_CONTRATA,
    cargos.GESTOR
  ],
  administrarOrdenes: [
    cargos.ADMINISTRADOR,
    cargos.JEFE_OPERACIONES,
    cargos.LIDER_GESTION
  ],
  gestion: [
    cargos.GESTOR
  ]
};