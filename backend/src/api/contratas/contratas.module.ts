import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ContratasService } from './contratas.service';
import { ContratasController } from './contratas.controller';
import { ContrataSchema } from './models/contrata.model';
import { variables } from 'src/config';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: 'Contrata',
      schema: ContrataSchema
    }], variables.db_name),
  ],
  controllers: [ContratasController],
  providers: [ContratasService]
})
export class ContratasModule {}
