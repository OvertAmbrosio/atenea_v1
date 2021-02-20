import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as CloudLib from 'cloudinary';
import * as HtmlToImageLib from 'node-html-to-image'
import { Model } from 'mongoose';
import { DateTime } from 'luxon';
import * as fs from 'fs';

import { Cloudinary, HtmlToImage } from './update-data.provider';
import { IEmpleado } from 'src/api/empleados/interfaces/empleados.interface';
import { TOrdenesToa } from 'src/helpers/types';
import { variables } from 'src/config';
import { estados_toa, ordenes_gpon_altas } from 'src/constants/valoresToa';
import { tipos_usuario } from 'src/constants/enum';

@Injectable()
export class UpdateDataService {
  constructor (
    @InjectModel('Empleado') private readonly empleadoModel: Model<IEmpleado>,
    @Inject(Cloudinary) private cloudinary: typeof CloudLib,
    @Inject(HtmlToImage) private htmlToImage: typeof HtmlToImageLib,
    private configService: ConfigService,
  ) {
    this.cloudinary.v2.config({
      cloud_name: configService.get(variables.cloudinary_name),
      api_key: configService.get(variables.cloudinary_key),
      api_secret: configService.get(variables.cloudinary_secret),
    })
    // this.v2 = this.cloudinary.v2
  };

  private async ordenarBuckets(data:TOrdenesToa[], tiempo:number): Promise<{nombre:string,en_plazo:number,vencidas:number, porcentaje:any, agendadas:number, total:number, style:string}[]>{
    const completas = data.filter((e) => e.estado_toa === estados_toa.COMPLETADO);
    const buckets = [];
    completas.forEach((e) => {
      if (!buckets.includes(e.bucket)) {
        buckets.push(e.bucket)
      }
    });
    
    const aux = buckets.filter(e => e).map((b) => {      
      let ep =  completas.filter((c) => DateTime.fromJSDate(new Date(c.fecha_pre_no_realizado))
        .diff(DateTime.fromJSDate(new Date(c.fecha_registro_legados)), 'hour').toObject().hours < tiempo && !c.tipo_agenda && c.bucket === b).length;
      let vn = completas.filter((c) => DateTime.fromJSDate(new Date(c.fecha_pre_no_realizado))
        .diff(DateTime.fromJSDate(new Date(c.fecha_registro_legados)), 'hour').toObject().hours >= tiempo && !c.tipo_agenda && c.bucket === b).length;
      let agendadas = data.filter((c) => c.estado_toa === estados_toa.COMPLETADO && c.tipo_agenda && c.bucket === b).length;
      let porcnt = Math.round((ep*100) / (ep + vn) );

      return({  
        nombre: b,
        en_plazo: ep,
        vencidas: vn,
        porcentaje: String(porcnt) === 'NaN' ? '-':porcnt,
        agendadas,
        total: ep+vn+agendadas,
        style: porcnt < 50 ? 'background-color: #EC7063;' : porcnt >= 50 && porcnt < 80 ? 'background-color: #F4D03F;' : 'background-color: #82E0AA',
      });
    });

    let ep =  completas.filter((c) => DateTime.fromJSDate(new Date(c.fecha_pre_no_realizado))
        .diff(DateTime.fromJSDate(new Date(c.fecha_registro_legados)), 'hour').toObject().hours < tiempo && !c.tipo_agenda).length;
    let vn = completas.filter((c) => DateTime.fromJSDate(new Date(c.fecha_pre_no_realizado))
      .diff(DateTime.fromJSDate(new Date(c.fecha_registro_legados)), 'hour').toObject().hours >= tiempo && !c.tipo_agenda).length;
    let agendadas = data.filter((e) => e.estado_toa === estados_toa.COMPLETADO && e.tipo_agenda).length;
    let porcnt = Math.round((ep*100) / (ep + vn) );

    return [
      ...aux, 
      {
        nombre: 'Total',
        en_plazo: ep,
        vencidas: vn,
        porcentaje: porcnt,
        agendadas,
        total: ep+vn+agendadas,
        style: porcnt < 50 ? 'background-color: #EC7063;' : porcnt >= 50 && porcnt < 80 ? 'background-color: #F4D03F;' : 'background-color: #82E0AA',
      }
    ]
  };

