import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor( private readonly authService: AuthService) {
    super();
  }
  //funcion que se dispara antes de pasar al controlador
  async validate(username: string, password: string): Promise<any> {
    return await this.authService.validateUser(username, password)
      .then((data) => {
        return data
      }).catch((error) => {
        throw error; 
      });
  }
}