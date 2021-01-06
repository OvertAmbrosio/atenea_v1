export const averias = {
  TIPO: 'averiashfc',
  CODIGO_ZONAL: 'codofcadm',
  CODIGO_REQUERIMIENTO: 'codreq',
  CODIGO_REQUERIMIENTO_2: 'codreqatn',
  CODIGO_CLIENTE: 'codcli',
  NOMBRE_CLIENTE: 'nomcli',
  CODIGO_CTR: 'codctr',
  DESCRIPCION_CTR: 'desnomctr',
  CODIGO_NODO: 'codnod',
  CODIGO_TROBA: 'nroplano',
  DISTRITO: 'desdtt',
  //direccion -START
  destipvia: 'destipvia',
  desnomvia: 'desnomvia',
  numvia: 'numvia',
  despis: 'despis',
  desint: 'desint',
  desmzn: 'desmzn',
  deslot: 'deslot',
  destipurb: 'destipurb',
  desurb: 'desurb',
  //direccion -END
  FECHA_REGISTRO: 'fec_regist',
  CODIGO_MOTIVO: 'codmotv',
  DETALLE_MOTIVO: 'desmotv',
  TIPO_REQUERIMIENTO: 'tipreqfin',
  DETALLE_TRABAJO: 'desobsordtrab',
  TELEFONO_CONTACTO: 'tel_cont_cc',
  TELEFONO_REFERENCIA: 'tel_cont_ref_cc',
  NUMERO_REITERADA: 'numaverei',
  TIPO_TECNOLOGIA: 'tiptecnologia',
  //variables de liquidacion
  FECHA_LIQUIDADA: 'fec_liquid',
  TIPO_AVERIA: 'tipave',
  TECNICO_LIQUIDADO: 'codtecliq',
  USUARIO_LIQUIDADO: 'codusr'
};

export const altas = {
  TIPO: 'altashfc',
  CODIGO_REQUERIMIENTO: 'codreq',
  CODIGO_REQUERIMIENTO_2: 'codreqatn',
  CODIGO_CLIENTE: 'codcli',
  CODIGO_TRABAJO: 'codordtrab',
  CODIGO_CTR: 'codctr',
  DESCRIPCION_CTR: 'desnomctr',
  CODIGO_SEGMENTO: 'codsegmento',
  TIPO_REQUERIMIENTO: 'tipreq',
  CODIGO_MOTIVO: 'codmotv',
  DETALLE_MOTIVO: 'desmotv',
  DETALLE_TRABAJO: 'desobsordtrab',
  FECHA_REGISTRO: 'fechorreg',
  CODIGO_NODO: 'codnod',
  CODIGO_TROBA: 'nroplano',
  DISTRITO: 'desdtt',
  INDICADOR_PAI: 'indpai',
  TELEFONO_CONTACTO: 'telefono_voip',
  TIPO_TECNOLOGIA: 'tiptecnologia',
  MOVISTAR_TOTAL: 'movistar_total'
};

export const valoresExcelAdministrar = {
  codigo_requerimiento: "Requerimiento",
  codigo_ctr: "CTR",
  codigo_nodo: "Nodo",
  codigo_troba: "Troba",
  numero_reiterada: "Reiterada",
  distrito: "Distrito",
  bucket: "Bucket",
  estado_toa: "Estado Toa",
  estado_gestor: "Estado Gestor",
  contrata: "Contrata",
  gestor: "Gestor",
  auditor: "auditor",
  tecnico: "Tecnico",
  fecha_cita: "Fecha Cita",
  fecha_registro: "Fecha Registro"
};

export const listaBuckets = [
  {
    text: 'MA MAGDALENA 01',
    value: 'BK_SV_MA_MAGDALENA_01'
  },
  {
    text: 'SM MAGDALENA 02',
    value: 'BK_MA_SM_MAGDALENA_02'
  },
  {
    text: 'SJ MARANGA',
    value: 'BK_MR_SM_PN_SJ_MARANGA'
  },
  {
    text: 'SJ SAN JOSE',
    value: 'BK_SJ_SAN_JOSE'
  },
  {
    text: 'MA VENEZUELA',
    value: 'BK_VN_MA_VENEZUELA'
  }
];

export const codigosLiquidadasEfectivas = [
  '2','3','6','7','10','1C','1D','1H','1I','1N','1P','1Q','1S','1O','1T','1U','1L',
  'G1','G3','G4','G5','2A','2B','2C','2D','2E','2F','2G','2H',
  'HC','H0','H1','H2','H3','H4','H5','H6','H8','H9','HA','HB','HC','HD'
];

export const codigosLiquidadasInefectivas = [
  '1V','1W','71','77','78','79','7B','7C','7D','7E','7F',
  '21','93','R1','R2','H7','D1','D2','D3','D4','D5',
  'S1','S2','S3','S4','S5','S6','Z1'
];

export const codigosLiquidadasNoCorresponde = [
  '21','22','23','24','25','26','28','31','32','33','34','35',
  '41','42','43','47','48','49','51','53','81','82','83','84',
  '91','92','B8',
];
