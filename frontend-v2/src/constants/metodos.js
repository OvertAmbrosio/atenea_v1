export const ordenes = {
  SUBIR_DATA: 'subirData',
  COMPROBAR_INFANCIAS: 'comprobarInfancias',
  SUBIR_INFANCIAS_EXTERNAS: 'subirInfanciasExternas',
  ACTUALIZAR_DATA: 'actualizarLiquidadas',
  CRUZAR_DATA: 'cruzarData',
  ORDENES_HOY: 'obtenerOrdenesPendientes',
  ORDENES_LIQUIDADAS: 'obtenerOrdenesLiquidadas',
  ORDENES_ANULADAS: 'obtenerOrdenesAnuladas',
  ORDENES_OTRAS_BANDEJAS: 'obtenerOrdenesOtrasBandejas',
  EXPORTAR_PENDIENTES: 'exportarPendientes',
  EXPORTAR_LIQUIDADAS: 'exportarLiquidadas',
  EXPORTAR_PENDIENTES_GESTOR: 'exportarPendientesGestor',
  ORDENES_HOY_GESTOR: 'obtenerOrdenesPendientesGestor',
  BUSCAR_REITERADA: 'buscarReiterada',
  BUSCAR_INFANCIA: 'buscarInfancia',
  BUSCAR_REGISTROS: 'buscarRegistro',
  BUSCAR_DETALLE: 'obtenerDetalleOrden',
  AGENDAR_ORDEN: 'agendarOrden',
  AGENDAR_ORDEN_GESTOR: 'agendarOrdenGestor',
  ASIGNAR_ORDEN: 'asignarOrden',
  ACTUALIZAR_ESTADO: 'actualizarEstado',
  AGREGAR_OBSERVACION: 'agregarObservacion',
  // DEVOLVER_ORDEN: 'devolverOrden'
};


const metodos = {
   //AREAS-------------------------------------------------------------
   AREA_CREAR: "crearArea",
   AREA_ACTUALIZAR: "actualizarArea",
   AREA_BORRAR: "borrarArea",
   //ASISTENCIAS-------------------------------------------------------
   ASISTENCIA_CREAR: "asistenciaCrear",
   ASISTENCIA_ACTUALIZAR: "asistenciaActualizar",
   //CARGOS------------------------------------------------------------
   CARGO_CREAR: "crearCargo",
   CARGO_ACTUALIZAR: "actualizarCargo",
   CARGO_BORRAR: "borrarCargo",
   //CONTRATAS---------------------------------------------------------
   CONTRATA_CREAR: "contrataCrear",
   CONTRATA_LISTAR_TODO: "contrataListarTodo",
   CONTRATA_LISTAR_NOMBRES: "contrataListarNombres",
   CONTRATA_EDITAR: "contrataEditar",
   CONTRATA_BAJA: "contrataBaja",
   //EMPLEADOS---------------------------------------------------------
   PERFIL_USUARIO: "perfilUsuario",
   EMPLEADOS_TODO_ROOT: "empleadosListarRoot",
   EMPLEADOS_LISTAR_TODO: "empleadosListarTodo",
   EMPLEADOS_LISTAR_AUDITORES: "empleadoListarAuditores",
   EMPLEADOS_LISTAR_SUPERVISORES: "empleadoListarSupervisores",
   EMPLEADOS_LISTAR_GESTORES: "empleadoListarGestores",
   EMPLEADOS_LISTAR_TECNICOS: "empleadoListarTecnicosGlobal",
   EMPLEADOS_LISTAR_APOYO: "empleadoListarTecnicosApoyo",
   EMPLEADOS_CREAR: "empleadosCrear",
   EMPLEADOS_ACTUALIZAR: "empleadosActualizar",
   EMPLEADOS_LISTAR_COLUMNAS: "empleadosListarColumnas",
   EMPLEADOS_ACTUALIZAR_COLUMNAS:"empleadosActualizarColumnas",
   EMPLEADOS_CAMBIAR_PASS: "empleadosCambiarPassword",
   EMPLEADOS_RESET_PASS: "empleadosResetearPassword",
   EMPLEADOS_CERRAR_SESION: "empleadosCerrarSesion",
   EMPLEADOS_ACTUALIZAR_PERMISOS: "empleadosActualizarPermisos",
   EMPLEADOS_ACTIVAR_CUENTA: "empleadosActivarCuenta",
   EMPLEADOS_EDITAR_ESTADO_EMPRESA: "empleadosEditarEstadoEmpresa",
   EMPLEADOS_ACTUALIZAR_RUTA: "empleadosActualizarRuta",
   EMPLEADOS_AGREGAR_VISTAS: "empleadosAgregarVistas",
   //ORDENES------------------------------------------------------------
   ORDENES_SUBIR_DATA: "ordenesSubirData",
   ORDENES_COMPROBAR_INFANCIAS: "ordenesComprobarInfancias",
   ORDENES_ACTUALIZAR_LIQUIDADAS: "ordenesActualizarLiquidadas",
   ORDENES_OBTENER_PENDIENTES: "ordenesObtenerPendientes",
   ORDENES_OBTENER_P_EXPORTAR: "ordenesObtenerPendientesExportar",
   ORDENES_OBTENER_LIQUIDADAS: "ordenesObtenerLiquidadas",
   ORDENES_OBTENER_OTRAS_BANDEJAS: "ordenesObtenerOtrasBandejas",
   ORDENES_OBTENER_ANULADAS: "ordenesObtenerAnuladas",
   ORDENES_OBTENER_REITERADAS: "ordenesObtenerReiteradas",
   ORDENES_OBTENER_INFANCIA: "ordenesObtenerInfancia",
   ORDENES_BUSCAR_REGISTRO: "ordenesBuscarRegistro",
   ORDENES_BUSCAR_DETALLE: "ordenesBuscarDetalle",
   ORDENES_SOCKET_OBSERVACION: "ordenesObservacion",
   ORDENES_SOCKET_AGENDAR: "ordenesAgendar",
   ORDENES_SOCKET_ASIGNAR: "ordenesAsignar",
   ORDENES_SOCKET_ESTADO: "ordenesEstado",
   ORDENES_SOCKET_PENDIENTES: "obtenerPendientes",
   //TIPOS EMPLEADOS---------------------------------------------------
   TIPOEMPLEADO_CREAR: "crearTipoEmpleado",
   TIPOEMPLEADO_ACTUALIZAR: "actualizarTipoEmpleado",
   TIPOEMPLEADO_BORRAR: "borrarTipoEmpleado",
   //VISTAS------------------------------------------------------------
   VISTA_CREAR: "crearVista",
   VISTA_ACTUALIZAR: "actualizarVista",
   VISTA_BORRAR: "borrarVista",
   //ZONAS-------------------------------------------------------------
   ZONA_CREAR: "crearZona",
   ZONA_ACTUALIZAR: "actualizarZona",
   ZONA_BORRAR: "borrarZona",
   // SOCKET
   CLIENTE_RECIBIR_MENSAJE: "clienteRecibirMensaje",
   UNIR_SALA_PENDIENTES: "unirseSalaPendientes",
   UNIR_SALA_GESTOR_PENDIENTES: "unirseSalaGestorPendientes",
   REGISTRAR_CLIENTE: "registrarCliente"
};



export default metodos;
