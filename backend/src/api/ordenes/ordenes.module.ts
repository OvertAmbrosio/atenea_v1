import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrdenesService } from './ordenes.service';
import { OrdenesController } from './ordenes.controller';
import { OrdenSchema } from './models/ordene.model';
import { OrdenesGateway } from './ordenes.gateway';
import { EmpleadoSchema } from '../empleados/models/empleado.model';
import { RedisModule } from '../../database/redis.module';
import { variables } from 'src/config';

import { UpdateDataService, UpdateDataModule } from '@localLibs/update-data';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    UpdateDataModule,
    MongooseModule.forFeature([{
      name: 'Ordene',
      schema: OrdenSchema
    },{
      name: 'Empleado',
      schema: EmpleadoSchema
    }], variables.db_name),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './upload',
      }),
    }),
    RedisModule,
    HttpModule
  ],
  controllers: [OrdenesController],
  providers: [OrdenesService, OrdenesGateway, UpdateDataService]
})
export class OrdenesModule {}
