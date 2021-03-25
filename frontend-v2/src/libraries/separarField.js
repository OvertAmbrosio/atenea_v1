import { estadosToa } from "../constants/valoresToa";

export function separarBucket(data=[]) {
  let buckets = [];
  if (data && data.length !== 0) {
    let estados = [];
    let newData = [];
    data.forEach((o) => !buckets.includes(o.bucket) ? buckets.push(o.bucket): null);
    data.forEach((o) => !estados.includes(o.estado) ? estados.push(o.estado): null);
    buckets.forEach((b) => {
      estados.forEach((e) => {
        let numOrdenes = data.filter((d) => d.bucket === b && d.estado === e).length;
        newData.push({
          bucket: String(b).substring(6),
          estado: e,
          ordenes: numOrdenes,
        });
      })
    });
    return {ordenes: newData, buckets, estados};
  } else {
    return {ordenes: [], buckets, estados: []} ;
  };
};

export function separarContrata(data=[]) {
  let contratas = [];
  if (data && data.length !== 0) {
    let estados = [];
    let newData = [];
    data.forEach((o) => {
      if (o.contrata && o.contrata.nombre) {
        if (!contratas.includes(o.contrata.nombre)) contratas.push(o.contrata.nombre)
      }
    });
    data.forEach((o) => !estados.includes(o.estado) ? estados.push(o.estado): null);
    contratas.forEach((g) => {
      estados.forEach((e) => {
        let numOrdenes = data.filter((d) => {
          if (d.contrata && d.contrata.nombre){
            return d.contrata.nombre === g && d.estado === e
          } else {
            return false;
          }
        }).length;
        newData.push({
          contrata: g,
          estado: e,
          ordenes: numOrdenes,
        });
      })
    });
    return {ordenes: newData, contratas};
  } else {
    return {ordenes: [], contratas} ;
  };
};

export function separarGestor(data=[]) {
  let gestores = [];
  if (data && data.length !== 0) {
    let estados = [];
    let newData = [];
    data.forEach((o) => {
      if (o.gestor && o.gestor.nombre) {
        if (!gestores.includes(o.gestor.nombre)) gestores.push(o.gestor.nombre)
      }
    });
    data.forEach((o) => !estados.includes(o.estado) ? estados.push(o.estado): null);
    gestores.forEach((g) => {
      estados.forEach((e) => {
        let numOrdenes = data.filter((d) => {
          if (d.gestor && d.gestor.nombre){
            return d.gestor.nombre === g && d.estado === e
          } else {
            return false;
          }
        }).length;
        newData.push({
          gestor: g,
          estado: e,
          ordenes: numOrdenes,
        });
      })
    });
    return {ordenes: newData, gestores};
  } else {
    return {ordenes: [], gestores} ;
  };
};

export function separarMotivo(data=[]) {
  let gestores = [];
  if (data && data.length !== 0) {
    let motivos = [];
    let newData = [];
    data.forEach((o) => {
      if (o.gestor && o.gestor.nombre) {
        if (!gestores.includes(o.gestor.nombre)) gestores.push(o.gestor.nombre)
      } else {
        if (!gestores.includes('-')) gestores.push('-')
      }
    });
    data.forEach((o) => !motivos.includes(o.motivo_no_realizado) ? motivos.push(o.motivo_no_realizado) : null);
    gestores.forEach((g) => {
      motivos.forEach((m) => {
        let numOrdenes = data.filter((d) => {
          if (d.gestor && d.gestor.nombre){
            return d.gestor.nombre === g && d.motivo_no_realizado === m
          } else {
            return false;
          }
        }).length;
        newData.push({
          gestor: g,
          descripcion: m,
          motivo: String(m).substr(9).replace(/-/g, ''),
          ordenes: numOrdenes,
        });
      })
    });
    return {ordenes: newData, gestores};
  } else {
    return {ordenes: [], gestores} ;
  };
};

