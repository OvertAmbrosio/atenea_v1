import { 
  Controller, UseGuards, Inject,
  Get, Post, Put, Patch, Delete, 
  Req, Body, Query, Param, HttpException, HttpStatus, InternalServerErrorException  } from '@nestjs/common';
import { Request } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { EmpleadosService } from './empleados.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TPaginateParams, TPayload, TRespuesta } from 'src/helpers/types';
import { tipos_usuario } from 'src/constants/enum';

@UseGuards(JwtAuthGuard)
@Controller('empleados/')
export class EmpleadosController {
  constructor(
    private readonly empleadosService: EmpleadosService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}
  //metodo para traer todo el personal dependiendo del cargo
  @Get()
  async findAll(@Query() params: TPaginateParams, @Req() req: Request): Promise<TRespuesta> {
    const usuario:TPayload|any = req.user;
    if (params.metodo === 'listaTodo') {
      return await this.empleadosService.listarPersonal(usuario, params.page, params.limit).then((data) => {
        return ({
          status: 'success',
          message: 'Lista obtenida correctamente.',
          data: data
        });
      }).catch((error) => {
        this.logger.error({
          message: error.message,
          service: 'listaTodo(empleados)'
        })
        return ({status: 'error', message: error.message})
      }); 
    } else if (params.metodo === 'listaTecnicosGlobal') {
      if (usuario.cargo <= tipos_usuario.ASISTENTE_LOGISTICA) {
        return this.empleadosService.listarTecnicosGlobal().then((data) => {
          return ({
            status: 'success',
            message: 'Empleados obtenidos correctamente.',
            data: data
          })
        }).catch((err) => {
          this.logger.error({message: err.message, service: 'listaTecnicosGlobal'});
          return ({
            status: 'error',
            message: err.message,
            data: []
          })
        })
      } else {
        throw new HttpException({status: 'error', message: 'Metodo incorrecto.'}, HttpStatus.FORBIDDEN);
      } 
    } else if (params.metodo === 'listaGestores') {
      return this.empleadosService.listarGestores().then((data) => {
        return ({
          status: 'success',
          message: 'Gestores obtenidos correctamente.',
          data
        })
      }).catch((err) => {
        this.logger.error({message: err.message, service: 'listaGestores'});
        return ({
          status: 'error',
          message: err.message,
          data: []
        })
      })
    } else if (params.metodo === 'listaAuditores') {
      return this.empleadosService.listarAuditores().then((data) => {
        return ({
          status: 'success',
          message: 'Auditores obtenidos correctamente.',
          data
        })
      }).catch((err) => {
        this.logger.error({message: err.message, service: 'listaAuditores'});
        return ({
          status: 'error',
          message: err.message,
          data: []
        })
      })
    } else {
      throw new HttpException({status: 'error', message: 'Metodo incorrecto.'}, HttpStatus.FORBIDDEN);
    }
  };

  @Get('buscar')
  async buscarEmpleado(@Query('value') value: string, @Query('field') field: string, @Req() req: Request): Promise<TRespuesta> {
    const usuario: any = req.user;
    return await this.empleadosService.buscarPersonal(value, field, usuario).then((data) => {
      return ({
        status: 'success',
        message: `Usuarios encontrados (${data.length})`,
        data: data
      })
    }).catch((err) => {
      this.logger.error({message: err.message, service: 'buscarEmpleado'})
      return ({
        status: 'error',
        message: err.message
      })
    });
  };

