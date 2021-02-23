// if (Number(o.codigo_ctr) === Number(bandejas.PEX)) {
//   const registro:THistorial = {
//     observacion: 'Orden movida a planta externa.',
//     usuario_entrada: usuario,
//     fecha_entrada: new Date(),
//     estado_orden: estado_gestor.PEXT,
//     codigo_ctr: o.codigo_ctr
//   };
//   return await this.ordenModel.findOneAndUpdate({ codigo_requerimiento: o.codigo_requerimiento}, {
//     $set: { estado_gestor: estado_gestor.PEXT,  codigo_ctr: o.codigo_ctr,  descripcion_ctr: o.descripcion_ctr },
//     $push: { historial_registro: registro }
//   }).then(() => actualizados = actualizados +1).catch((e:any) => {
//     errores = errores +1;
//     this.logger.error({ message: e, service: 'subirData(servicio - o.codigo_ctr === bandejas.PEX)' })
//     return;
//   })
// } else if (Number(o.codigo_ctr) === Number(bandejas.LITEYCA)) {
//   const registro:THistorial = {
//     observacion: `Orden retorna a la bandeja Liteyca (${ordenBase.codigo_ctr} > ${o.codigo_ctr}).`,
//     estado_orden: estado_gestor.PENDIENTE,
//     usuario_entrada: usuario,
//     fecha_entrada: new Date(),
//     codigo_ctr: o.codigo_ctr
//   };
//   return await this.ordenModel.findOneAndUpdate({ codigo_requerimiento: o.codigo_requerimiento}, {
//     $set: { codigo_ctr: o.codigo_ctr,  descripcion_ctr: o.descripcion_ctr, estado_gestor: estado_gestor.PENDIENTE },
//     $push: { historial_registro: registro }
//   }).then(() => actualizados = actualizados +1).catch((e) => {
//     errores = errores +1;
//     this.logger.error({ message: e, service: 'subirData(servicio - o.codigo_ctr === bandejas.LITEYCA)' })
//     return;
//   });
// } else if (Number(o.codigo_ctr) === Number(bandejas.CRITICOS)) {
//   const registro:THistorial = {
//     observacion: 'Orden movida a la bandeja criticos.',
//     usuario_entrada: usuario,
//     fecha_entrada: new Date(),
//     codigo_ctr: o.codigo_ctr
//   };
//   return await this.ordenModel.findOneAndUpdate({ codigo_requerimiento: o.codigo_requerimiento}, {
//     $set: { codigo_ctr: o.codigo_ctr,  descripcion_ctr: o.descripcion_ctr },
//     $push: { historial_registro: registro }
//   }).then(() => actualizados = actualizados +1).catch((e:any) => {
//     errores = errores +1;
//     this.logger.error({ message: e, service: 'subirData(servicio - o.codigo_ctr === bandejas.CRITICOS)' })
//     return;
//   });
// } else {
//   const registro:THistorial = {
//     observacion: `Orden movida a una bandeja externa (${ordenBase.codigo_ctr} > ${o.codigo_ctr}).`,
//     usuario_entrada: usuario,
//     fecha_entrada: new Date(),
//     codigo_ctr: Number(o.codigo_ctr)
//   };
//   return await this.ordenModel.findOneAndUpdate({ codigo_requerimiento: o.codigo_requerimiento}, {
//     $set: { codigo_ctr: o.codigo_ctr,  descripcion_ctr: o.descripcion_ctr },
//     $push: { historial_registro: registro }
//   }).then(() => actualizados = actualizados +1).catch((e: any) => {
//     errores = errores +1;
//     console.log(e);
//     this.logger.error({ message: e, service: 'subirData(servicio - bandeja externa)' })
//     return;
//   });
// }