import { 
  Controller, Req, Res,
  Post, Get, Headers, UseGuards, 
  Inject, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { IEmpleado } from 'src/api/empleados/interfaces/empleados.interface';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('private/auth')
export class AuthController {
  constructor( 
    private readonly authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  //luego de pasar por la estrategia se realiza el logeo
  private async login( @Req() req: Request){
    const empleado: IEmpleado|any = req.user;
    if (empleado) {
      return this.authService.login(empleado);
    } else {
      return new UnauthorizedException;
    }
  };
  //verificar la sesion del usuario
  @UseGuards(JwtAuthGuard)
  @Get('session')
  private async session(@Headers('authorization') token: string, @Res() res: Response, @Req() req: Request) {
    if (!token) {
      return res.send({status: 'error', message: 'No se encontró el token de acceso.'})
    } else {
      const usuario:any = req.user;
      const tokenBearer:string = String(token).substr(7, token.length);
      await this.authService.session(tokenBearer, usuario.id, usuario.nombre).then((data) => {
        return res.send(data);
      }).catch((error) => {
        this.logger.error(error.message);
        res.status(404).send(error);
      });
    }
  };
  //cerrar sesion del usuario
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  private async logout(@Headers('authorization') token: string, @Res() res: Response, @Req() req: Request) {
    if (!token) {
      return res.send({status: 'error', message: 'No se encontró el token de acceso.'})
    } else {
      const usuario:any = req.user;
      const tokenBearer:string = String(token).substr(7, token.length);
      await this.authService.logout(tokenBearer, usuario.id).then((data) => {
        return res.send(data);
      }).catch((error) => {
        this.logger.error(error.message);
        res.status(404).send(error);
      });;
    }
  }

}