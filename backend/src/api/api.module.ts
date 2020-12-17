import { Module } from '@nestjs/common';
import { ContratasModule } from './contratas/contratas.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { OrdenesModule } from './ordenes/ordenes.module';
import { AsistenciaModule } from './asistencia/asistencia.module';

@Module({
  imports: [EmpleadosModule, ContratasModule, OrdenesModule, AsistenciaModule]
})
export class ApiModule {}
