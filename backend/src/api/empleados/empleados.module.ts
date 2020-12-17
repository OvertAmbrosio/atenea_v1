import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { variables } from 'src/config';
import { EmpleadosService } from './empleados.service';
import { EmpleadosController } from './empleados.controller';
import { EmpleadoSchema } from './models/empleado.model';
import { RedisModule } from '../../database/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: 'Empleado',
      schema: EmpleadoSchema
    }], variables.db_name),
    PassportModule,
    RedisModule
  ],
  controllers: [EmpleadosController],
  providers: [EmpleadosService],
  exports: [EmpleadosService]
})
export class EmpleadosModule {}
