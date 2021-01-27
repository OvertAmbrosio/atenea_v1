import { Controller, Get, Post, Patch, Body, UseGuards, Req, Inject, Query, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AsistenciaService } from './asistencia.service';
import { tipos_usuario } from 'src/constants/enum';
import { TPaginateParams, TRespuesta } from 'src/helpers/types';

@UseGuards(JwtAuthGuard)
@Controller('asistencia/')
export class AsistenciaController {
  constructor(
    private readonly asistenciaService: AsistenciaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Get()
  async listarAsistencia(@Query() params: TPaginateParams, @Req() req: Request): Promise<TRespuesta> {
    const user:any = req.user;
    if (user.cargo <= tipos_usuario.LIDER_GESTION && params.metodo === 'listarTodo') {
      return await this.asistenciaService.listarTodoAsistencia(params).then((data) => {
        return ({
          status: 'success',
          message: 'Lista obtenida con exito',
          data
        });
      }).catch((err) => {
        this.logger.error({
          message: err,
          service: 'Listar asistencia (listarTodo)'
        });
        return ({
          status: 'error',
          message: 'Error obteniendo los datos.',
          data: err
        });
      });
    } else if(user.cargo <= tipos_usuario.GESTOR && params.metodo === 'listarGestor') {
      return await this.asistenciaService.listarGestorAsistencia(params, user.id).then((data) => {
        return ({
          status: 'success',
          message: 'Lista obtenida correctamente.',
          data,
        });
      }).catch((err) => {
        this.logger.error({
          message: err.message,
          service: 'Listar asistencia (listarGestor)'
        });
        return ({
          status: 'error',
          message: 'Error obteniendo los datos.',
          data: err.message
        });
      })
    } else {
      throw new HttpException({
        status: 'error',
        message: 'Metodo o permisos incorrectos'
      }, HttpStatus.FORBIDDEN);
    }
  };

  @Patch()
  async actualizarAsistencia(@Body() data:any , @Req() req: Request): Promise<TRespuesta> {
    const user:any = req.user;
    return await this.asistenciaService.actualizarAsistencia(data.id, data.estado, data.observacion).then(() => {
      this.logger.info({
        service: `El gestor -${user.id}- actualizo al tecnico -${data.tecnico}- con el estado -${data.estado}-`
      })
      return ({
        status: 'success',
        message: 'Asistencia actualizada con éxito.',
      });
    }).catch((err) => {
      this.logger.error({
        message: err,
        service: 'actualizarAsistencia'
      });
      return ({
        status: 'error',
        message: 'Error actualizando la asistencia.'
      });
    });
  };

}
