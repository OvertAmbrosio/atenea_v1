export default function extraerDatosTecnico(data=[]) {
  if (data.length > 0) {
    return data.map((d) => {
      return ({
        bucket: d.bucket,
        requerimiento: d.requerimiento,
        estado: d.estado,
        fecha_cita: d.fecha_cita,
        motivo_no_realizado: d.motivo_no_realizado,
        subtipo_actividad: d.subtipo_actividad,
        carnet: d.tecnico === '-' ? '-':d.tecnico.carnet,
        tecnico: d.tecnico !== '-' ? d.tecnico.nombre + ' ' + d.tecnico.apellidos : '-',
        gestor: d.tecnico === '-' ? '-' : d.tecnico.gestor ? d.tecnico.gestor.nombre + ' ' + d.tecnico.gestor.apellidos: '-',
        auditor: d.tecnico === '-' ? '-' : d.tecnico.auditor ? d.tecnico.auditor.nombre + ' ' + d.tecnico.auditor.apellidos: '-',
        contrata: d.tecnico === '-' ? '-' : d.tecnico.contrata ? d.tecnico.contrata.nombre: '-',
        tipo_agenda: d.tipo_agenda,
        sla_inicio: d.sla_inicio,
        sla_fin: d.sla_fin,
      })
    })
  } else {
    return ({
      bucket: '',
      requerimiento: '',
      estado: '',
      fecha_cita: '',
      motivo_no_realizado: '',
      subtipo_actividad: '',
      carnet: '',
      tecnico:'',
      gestor:'',
      auditor:'',
      contrata:'',
      tipo_agenda:'',
      sla_inicio:'',
      sla_fin:'',
    })
  }
};