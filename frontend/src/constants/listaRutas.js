import cargos from './cargos';

export const rutas = {
  login: "/login",
  dashboard: "/dashboard",
  listaPersonal: "/lista-personal",
  listaContratas: "/lista-contratas",
  listaRutas: "/lista-rutas",
  adminAveriasHfc: "/administrar-ordenes/averias-hfc",
  adminAltasHfc: "/administrar-ordenes/altas-hfc",
  adminBasicas: "/administrar-ordenes/basicas",
  adminspeedy: "/administrar-ordenes/speedy",
  gestionarAveriasHfc: "/gestionar-ordenes/averias-hfc",
  gestionarAltasHfc: "/gestionar-ordenes/altas-hfc",
  gestionarBasicas: "/gestionar-ordenes/basicas",
  gestionarspeedy: "/gestionar-ordenes/speedy",
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
  gestionarOrdenes: [
    cargos.ADMINISTRADOR,
    cargos.JEFE_OPERACIONES,
    cargos.LIDER_GESTION,
    cargos.GESTOR
  ]
};