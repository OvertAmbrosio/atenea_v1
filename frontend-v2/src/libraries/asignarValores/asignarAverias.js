import { numeroFecha } from '../numeroFecha';
import isEmpty from 'is-empty';

import { averias, averiasDireccion, hfcLiquidadas, codigosLiquidadasEfectivas, codigosLiquidadasInefectivas, codigosLiquidadasNoCorresponde } from '../../constants/valoresOrdenes';
import { tipoOrdenes } from '../../constants/tipoOrden';

// const codctrArray = ["470","476"] ;

export async function pendientesAverias(ordenes=[]){
  // eslint-disable-next-line
  const promises = ordenes.map(function(orden, indice){
      
    let verificado = true;
    let direccion = '';

    //distrito
    if (isEmpty(String(orden[averias[0].cabecera]).trim())) {verificado = false};
    //requerimiento
    if (isNaN(orden[averias[1].cabecera]) && isNaN(orden[averias[1].cabecera_2])) {verificado = false};

    const valores = {
      key: indice,
      verificado,
      tipo: tipoOrdenes.AVERIAS,
      direccion_avenida: orden["desnomvia"] ? orden["desnomvia"] : null
    };

    averias.forEach((v) => {
      if (v.cabecera_2) {
        if (orden[v.cabecera] !== undefined && orden[v.cabecera] !== null) {
          valores[v.propiedad] = v.fecha ? numeroFecha(orden[v.cabecera]) : String(orden[v.cabecera]).replace(/,/g, '')
        } else if (orden[v.cabecera_2] !== undefined && orden[v.cabecera_2] !== null) {
          valores[v.propiedad] = v.fecha ? numeroFecha(orden[v.cabecera_2]) : String(orden[v.cabecera_2]).replace(/,/g, '')
        };
      } else {
        if (orden[v.cabecera] !== undefined && orden[v.cabecera] !== null) {
          valores[v.propiedad] = v.fecha ? numeroFecha(orden[v.cabecera]) : String(orden[v.cabecera]).replace(/,/g, '')
        };
      };
    });

    averiasDireccion.forEach((d) => {
      if (orden[d.cabecera] !== undefined && orden[d.cabecera] !== null) {
        direccion = direccion + d.espacio + orden[d.cabecera]
      };
    })
    
    valores.direccion = String(direccion).substr(1);
    
    return (valores);
  });
  // eslint-disable-next-line
  return Promise.all(promises).catch((err) => {
    console.log('Error en la promesa');
    console.log(err);
    return err;
  })
};

export async function liquidadasAverias(ordenes=[], tecnicos=[]){
  const promises = ordenes.map((orden, indice) => {
    let verificado = true;
    let tecnico = null;
    let efectivas = codigosLiquidadasEfectivas.includes(String(orden['tipave']));
    let inEfectivas = codigosLiquidadasInefectivas.includes(String(orden['tipave']));
    let noCorresponde = codigosLiquidadasNoCorresponde.includes(String(orden['tipave']));

    if (isNaN(orden[averias[1].cabecera]) && isNaN(orden[averias[1].cabecera_2])) { verificado = false};
    if (String(orden['codtecliq']).trim().length === 6) {
      let iTecnico = tecnicos.findIndex((t) => t.carnet === orden['codtecliq']);
      if (iTecnico > 0) {
        tecnico = tecnicos[iTecnico]._id
      };
    };

    const valores = {
      key: indice,
      verificado,
      tipo_liquidacion: orden['edoxot'],
      tecnico_liquidado: tecnico,
      estado_liquidado: efectivas ? 'efectiva' : inEfectivas ? 'inefectiva' : noCorresponde ? 'no_corresponde' : '-',
    };
    
    hfcLiquidadas.forEach((v) => {
      if (v.cabecera_2) {
        if (orden[v.cabecera] !== undefined && orden[v.cabecera] !== null) {
          valores[v.propiedad] = v.fecha ? numeroFecha(orden[v.cabecera]) : orden[v.cabecera]
        } else if (orden[v.cabecera_2] !== undefined && orden[v.cabecera_2] !== null) {
          valores[v.propiedad]= v.fecha ? numeroFecha(orden[v.cabecera_2]) : orden[v.cabecera_2]
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
};