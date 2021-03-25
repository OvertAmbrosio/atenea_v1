import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { WinstonModule } from 'nest-winston';
import { join } from 'path';

import { createLogger } from './config';
import { MongoModule } from './database/mongo.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ApiModule } from './api/api.module';
import { RedisModule } from './database/redis.module';
import { MailModule } from './mail/mail.module';
import { OrdenesGateway } from './api/ordenes/ordenes.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
    }),
    WinstonModule.forRoot(createLogger),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api*'],
    }),
    ScheduleModule.forRoot(),
    MongoModule,
    AuthModule,
    RedisModule,
    ApiModule,
    MailModule
  ],
  controllers: [AppController],
  providers: [AppService, OrdenesGateway],
})
export class AppModule {}
