import { Module } from '@nestjs/common';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { UpdateDataService, UpdateDataModule } from '@localLibs/update-data';
import { MongooseModule } from '@nestjs/mongoose';

import * as path from 'path';

import { variables } from '../config';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { RedisModule } from '../database/redis.module';
import { EmpleadoSchema } from 'src/api/empleados/models/empleado.model';


@Module({
  imports: [
    UpdateDataModule,
    MongooseModule.forFeature([{
      name: 'Empleado',
      schema: EmpleadoSchema
    }], variables.db_name),
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService): Promise<MailerOptions> => ({
        transport: {
          host: configService.get(variables.email_host),
          port: configService.get(variables.email_puerto),
          secure: true,
          auth: {
            user: configService.get(variables.email_usuario),
            pass: configService.get(variables.email_password),
          },
          tls: { 
            rejectUnauthorized: false 
          }
        },
        defaults: {
          from: `"🤖 AteneaBot" <${configService.get(variables.email_usuario)}>`
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
    RedisModule
  ],
  controllers: [MailController],
  providers: [MailService, UpdateDataService]
})
export class MailModule {}