export function ordenarResumen(data=[], tipo) {
  if (data && data.length > 0) {
    let tipos = [];
    let nuevaData = [];

    data.forEach((d) => { if (!tipos.includes(d[tipo])) tipos.push(d[tipo]) });

    tipos.filter((e) => e).forEach((e, i) => {
      if (nuevaData.length <= 0) {
        nuevaData = [{
          key: i,
          [tipo]: e,
          completado: data.filter((d) => d.estado === estadosToa.COMPLETADO && e === d[tipo]).length,
          iniciado: data.filter((d) => d.estado === estadosToa.INICIADO && e === d[tipo]).length,
          no_realizada: data.filter((d) => d.estado === estadosToa.NO_REALIZADA && e === d[tipo]).length,
          pendiente: data.filter((d) => d.estado === estadosToa.PENDIENTE && e === d[tipo]).length,
          suspendido: data.filter((d) => d.estado === estadosToa.SUSPENDIDO && e === d[tipo]).length,
          cancelado: data.filter((d) => d.estado === estadosToa.CANCELADO && e === d[tipo]).length,
          total: data.filter((d) => e === d[tipo]).length,
        }]
      } else {
        nuevaData.push({
          key: i,
          [tipo]: e,
          completado: data.filter((d) => d.estado === estadosToa.COMPLETADO && e === d[tipo]).length,
          iniciado: data.filter((d) => d.estado === estadosToa.INICIADO && e === d[tipo]).length,
          no_realizada: data.filter((d) => d.estado === estadosToa.NO_REALIZADA && e === d[tipo]).length,
          pendiente: data.filter((d) => d.estado === estadosToa.PENDIENTE && e === d[tipo]).length,
          suspendido: data.filter((d) => d.estado === estadosToa.SUSPENDIDO && e === d[tipo]).length,
          cancelado: data.filter((d) => d.estado === estadosToa.CANCELADO && e === d[tipo]).length,
          total: data.filter((d) => e === d[tipo]).length,
        })
      }
    })

    return nuevaData;
  } else {
    return [];
  }
};

export function ordenarResumenId(data=[], tipo) {
  if (data && data.length > 0) {
    let tipos = [];
    let nuevaData = [];

    data.forEach((d) => { if (!tipos.includes(d[tipo].nombre)) tipos.push(d[tipo].nombre) });

    tipos.filter((e) => e).forEach((e, i) => {
      if (nuevaData.length <= 0) {
        nuevaData = [{
          key: i,
          [tipo]: e,
          completado: data.filter((d) => d.estado === estadosToa.COMPLETADO && e === d[tipo].nombre).length,
          iniciado: data.filter((d) => d.estado === estadosToa.INICIADO && e === d[tipo].nombre).length,
          no_realizada: data.filter((d) => d.estado === estadosToa.NO_REALIZADA && e === d[tipo].nombre).length,
          pendiente: data.filter((d) => d.estado === estadosToa.PENDIENTE && e === d[tipo].nombre).length,
          suspendido: data.filter((d) => d.estado === estadosToa.SUSPENDIDO && e === d[tipo].nombre).length,
          cancelado: data.filter((d) => d.estado === estadosToa.CANCELADO && e === d[tipo].nombre).length,
          total: data.filter((d) => e === d[tipo].nombre).length,
        }]
      } else {
        nuevaData.push({
          key: i,
          [tipo]: e,
          completado: data.filter((d) => d.estado === estadosToa.COMPLETADO && e === d[tipo].nombre).length,
          iniciado: data.filter((d) => d.estado === estadosToa.INICIADO && e === d[tipo].nombre).length,
          no_realizada: data.filter((d) => d.estado === estadosToa.NO_REALIZADA && e === d[tipo].nombre).length,
          pendiente: data.filter((d) => d.estado === estadosToa.PENDIENTE && e === d[tipo].nombre).length,
          suspendido: data.filter((d) => d.estado === estadosToa.SUSPENDIDO && e === d[tipo].nombre).length,
          cancelado: data.filter((d) => d.estado === estadosToa.CANCELADO && e === d[tipo].nombre).length,
          total: data.filter((d) => e === d[tipo].nombre).length,
        })
      }
    })

    return nuevaData;
  } else {
    return [];
  }
};