import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { EmpleadoSchema } from 'src/api/empleados/models/empleado.model';
import { variables } from 'src/config';
import { CloudinaryProvider } from './update-data.provider'
import { UpdateDataService } from './update-data.service';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: 'Empleado',
      schema: EmpleadoSchema
    }], variables.db_name),
  ],
  providers: [UpdateDataService, CloudinaryProvider],
  exports: [UpdateDataService, CloudinaryProvider],
})
export class UpdateDataModule {}
