import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { variables } from 'src/config';
import { RedisService } from 'src/database/redis.service';

//esta clase sirve para validar que el usuario tenga una sesion activa
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private redisService: RedisService,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(variables.secret_jwt),
    });
  }
  //el token es decodificado y llega como parametro el payload 
  async validate(payload: any) {
    return await this.redisService.get(String(payload.id)).then((usuario) => {
      if (!usuario) {
        throw new UnauthorizedException("Sesión inválida")
      } else {
        return payload;
      }
    });    
  }
}