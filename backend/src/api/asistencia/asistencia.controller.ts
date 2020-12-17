import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req, Inject, Query, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AsistenciaService } from './asistencia.service';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';
import { tipos_usuario } from 'src/constants/enum';
import { TPaginateParams, TRespuesta } from 'src/helpers/types';

@UseGuards(JwtAuthGuard)
@Controller('asistencia/')
export class AsistenciaController {
  constructor(
    private readonly asistenciaService: AsistenciaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Post()
  async crearRegistro(
    @Req() req: Request,
    @Body('tecnicos') tecnicos: string[],
    @Body('estado') estado: string
  ): Promise<TRespuesta> {
    const user:any = req.user;
    if (user.cargo <= tipos_usuario.GESTOR) {
      return await this.asistenciaService.crearAsistencias(tecnicos, user.id, estado).then(() => {
        this.logger.info({
          message: `Usuario -${user.id}- actualiazo la asistencia de -${tecnicos}- a estado: -${estado}`,
          service: 'crearRegistro'
        });
        return ({
          status: 'success',
          message: 'Asistencia registrada correctamente.'
        })
      }).catch((e) => {
        this.logger.error({
          message: e.message,
          service: 'crearRegistro'
        });
        return ({
          status: 'error',
          message: e.message
        })
      });
    } else {
      this.logger.error({
        message: `Usuario -${user.id}- intentó actualizar la asistencia de -${tecnicos}- a estado: -${estado}`,
        service: 'crearRegistro'
      })
      return ({
        status: 'error',
        message: 'No cuentas con permisos suficientes.'
      })
    }
  };

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.asistenciaService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAsistenciaDto: UpdateAsistenciaDto) {
    return this.asistenciaService.update(+id, updateAsistenciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.asistenciaService.remove(+id);
  }
}
