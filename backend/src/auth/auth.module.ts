import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { RedisModule } from 'src/database/redis.module';
import { EmpleadosModule } from 'src/api/empleados/empleados.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { variables } from 'src/config';


@Module({
  imports: [
    RedisModule,
    EmpleadosModule, 
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(variables.secret_jwt),
        signOptions: { expiresIn: '24h' }, // <== Reflexiona sobre la expiración
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