  private async ordenarObjeto(data:TOrdenesToa[], tipo:string, tiempo:number): Promise<{nombre:string,en_plazo:number,vencidas:number, porcentaje:any, style:string}[]>{
    const completas:TOrdenesToa[] = data.filter((e) => e.estado_toa === estados_toa.COMPLETADO);
    const objetos = [];
    completas.forEach((e) => {
      if (e[tipo] && !objetos.includes(e[tipo].nombre)) {
        objetos.push(e[tipo] ? e[tipo].nombre : null);
      }
    });

    const aux = objetos.filter(e => e).map((b) => {
      let ep =  completas.filter((c) => DateTime.fromJSDate(new Date(c.fecha_pre_no_realizado))
        .diff(DateTime.fromJSDate(new Date(c.fecha_registro_legados)), 'hour').toObject().hours < tiempo && !c.tipo_agenda && c[tipo] !== null && c[tipo].nombre === b).length;
      let vn = completas.filter((c) => DateTime.fromJSDate(new Date(c.fecha_pre_no_realizado))
        .diff(DateTime.fromJSDate(new Date(c.fecha_registro_legados)), 'hour').toObject().hours >= tiempo && !c.tipo_agenda && c[tipo] !== null && c[tipo].nombre === b).length;
      let agendadas = data.filter((c) => c.estado_toa === estados_toa.COMPLETADO && c.tipo_agenda && c[tipo].nombre === b).length;
      let porcnt = Math.round((ep*100) / (ep + vn) );

      return({  
        nombre: b,
        en_plazo: ep,
        vencidas: vn,
        porcentaje: String(porcnt) === 'NaN' ? '-':porcnt,
        agendadas,
        total: ep+vn+agendadas,
        style: porcnt < 50 ? 'background-color: #EC7063;' : porcnt >= 50 && porcnt < 80 ? 'background-color: #F4D03F;' : 'background-color: #82E0AA',
      });
    });

    let ep =  completas.filter((c) => DateTime.fromJSDate(new Date(c.fecha_pre_no_realizado))
        .diff(DateTime.fromJSDate(new Date(c.fecha_registro_legados)), 'hour').toObject().hours < tiempo && !c.tipo_agenda).length;
    let vn = completas.filter((c) => DateTime.fromJSDate(new Date(c.fecha_pre_no_realizado))
      .diff(DateTime.fromJSDate(new Date(c.fecha_registro_legados)), 'hour').toObject().hours >= tiempo && !c.tipo_agenda).length;
    let agendadas = data.filter((e) => e.estado_toa === estados_toa.COMPLETADO && e.tipo_agenda).length;
    let porcnt = Math.round((ep*100) / (ep + vn) );

    return [
      ...aux, 
      {
        nombre: 'Total',
        en_plazo: ep,
        vencidas: vn,
        porcentaje: porcnt,
        agendadas,
        total: ep+vn+agendadas,
        style: porcnt < 50 ? 'background-color: #EC7063;' : porcnt >= 50 && porcnt < 80 ? 'background-color: #F4D03F;' : 'background-color: #82E0AA',
      }
    ]
  }

