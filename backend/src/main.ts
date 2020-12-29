import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io'
import { ConfigService } from '@nestjs/config';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as bodyParser from 'body-parser'

import { AppModule } from './app.module';
import { variables } from './config/variables';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, { cors: true });

  const configService = app.get(ConfigService);
  const port = configService.get(variables.puerto);

  app.useWebSocketAdapter(new IoAdapter(app))

  app.setGlobalPrefix('api')

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`, 'https: *',],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'https: *', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  }))
  app.use(compression({level: 9}));
  app.use(bodyParser.json({limit: '5mb'}));
  app.use(bodyParser.urlencoded({ extended: true, limit: '5mb'}));

  await app.listen(port);
};

bootstrap();
