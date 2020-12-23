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
      if (o.tecnico !== '-' && o.tecnico.gestor && o.tecnico.gestor.nombre) {
        if (!gestores.includes(o.tecnico.gestor.nombre)) gestores.push(o.tecnico.gestor.nombre)
      } else {
        if (!gestores.includes('-')) gestores.push('-')
      }
    });
    data.forEach((o) => !estados.includes(o.estado) ? estados.push(o.estado): null);
    gestores.forEach((g) => {
      estados.forEach((e) => {
        let numOrdenes = data.filter((d) => {
          if (d.tecnico === '-') {
            return d.tecnico === g && d.estado === e
          } else if (d.tecnico && d.tecnico.gestor && d.tecnico.gestor.nombre){
            return d.tecnico.gestor.nombre === g && d.estado === e
          } else {
            return false;
          }
        }).length;
        newData.push({
          gestor: g,
          estado: e,
          ordenes: numOrdenes,
          type: 1
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
    let numMayor = 0;
    let newData = [];
    let aux = [];
    data.forEach((o) => {
      if (o.tecnico !== '-' && o.tecnico.gestor && o.tecnico.gestor.nombre) {
        if (!gestores.includes(o.tecnico.gestor.nombre)) gestores.push(o.tecnico.gestor.nombre)
      } else {
        if (!gestores.includes('-')) gestores.push('-')
      }
    });
    data.forEach((o) => !motivos.includes(o.motivo_no_realizado) ? motivos.push(o.motivo_no_realizado) : null);
    gestores.forEach((g) => {
      motivos.forEach((m) => {
        let numOrdenes = data.filter((d) => {
          if (d.tecnico === '-') {
            return d.tecnico === g && d.motivo_no_realizado === m
          } else if (d.tecnico && d.tecnico.gestor && d.tecnico.gestor.nombre){
            return d.tecnico.gestor.nombre === g && d.motivo_no_realizado === m
          } else {
            return false;
          }
        }).length;
        if (numMayor < numOrdenes) numMayor = numOrdenes;
        newData.push({
          gestor: g,
          motivo: m,
          ordenes: numOrdenes,
          type: 1
        });
      })
    });
    newData.forEach((d) => {
      let a = {
        gestor: d.gestor,
        motivo: d.motivo,
        ordenes: numMayor - d.ordenes,
        type: 2
      };
      aux.push(d);
      aux.push(a);
    });
    return {ordenes: aux, gestores};
  } else {
    return {ordenes: [], gestores} ;
  };
};