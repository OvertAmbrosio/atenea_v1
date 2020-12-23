import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EmpleadoSchema } from 'src/api/empleados/models/empleado.model';
import { variables } from 'src/config';
import { UpdateDataService } from './update-data.service';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: 'Empleado',
      schema: EmpleadoSchema
    }], variables.db_name),
  ],
  providers: [UpdateDataService],
  exports: [UpdateDataService],
})
export class UpdateDataModule {}
