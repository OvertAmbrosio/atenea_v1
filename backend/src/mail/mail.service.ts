import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { DateTime } from 'luxon';
import { TOrdenesToa } from 'src/helpers/types';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) { }
  
  public async example2(data?:TOrdenesToa[]) {    
    const fecha = `${DateTime.fromJSDate(new Date()).get('day')}-${DateTime.fromJSDate(new Date()).get('month')}-${DateTime.fromJSDate(new Date()).get('year')}`
    const hora = `${DateTime.fromJSDate(new Date()).get('hour')}:${DateTime.fromJSDate(new Date()).get('minute')}:${DateTime.fromJSDate(new Date()).get('second')}`
    return await this.mailerService.sendMail({
      to: 'overt.ambrosio@liteyca.pe', // List of receivers email address
      // from: `"🤖 AteneaBot@v1.2" <${this.configService.get(variables.email_usuario)}>`, // Senders email address
      subject: '✔ Reporte de Extracción',
      template: 'index', // The `.pug` or `.hbs` extension is appended automatically.
      context: { 
        data,
        fecha: `${fecha} ${hora}`
      } // Data to be sent to template engine.
    }).catch((err) => console.log(err));
  }
};
