import numeroFecha from '../numeroFecha';
import isEmpty from 'is-empty';

import { altas, hfcLiquidadas, codigosLiquidadasEfectivas, codigosLiquidadasInefectivas, codigosLiquidadasNoCorresponde } from '../../constants/valoresOrdenes';
import { tipoOrdenes } from '../../constants/tipoOrden';

const codctrArray = ["470","476"] ;

export async function pendientesAltas(ordenes=[]){
  // eslint-disable-next-line
  const promises = ordenes
    .filter((e) => codctrArray.includes(String(e['codctr'])))
    .map(function(orden, indice){
      
    let verificado = true;
    //distrito
    if (isEmpty(String(orden[altas[0].propiedad]).trim())) {verificado = false};
    //requerimiento
    if (isNaN(orden[altas[1].cabecera]) && isNaN(orden[altas[1].cabecera_2])) {verificado = false};

    const valores = {
      key: indice,
      verificado,
      tipo: tipoOrdenes.ALTAS,
    };

    altas.forEach((v) => {
      if (v.cabecera_2) {
        if (orden[v.cabecera] !== undefined && orden[v.cabecera] !== null) {
          valores[v.propiedad] = v.fecha ? numeroFecha(orden[v.cabecera]) : String(orden[v.cabecera]).replace(/,/g, '')
        } else if (orden[v.cabecera_2] !== undefined && orden[v.cabecera_2] !== null) {
          valores[v.propiedad]= v.fecha ? numeroFecha(orden[v.cabecera_2]) : String(orden[v.cabecera_2]).replace(/,/g, '')
        };
      } else {
        if (orden[v.cabecera] !== undefined && orden[v.cabecera] !== null) {
          valores[v.propiedad]= v.fecha ? numeroFecha(orden[v.cabecera]) : String(orden[v.cabecera]).replace(/,/g, '')
        };
      };
    });
    
    return (valores);
  });
  // eslint-disable-next-line
  return Promise.all(promises).catch((err) => {
    console.log('Error en la promesa');
    console.log(err);
    return err;
  })
};

export async function liquidadasAltas(ordenes=[], tecnicos=[]){
  const promises = ordenes.filter((e) => codctrArray.includes(String(e['codctr'])))
  .map((orden, indice) => {

    let verificado = true;
    let tecnico = null;
    let efectivas = codigosLiquidadasEfectivas.includes(orden['tipave']);
    let inEfectivas = codigosLiquidadasInefectivas.includes(orden['tipave']);
    let noCorresponde = codigosLiquidadasNoCorresponde.includes(orden['tipave']);

    if (isNaN(orden[altas[1].cabecera]) && isNaN(orden[altas[1].cabecera_2])) { verificado = false};
    if (String(orden['codtecliq']).trim().length === 6) {
      let iTecnico = tecnicos.findIndex((t) => t.carnet === orden['codtecliq']);
      if (iTecnico > 0) {
        console.log(tecnicos[iTecnico]._id)
        tecnico = tecnicos[iTecnico]._id
      };
    };

    const valores = {
      key: indice,
      verificado,
      tecnico_liquidado: tecnico,
      estado_liquidado: efectivas ? 'efectiva' : inEfectivas ? 'inefectiva' : noCorresponde ? 'no_corresponde' : '-',
    };

    hfcLiquidadas.forEach((v) => {
      if (v.cabecera_2) {
        if (orden[v.cabecera] !== undefined && orden[v.cabecera] !== null) {
          valores[v.propiedad] = v.fecha ? numeroFecha(orden[v.cabecera]) : orden[v.cabecera]
        } else if (orden[v.cabecera_2] !== undefined && orden[v.cabecera_2] !== null) {
          valores[v.propiedad]= v.fecha ? numeroFecha(orden[v.cabecera]) : orden[v.cabecera]
        };
      } else {
        if (orden[v.cabecera] !== undefined && orden[v.cabecera] !== null) {
          valores[v.propiedad]= v.fecha ? numeroFecha(orden[v.cabecera]) : orden[v.cabecera]
        };
      };
    });

    
    return (valores);
  });

  return Promise.all(promises).catch((err) => {
    console.log('Error en la promesa');
    console.log(err);
    return err;
  })
}