import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RedisModule } from 'src/database/redis.module';
import { AsistenciaService } from './asistencia.service';
import { AsistenciaController } from './asistencia.controller';
import { AsistenciaSchema } from './models/asistencia.model';
import { variables } from 'src/config';
import { EmpleadoSchema } from '../empleados/models/empleado.model';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: 'Asistencia',
      schema: AsistenciaSchema
    },{
      name: 'Empleado',
      schema: EmpleadoSchema
    }], variables.db_name),
    RedisModule,
  ],
  controllers: [AsistenciaController],
  providers: [AsistenciaService]
})
export class AsistenciaModule {}