  public async actualizarTecnicosToa(ordenes:TOrdenesToa[], tipo:string):Promise<TOrdenesToa[]> {
    return await Promise.all(ordenes.map(async(o) => {
      if (o.tecnico && typeof o.tecnico === 'string' && String(o.tecnico).length === 6) {
        return await this.empleadoModel.findOne({ $and: [{carnet: o.tecnico},{carnet: { $ne: null}}]})
          .select('_id nombre apellidos gestor auditor contrata carnet').populate('gestor', 'nombre apellidos').populate('auditor', 'nombre apellidos').populate('contrata', 'nombre')
          .then(async(empleado) => {
            if (o.gestor_liquidado_toa && typeof o.gestor_liquidado_toa === 'string' && String(o.gestor_liquidado_toa).length === 6) {
              return await this.empleadoModel.findOne({ $and: [{carnet: o.gestor_liquidado_toa},{carnet: { $ne: null}}]}).select('_id nombre apellidos').then((gestor) => {
                return({
                  ...o,
                  tipo,
                  estado_toa: o.estado,
                  tecnico: empleado ? {_id: empleado._id, nombre: empleado.nombre, apellidos: empleado.apellidos} : null,
                  carnet: empleado && empleado.carnet,
                  gestor: empleado && empleado.gestor ? empleado.gestor : null,
                  gestor_liquidado_toa: gestor ? {_id: empleado._id, nombre: empleado.nombre, apellidos: empleado.apellidos} : null,
                  auditor: empleado && empleado.auditor ? empleado.auditor : null,
                  contrata: empleado && empleado.contrata ? empleado.contrata : null,
                  fecha_cancelado: o.fecha_cancelado ? new Date(DateTime.fromFormat(String(o.fecha_cancelado).trim(), 'dd/MM/yy hh:mm a').toISO()): null,
                  fecha_cita: o.fecha_cita ? new Date(DateTime.fromFormat(String(o.fecha_cita).trim(), 'dd/MM/yy').toISO()): null,
                  sla_inicio: o.sla_inicio ? new Date(DateTime.fromFormat(String(o.sla_inicio).trim(), 'dd/MM/yy hh:mm a').toISO()): null,
                  sla_fin: o.sla_fin ? new Date(DateTime.fromFormat(String(o.sla_fin).trim(), 'dd/MM/yy hh:mm a').toISO()): null
                })
              })
            } else {
              return({
                ...o,
                tipo,
                estado_toa: o.estado,
                tecnico: empleado ? {_id: empleado._id, nombre: empleado.nombre, apellidos: empleado.apellidos} : null,
                carnet: empleado && empleado.carnet,
                gestor: empleado && empleado.gestor ? empleado.gestor : null,
                gestor_liquidado_toa: null,
                auditor: empleado && empleado.auditor ? empleado.auditor : null,
                contrata: empleado && empleado.contrata ? empleado.contrata : null,
                fecha_cancelado: o.fecha_cancelado ? new Date(DateTime.fromFormat(String(o.fecha_cancelado).trim(), 'dd/MM/yy hh:mm a').toISO()): null,
                fecha_cita: o.fecha_cita ? new Date(DateTime.fromFormat(String(o.fecha_cita).trim(), 'dd/MM/yy').toISO()): null,
                sla_inicio: o.sla_inicio ? new Date(DateTime.fromFormat(String(o.sla_inicio).trim(), 'dd/MM/yy hh:mm a').toISO()): null,
                sla_fin: o.sla_fin ? new Date(DateTime.fromFormat(String(o.sla_fin).trim(), 'dd/MM/yy hh:mm a').toISO()): null
              })
            }
          })
      } else {
        return({
          ...o,
          tipo,
          estado_toa: o.estado,
          tecnico: null,
          carnet: '-',
          gestor: null,
          gestor_liquidado_toa: null,
          auditor: null,
          contrata: null,
          fecha_cancelado: o.fecha_cancelado ? new Date(DateTime.fromFormat(String(o.fecha_cancelado).trim(), 'dd/MM/yy hh:mm a').toISO()): null,
          fecha_cita: o.fecha_cita ? new Date(DateTime.fromFormat(String(o.fecha_cita).trim(), 'dd/MM/yy').toISO()): null,
          sla_inicio: o.sla_inicio ? new Date(DateTime.fromFormat(String(o.sla_inicio).trim(), 'dd/MM/yy hh:mm a').toISO()): null,
          sla_fin: o.sla_fin ? new Date(DateTime.fromFormat(String(o.sla_fin).trim(), 'dd/MM/yy hh:mm a').toISO()): null
        })
      };
    }));
  };

