import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { variables } from '../config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      connectionName: variables.db_name, // Database name
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('NODE_ENV') === 'production' ? 
          configService.get(variables.db_uri_prod) : configService.get(variables.db_uri_dev)
        ,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }),
      inject: [ConfigService],
    })
  ]
})
export class MongoModule {}
