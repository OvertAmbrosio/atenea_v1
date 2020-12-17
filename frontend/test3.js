const a = [];//array con la data de la base de datos
let b = [];//nuevo array a crear luego de depurar la data de la base de datos

a.forEach((usuario) => {
  if (b.length > 0) {
    const aux = b.findIndex((i) => i.nombre === usuario.nombre && i.apellidos === usuario.apellidos);
    if (aux !== -1) {
      const objetoNuevo = b[aux];
      b[aux] = {
        ...objetoNuevo,
        [usuario.fecha]: usuario.estado
      };
    } else {
      const objetoNuevo = {
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        [usuario.fecha]: usuario.estado
      };
      b.push(objetoNuevo);
    }
  } else {
    b = [
      {
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        [usuario.fecha]: usuario.estado
      }
    ]
  }
})