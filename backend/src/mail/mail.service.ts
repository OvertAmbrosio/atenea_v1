import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UpdateDataService } from '@localLibs/update-data';
import { DateTime } from 'luxon';

import { RedisService } from 'src/database/redis.service';
import { cache_keys } from 'src/config/variables';
import { reporteResumen, reporteDetalleTecnicosGpon, reporteTcflAverias, reporteTcflAltas, reporteProdDirectos } from 'templates/reportes';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly redisService: RedisService,
    private readonly updateDataService:UpdateDataService,
  ) { }

  // @Cron('0 5 10,12,15,17,20 * * *', {
  //   name: 'enviarReportesGestion',
  //   timeZone: 'America/Lima',
  // })
  // async enviarReportesDeGestion() { 
  //   console.log('-------------------------Enviando Reportes de gestión--------------------------');
  //   return await this.reportesToa().then((e) => console.log(e));
  // };
  
  public async reportesToa() {    
    const dataAverias = await this.redisService.get(cache_keys.ORDENES_AVERIAS).then((data) => JSON.parse(data));
    const dataAltas = await this.redisService.get(cache_keys.ORDENES_ALTAS).then((data) => JSON.parse(data));
    
    const detalleGponTecnicos = await this.updateDataService.ordenarDataDetalleTecnico(dataAltas, 'GPON');
    const resumen = await this.updateDataService.ordenarDataResumen(dataAltas, dataAverias);
    const tcflAverias = await this.updateDataService.ordenarDataTcflAverias(dataAverias);
    const tcflAltas = await this.updateDataService.ordenarDataTcflAltas(dataAltas);
    const prodDirectos = await this.updateDataService.ordenarDataProdDirectos(dataAverias, dataAltas);

    const fecha = `${DateTime.fromJSDate(new Date(), { zone: 'America/Lima' }).get('day')}-${DateTime.fromJSDate(new Date(), { zone: 'America/Lima' }).get('month')}-${DateTime.fromJSDate(new Date(), { zone: 'America/Lima' }).get('year')}`;
    const hora = `${DateTime.fromJSDate(new Date(), { zone: 'America/Lima' }).get('hour')}:${DateTime.fromJSDate(new Date(), { zone: 'America/Lima' }).get('minute')}:${DateTime.fromJSDate(new Date(), { zone: 'America/Lima' }).get('second')}`;

    if (dataAverias && dataAltas && dataAverias.length > 0 && dataAltas.length > 0) {
      
      const imgResumen = await this.updateDataService.generarImagen(resumen, reporteResumen);
      const imgDetalle = await this.updateDataService.generarImagen(detalleGponTecnicos, reporteDetalleTecnicosGpon);
      const imgTcflAverias = await this.updateDataService.generarImagenMulti(tcflAverias.buckets, tcflAverias.contratas, tcflAverias.gestores, reporteTcflAverias);
      const imgTcflAltas = await this.updateDataService.generarImagenMulti(tcflAltas.buckets, tcflAltas.contratas, tcflAltas.gestores, reporteTcflAltas);
      const imgProdDirectos = await this.updateDataService.generarImagen(prodDirectos, reporteProdDirectos);
      // 'diana.machco@liteyca.pe',
      // 'astrid.marin@liteyca.pe',
      // 'astrid.rodriguez@liteyca.pe',
      // 'grissella.ramos@liteyca.pe',
      // 'karumi.amado@liteyca.pe',
      // 'edgar.garcia@liteyca.pe',
      // 'alfredo.sierra@liteyca.pe',
      // 'julio.purizaca@liteyca.pe'
      return await this.mailerService.sendMail({
        to: [
          'overt.ambrosio@gmail.com',
          'overt.ambrosio@liteyca.pe',
          'guillermo.carvajal@liteyca.com.co',
          'diana.machco@liteyca.pe',
          'eduardo.garcia@liteyca.pe',
          'astrid.marin@liteyca.pe',
          'astrid.rodriguez@liteyca.pe',
          'grissella.ramos@liteyca.pe',
          'karumi.amado@liteyca.pe',
          'edgar.garcia@liteyca.pe',
          'alfredo.sierra@liteyca.pe',
          'julio.purizaca@liteyca.pe',
          'ana.garcia@liteyca.pe'
        ], // List of receivers email address
        subject: '✔ Reporte de Extracción',
        context: {
          fecha: `${fecha} ${hora}`
        }, // Data to be sent to template engine.
        template: 'reporteGestion', // The `.pug` or `.hbs` extension is appended automatically.
        attachments: [
          {
            filename: 'resumen_general.jpeg',
            content: Buffer.from(imgResumen, 'base64'),
            cid: 'resumen_general'
          },
          {
            filename: 'tcfl_averias.jpeg',
            content: Buffer.from(imgTcflAverias, 'base64'),
            cid: 'tcfl_averias'
          },
          {
            filename: 'tcfl_altas.jpeg',
            content: Buffer.from(imgTcflAltas, 'base64'),
            cid: 'tcfl_altas'
          },
          {
            filename: 'produccion_directos.jpeg',
            content: Buffer.from(imgProdDirectos, 'base64'),
            cid: 'produccion_directos'
          },
          {
            filename: 'detalle_tecnicos.jpeg',
            content: Buffer.from(imgDetalle, 'base64'),
            cid: 'detalle_tecnicos'
          },      
        ]
      }).catch((err) => console.log(err));
    } else {
      return await this.mailerService.sendMail({
        // 'hans.aguilar@liteyca.pe'
        to: ['overt.ambrosio@liteyca.pe'], // List of receivers email address
        subject: '❌ Reporte de Extracción - Error',
        context: {
          fecha: `${fecha} ${hora}`
        }, // Data to be sent to template engine.
        template: 'error', // The `.pug` or `.hbs` extension is appended automatically.
      }).catch((err) => console.log(err));
    };
  };
};
