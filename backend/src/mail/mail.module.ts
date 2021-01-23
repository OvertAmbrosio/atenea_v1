import { Module } from '@nestjs/common';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

import { variables } from '../config';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService): Promise<MailerOptions> => ({
        transport: {
          host: configService.get(variables.email_host),
          port: configService.get(variables.email_puerto),
          secure: false, // actualizar luego con STARTTLS
          auth: {
            user: configService.get(variables.email_usuario),
            pass: configService.get(variables.email_password),
          },
        },
        defaults: {
          from: `"🤖 AteneaBot@v1.2" <${configService.get(variables.email_usuario)}>`
        },
        template: {
          dir: path.join(process.cwd(), 'templates'),
          adapter: new HandlebarsAdapter(), // o new PugAdapter()
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MailController],
  providers: [MailService]
})
export class MailModule {}