  public async subirImagenes(files:Array<any>, folder:string):Promise<CloudLib.UploadApiResponse[]> {
    if (files && files.length > 0) {
      return Promise.all(files.map(async(file) => {
        return await this.cloudinary.v2.uploader.upload(file.path, {
          resource_type: "auto",
          folder: folder
        }).then(async(res) => {
          fs.unlinkSync(file.path)
          return res;
        });
      }));
    } else {
      return null;
    }
  };

  public async ordenarDataDetalleTecnico(data:TOrdenesToa[], tecnologia?:string) {
    if (data && data.length > 0) {
      if (tecnologia === 'GPON') {        
        let tecnicos:Array<string> = [];
        const objGpon = data.filter((e) => ordenes_gpon_altas.includes(e.subtipo_actividad) && e.tecnico);
        objGpon.filter((d) => d.tecnico && d.tecnico.nombre).forEach((o) => {
          if (!tecnicos.includes(o.tecnico.nombre + ' ' + o.tecnico.apellidos)) {
            tecnicos.push(o.tecnico.nombre+' '+o.tecnico.apellidos)
          }
        });
        
        const detalle_tecnico = tecnicos.filter((e) => e).map((t) => ({
          tecnico: t,
          completadas: objGpon.filter((o) => o.estado_toa === estados_toa.COMPLETADO && (o.tecnico.nombre + ' ' + o.tecnico.apellidos) === t).length,
          iniciado: objGpon.filter((o) => o.estado_toa === estados_toa.INICIADO && (o.tecnico.nombre + ' ' + o.tecnico.apellidos) === t).length,
          no_realizado: objGpon.filter((o) => o.estado_toa === estados_toa.NO_REALIZADA && (o.tecnico.nombre + ' ' + o.tecnico.apellidos) === t).length,
          suspendido: objGpon.filter((o) => o.estado_toa === estados_toa.SUSPENDIDO && (o.tecnico.nombre + ' ' + o.tecnico.apellidos) === t).length,
          pendiente: objGpon.filter((o) => o.estado_toa === estados_toa.PENDIENTE && (o.tecnico.nombre + ' ' + o.tecnico.apellidos) === t).length,
          cancelado: objGpon.filter((o) => o.estado_toa === estados_toa.CANCELADO && (o.tecnico.nombre + ' ' + o.tecnico.apellidos) === t).length,
          total: objGpon.filter((o) => (o.tecnico.nombre + ' ' + o.tecnico.apellidos) === t).length,
        }));

        return ([
          ...detalle_tecnico,
          {
            tecnico: 'Total',
            completadas: objGpon.filter((o) => o.estado_toa === estados_toa.COMPLETADO).length,
            iniciado: objGpon.filter((o) => o.estado_toa === estados_toa.INICIADO).length,
            no_realizado: objGpon.filter((o) => o.estado_toa === estados_toa.NO_REALIZADA).length,
            suspendido: objGpon.filter((o) => o.estado_toa === estados_toa.SUSPENDIDO).length,
            pendiente: objGpon.filter((o) => o.estado_toa === estados_toa.PENDIENTE).length,
            cancelado: objGpon.filter((o) => o.estado_toa === estados_toa.CANCELADO).length,
            total: objGpon.length,
          }
        ])
      } else {
        return []
      }
    } else {
      return [];
    }
  };

  public async ordenarDataResumen(altas:TOrdenesToa[], averias:TOrdenesToa[]) {    
    return [{
      negocio: 'Averias',
      completadas: averias.filter((o) => o.estado_toa === estados_toa.COMPLETADO).length,
      pendiente: averias.filter((o) => o.estado_toa === estados_toa.PENDIENTE).length,
      total: averias.length,
    },{
      negocio: 'Altas',
      completadas: altas.filter((o) => o.estado_toa === estados_toa.COMPLETADO).length,
      pendiente: altas.filter((o) => o.estado_toa === estados_toa.PENDIENTE).length, 
      total: altas.length,
    },{
      negocio: 'Total',
      completadas: [...averias, ...altas].filter((o) => o.estado_toa === estados_toa.COMPLETADO).length,
      pendiente: [...averias, ...altas].filter((o) => o.estado_toa === estados_toa.PENDIENTE).length, 
      total: [...averias, ...altas].length,
    }]
  };

