import numeroFecha from '../numeroFecha';
import isEmpty from 'is-empty';

import { averias } from '../../constants/valores';

const codctrArray = ["470","476"] ;

export async function pendientesAverias(ordenes=[]){
  // eslint-disable-next-line
  const promises = ordenes
    .filter((e) => codctrArray.includes(String(e[averias.CODIGO_CTR])))
    .map(function(orden, indice){
      
    let verificado = true;

    if (isEmpty(orden[averias.TELEFONO])) {verificado = false}
    if (isEmpty(String(orden[averias.DISTRITO]).trim())) {verificado = false}
    if (isNaN(orden[averias.CODIGO_REQUERIMIENTO])) {verificado = false}

    return ({
      key: indice,
      verificado,
      tipo: averias.TIPO,
      codigo_zonal: orden[averias.CODIGO_ZONAL] !== undefined && orden[averias.CODIGO_ZONAL],
      codigo_requerimiento : orden[averias.CODIGO_REQUERIMIENTO] !== undefined && orden[averias.CODIGO_REQUERIMIENTO],
      codigo_cliente: orden[averias.CODIGO_CLIENTE] !== undefined && orden[averias.CODIGO_CLIENTE],
      nombre_cliente: orden[averias.NOMBRE_CLIENTE] !== undefined && orden[averias.NOMBRE_CLIENTE],
      codigo_ctr: orden[averias.CODIGO_CTR] !== undefined && orden[averias.CODIGO_CTR],
      descripcion_ctr: orden[averias.DESCRIPCION_CTR] !== undefined && orden[averias.DESCRIPCION_CTR],
      codigo_nodo: orden[averias.CODIGO_NODO] !== undefined && orden[averias.CODIGO_NODO],
      codigo_troba: orden[averias.CODIGO_TROBA] !== undefined && orden[averias.CODIGO_TROBA],
      distrito: orden[averias.DISTRITO] !== undefined && orden[averias.DISTRITO],
      direccion: (orden[averias.destipvia] !== undefined ? orden[averias.destipvia]:'')
                  + (orden[averias.desnomvia] !== undefined ? ' '+orden[averias.desnomvia]:'')
                  + (orden[averias.numvia] !== undefined ? ' '+orden[averias.numvia]:'')
                  + (orden[averias.despis] !== undefined ? ' '+orden[averias.despis]:'')
                  + (orden[averias.desint] !== undefined ? (' Int. ' + orden[averias.desint]):'')
                  + (orden[averias.desmzn] !== undefined ? (' Mz. ' + orden[averias.desmzn]):'')
                  + (orden[averias.deslot] !== undefined ? (' Lt. ' + orden[averias.deslot]):'')
                  + (orden[averias.destipurb] !== undefined ? ' '+orden[averias.destipurb]:'')
                  + (orden[averias.desurb] !== undefined ? ' '+orden[averias.desurb]:''),
                  // .replace(/false|,/g, ''),
      fecha_registro : !isNaN(Number(orden[averias.FECHA_REGISTRO])) && numeroFecha(orden[averias.FECHA_REGISTRO]),
      codigo_motivo: orden[averias.CODIGO_MOTIVO] !== undefined && orden[averias.CODIGO_MOTIVO],
      detalle_motivo : orden[averias.DETALLE_MOTIVO] !== undefined && orden[averias.DETALLE_MOTIVO].replace(/,/g, ''),
      tipo_requerimiento: orden[averias.TIPO_REQUERIMIENTO] !== undefined && orden[averias.TIPO_REQUERIMIENTO],
      detalle_trabajo: orden[averias.DETALLE_TRABAJO] !== undefined && (orden[averias.DETALLE_TRABAJO]).replace(/,/g, ''),
      telefono_contacto: orden[averias.TELEFONO_CONTACTO] !== undefined && orden[averias.TELEFONO_CONTACTO],
      telefono_referencia: orden[averias.TELEFONO_REFERENCIA] !== undefined && orden[averias.TELEFONO_REFERENCIA],
      numero_reiterada: orden[averias.NUMERO_REITERADA] !== undefined && orden[averias.NUMERO_REITERADA],
      tipo_tecnologia: orden[averias.TIPO_TECNOLOGIA] !== undefined && orden[averias.TIPO_TECNOLOGIA],
    })
  });
  // eslint-disable-next-line
  return Promise.all(promises).catch((err) => {
    console.log('Error en la promesa');
    console.log(err);
    return err;
  })
}