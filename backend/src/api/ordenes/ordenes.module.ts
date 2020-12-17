import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrdenesService } from './ordenes.service';
import { OrdenesController } from './ordenes.controller';
import { OrdenSchema } from './models/ordene.model';
import { EmpleadoSchema } from '../empleados/models/empleado.model';
import { RedisModule } from '../../database/redis.module';
import { variables } from 'src/config';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: 'Ordene',
      schema: OrdenSchema
    },{
      name: 'Empleado',
      schema: EmpleadoSchema
    }], variables.db_name),
    RedisModule,
    HttpModule
  ],
  controllers: [OrdenesController],
  providers: [OrdenesService]
})
export class OrdenesModule {}
