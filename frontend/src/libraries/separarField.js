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
    return {ordenes: newData, buckets};
  } else {
    return {ordenes: [], buckets} ;
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
          motivo: m,
          ordenes: numOrdenes,
        });
      })
    });
    return {ordenes: newData, gestores};
  } else {
    return {ordenes: [], gestores} ;
  };
};