  @Post()
  async create(@Body() createEmpleadoDto: CreateEmpleadoDto, @Req() req: Request) {
    const usuario:any = req.user;

    if (createEmpleadoDto.usuario.cargo <= tipos_usuario.LIDER_GESTION) {
      throw new HttpException({status: 'error', message: 'Cargo fuera de rango.'}, HttpStatus.FORBIDDEN);
    } else {
      const usuariosCarnet = [tipos_usuario.TECNICO,tipos_usuario.AUDITOR]
      if(!usuariosCarnet.includes(createEmpleadoDto.usuario.cargo)) delete createEmpleadoDto.carnet;
      return await this.empleadosService.crearEmpleado(createEmpleadoDto).then((data) => {
        this.logger.info({message: `el usuario -${usuario.id}- ha creado un nuevo usuario (${data.usuario.email})`});
        return ({
          status: 'success',
          message: 'Usuario creado correctamente.'
        });
      }).catch((error) => {
        this.logger.error({message: error.message, service: 'createEmpleado'});
        return ({
          status: 'error',
          message: 'Error creando el usuario.'
        })
      }); 
    };
  };

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateEmpleadoDto: UpdateEmpleadoDto, @Req() req: Request) {
    const usuario: any = req.user;
    return await this.empleadosService.actualizarEmpleado(id, usuario.cargo, updateEmpleadoDto).then((empleado) => {
      this.logger.info(`El usuario -${usuario.id}- ha actualizado al siguiente usuario -${empleado._id}-`);
      return ({
        status: 'success',
        message: 'Usuario actualizado correctamente.'
      })
    }).catch((err) => {
      this.logger.error({message: err.message, service: 'actualizarEmpleado'});
      throw new HttpException({status: 'error', message: err.message}, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  };
  //metodo que se encarga de la configuracion del usuario
  @Patch()
  async actualizarEmpleado(
    @Body('id') id: string, 
    @Body('metodo') metodo: string, 
    @Body('cargo') cargo: number, 
    @Body('fecha_baja') fecha_baja: Date, 
    @Body('estado_empresa') estado_empresa: number, 
    @Body('gestor') gestor: string,
    @Body('auditor') auditor: string,
    @Body('negocio') negocio: string,
    @Body('subNegocio') subNegocio: string,
    @Body('tecnicos') tecnicos: string[],
    @Req() req: Request 
  ): Promise<TRespuesta> {
    const usuario:any = req.user;

    this.logger.info({ message: `Usuario ${usuario.id} edita al usuario ${id} actualizarEmpleado(${metodo})`});

    if (metodo === 'resetPassword' && usuario) {
      return await this.empleadosService.resetPassword(id, usuario.cargo).then((e) => {
          this.logger.info({message: `usuario - ${usuario.id} - cambio el password de - ${e.nombre+' '+e.apellidos}`, service: 'cerrarSesion'});
          return ({status: 'success', message: 'Contraseña actualizada correctamente.'})
        }).catch((error) => {
          this.logger.error({message: error.message, service: 'resetPassword'});
          return ({status: 'error', message: 'Error actualizando la contraseña'})
        });
    } else if (metodo === 'cerrarSesion' && usuario) {
      return this.empleadosService.cerrarSession(id).then(() => {
          this.logger.info({message: `usuario - ${usuario.id} - cerró la sesión de - ${id}`, service: 'cerrarSesion'})
          return ({status: 'success', message: 'Sesión cerrada correctamente.'});
        }).catch((error) => {
          this.logger.error({message: error.message, service: 'cerrarSesion'})
          return ({status: 'error', message: 'Error cerrando la sesión del usuario.'})
        });
    } else if (metodo === 'actualizarPermisos' && usuario) {
      if (cargo > usuario.cargo && cargo !== 1 ) {
        return this.empleadosService.actualizarPermisos(id, cargo).then(() => {
            return ({status: 'success', message: 'Cargo actualizado correctamente.'})
          }).catch((error) => {
            this.logger.error({message: error.message, service: 'actualizarPermisos'});
            return ({status: 'error', message: "Error actualizando al usuario."});
          })
      } else {
        this.logger.info({message: `usuario - ${usuario.id} - intento fuera de cargo`, service: 'actualizarPermisos'})
        throw new InternalServerErrorException({
          status: 'error',
          message: 'No dispones de permisos necesarios para esta acción.'
        });
      };
    } else if (metodo === 'activarCuenta' && usuario) {
      return this.empleadosService.activarCuenta(id).then(() => {
          return ({status: 'success', message: 'Cuenta activada correctamente.'})
        }).catch((error) => {
          this.logger.error({message: error.message, service: 'activarCuenta'});
          return ({status: 'error', message: 'Error activando al usuario.'})
        });
    } else if (metodo === 'editarEstadoEmpresa' && usuario) {
      if (usuario.cargo < tipos_usuario.JEFE_CONTRATA) {
        return this.empleadosService.editarEstadoEmpresa(id, estado_empresa, fecha_baja).then((e) => {
            this.logger.info({ message: `usuario -${usuario.id}- editó el estado del usuario -${e._id}-`})
            return ({
              status: 'success',
              message: 'Usuario actualizado correctamente.'
            })
          }).catch((error) => {
            this.logger.error({message:error.message, service: 'editarEstadoEmpresa'});
            return ({
              status: 'error',
              message: 'Error al editar el usuario.'
            })
          });
      } else {
        throw new InternalServerErrorException({
          status: 'error',
          message: 'No dispones de permisos necesarios para esta acción.'
        })
      };
    } else if (metodo === 'actualizarGestor' && usuario) {
      if (usuario.cargo <= tipos_usuario.LIDER_GESTION ) {
        return this.empleadosService.actualizarGestor(tecnicos, gestor).then(() => {
          this.logger.info({ message: `usuario -${usuario.id}- asigno a los tecnicos`})
          return ({
            status: 'success',
            message: 'Tecnicos asignados correctamente.'
          })
        }).catch((error) => {
          this.logger.error({message:error.message, service: 'actualizarGestor'});
          return ({
            status: 'error',
            message: 'Error al asignar los tecnicos.'
          })
        });
      } else {
        throw new InternalServerErrorException({
          status: 'error',
          message: 'No dispones de permisos necesarios para esta acción.'
        })
      }
    } else if (metodo === 'actualizarAuditor' && usuario) {
      if (usuario.cargo <= tipos_usuario.LIDER_GESTION ) {
        return this.empleadosService.actualizarAuditor(tecnicos, auditor).then(() => {
          this.logger.info({ message: `usuario -${usuario.id}- asigno a los tecnicos`})
          return ({
            status: 'success',
            message: 'Tecnicos asignados correctamente.'
          })
        }).catch((error) => {
          this.logger.error({message:error.message, service: 'actualizarAuditor'});
          return ({
            status: 'error',
            message: 'Error al asignar los tecnicos.'
          })
        });
      } else {
        throw new InternalServerErrorException({
          status: 'error',
          message: 'No dispones de permisos necesarios para esta acción.'
        })
      }
    } else if (metodo === 'actualizarNegocio') {
      return await this.empleadosService.actualizarNegocio(tecnicos, negocio).then(() => {
        return ({status: 'success', message: 'Usuario actualizado correctamente.'})
      }).catch((error) => {
        this.logger.error({message: error.message, service: 'actualizarNegocio'});
        return ({status: 'error', message: 'Error actualizando el tipo de negocio'})
      });
    } else if (metodo === 'actualizarSubNegocio') {
      return await this.empleadosService.actualizarSubNegocio(tecnicos,subNegocio).then(() => {
        return ({status: 'success', message: 'Usuario actualizado correctamente.'})
      }).catch((error) => {
        this.logger.error({message: error.message, service: 'actualizarSubNegocio'});
        return ({status: 'error', message: 'Error actualizando el sub tipo de negocio'})
      });
    } else {
      throw new HttpException({status: 'error', message: 'Metodo incorrecto.'}, HttpStatus.FORBIDDEN);
    };
  };
}