  public async ordenarDataTcflAverias(data:TOrdenesToa[]):Promise<{buckets:Array<any>, contratas:Array<any>, gestores:Array<any>}> {
    const buckets = await this.ordenarBuckets(data, 24);
    const contratas = await this.ordenarObjeto(data, 'contrata', 24);
    const gestores = await this.ordenarObjeto(data, 'gestor', 24);

    return {buckets, contratas, gestores}
  };

  public async ordenarDataTcflAltas(data:TOrdenesToa[]):Promise<{buckets:Array<any>, contratas:Array<any>, gestores:Array<any>}> {
    const buckets = await this.ordenarBuckets(data, 72);
    const contratas = await this.ordenarObjeto(data, 'contrata', 72);
    const gestores = await this.ordenarObjeto(data, 'gestor', 72);

    return {buckets, contratas, gestores}
  };

  public async ordenarDataProdDirectos(averias:TOrdenesToa[], altas:TOrdenesToa[]):Promise<Array<any>> {
    //buscar la contrata Liteyca
    const idContrata = await this.empleadoModel.find({ 'usuario.cargo': tipos_usuario.JEFE_OPERACIONES }).select('contrata').then((e:IEmpleado[]) => {
      if (e && e.length > 0 ) {
        return e[0].contrata
      } else {
        return null;
      }
    });    
    //buscar los tecnicos de la contrata
    const tecnicosDirectos:Array<string> = idContrata ? await this.empleadoModel.find({ $and: [ { contrata: idContrata }, { 'usuario.cargo': tipos_usuario.TECNICO } ] }).select('_id').then((e:IEmpleado[]) => {
      if (e && e.length > 0) {
        return e.map((t) => String(t._id));
      } else {
        return [];
      };
    }) : [];
    //filtrar las ordenes
    const completadasAverias = averias.filter((d) => d.estado_toa === estados_toa.COMPLETADO && d.tecnico && tecnicosDirectos.includes(String(d.tecnico._id)));
    const completadasAltas = altas.filter((d) => d.estado_toa === estados_toa.COMPLETADO && d.tecnico && tecnicosDirectos.includes(String(d.tecnico._id)));

    let tecnicos = [];
    
    [...completadasAverias, ...completadasAltas].forEach((o) => {
      if (o.tecnico && o.tecnico.nombre && !tecnicos.includes(o.tecnico.nombre+' '+o.tecnico.apellidos)) {
        tecnicos.push(o.tecnico.nombre+' '+o.tecnico.apellidos);
      };
    });
    const aux = tecnicos.filter((t) => t).map((t) => ({
      tecnico: t,
      averias: completadasAverias.filter((o) => o.tecnico && o.tecnico.nombre && o.tecnico.nombre+' '+o.tecnico.apellidos === t).length,
      altas: completadasAltas.filter((o) => o.tecnico && o.tecnico.nombre && o.tecnico.nombre+' '+o.tecnico.apellidos === t).length
    }));

    return ([
      ...aux,
      {
        tecnico: 'Total',
        averias: completadasAverias.length,
        altas: completadasAltas.length 
      }
    ])
  };
  
  public async generarImagen(data:Array<any>, tipo:string): Promise<String> {
    const img =  await this.htmlToImage.default({
      content: { data },
      puppeteerArgs: { args: ["--no-sandbox"] },
      html: tipo,
    });
    const img64 = function () {
      if (img instanceof Buffer ) {
        return Buffer.from(img).toString('base64');
      } else {
        return null;
      }
    };

    return img64();
  };

  public async generarImagenMulti(buckets:Array<any>, contratas:Array<any>, gestores:Array<any>, tipo:string): Promise<String> {
    const img =  await this.htmlToImage.default({
      content: { buckets, contratas, gestores },
      puppeteerArgs: { args: ["--no-sandbox"] },
      html: tipo,
    });
    const img64 = function () {
      if (img instanceof Buffer ) {
        return Buffer.from(img).toString('base64');
      } else {
        return null;
      }
    };

    return img64();
  };
};
