import { 
  Controller, Inject, UseGuards,
  Get, Post, Put, Patch, Query,
  Param, Body, Req, HttpException, HttpStatus
} from '@nestjs/common';
import { Request } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TRespuesta } from 'src/helpers/types';
import { ContratasService } from './contratas.service';
import { CreateContrataDto } from './dto/create-contrata.dto';
import { UpdateContrataDto } from './dto/update-contrata.dto';
import { tipos_usuario } from '../../constants/enum';

@UseGuards(JwtAuthGuard)
@Controller('contratas/')
export class ContratasController {
  constructor(
    private readonly contratasService: ContratasService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}
  //metodo para crear una nueva contrata
  @Post()
  async create(@Body() createContrataDto: CreateContrataDto, @Req() req: Request): Promise<TRespuesta> {
    const usuario: any = req.user;
    if (usuario.cargo <= tipos_usuario.LIDER_GESTION) {
      return this.contratasService.crearContrata(createContrataDto).then(() => {
        return ({
          status: 'success',
          message: 'Contrata creada correctamente.'
        })
      }).catch((error) => {
        this.logger.error({message: error.message, service: 'crearContrata'})
        return({
          status: 'error',
          message: 'Error creando la contrata.'
        })
      });
    } else {
      throw new HttpException({status: 'error', message: 'No dispones de los permisos necesarios.'}, HttpStatus.FORBIDDEN)
    };
  };
  //metodo para obtener las contratas
  @Get()
  async findAll(@Query('metodo') metodo: string, @Req() req: Request): Promise<TRespuesta> {
    const usuario: any = req.user;
    if (metodo === 'listaTodo' && usuario.cargo  <= tipos_usuario.LIDER_GESTION) {
      return await this.contratasService.listaTodo().then((data) => {
        return ({
          status: 'success',
          message: 'Lista obtenida correctamente.',
          data
        })
      }).catch((error) => {
        this.logger.error({message: error.message, service: 'listaTodo(contrata)'})
        return({
          status: 'error',
          message: 'Error obteniendo los datos.'
        })
      });
    } else if (metodo === 'listaNombres'){
      return await this.contratasService.listaNombres().then((data) => {
        return ({
          status: 'success',
          message: 'Lista obtenida correctamente.',
          data
        })
      }).catch((error) => {
        this.logger.error({message: error.message, service: 'listaNombres(contrata)'})
        return({
          status: 'error',
          message: 'Error obteniendo los datos.'
        })
      });
    } else {
      throw new HttpException({
        status: 'error',
        message: 'Metodo o cargo incorrecto.'
      }, HttpStatus.NOT_FOUND)
    }
  };
  //metodo para editar la contrata
  @Put(':id')
  async edit(@Param('id') id: string, @Body() updateContrataDto: UpdateContrataDto, @Req() req: Request): Promise<TRespuesta> {
    const usuario: any = req.user;
    if (usuario.cargo <= tipos_usuario.LIDER_GESTION && id) {
      return await this.contratasService.actualizarContrata(id, updateContrataDto).then(() => {
        return ({
          status: 'success',
          message: 'Contrata actualizada correctamente.'
        })
      }).catch((error) => {
        this.logger.error({message: error.message, service: 'actualizarContrata'});
        return ({
          status: 'error',
          message: 'Error actualizando la contrata.'
        })
      });
    } else {
      throw new HttpException({status: 'error', message: 'No dispones de los permisos necesarios.'}, HttpStatus.FORBIDDEN)
    };  
  };
  //metodo para dar de baja a la contrata
  @Patch(':id')
  async update(@Param('id') id: string, @Body('activo') activo: boolean, @Body('fecha_baja') fecha_baja: Date, @Req() req: Request) {
    const usuario: any = req.user;
    if (usuario.cargo <= tipos_usuario.LIDER_GESTION) {
      this.logger.info(`usuario -${usuario.id}- desactivo la contrata -${id}-`)
      return await this.contratasService.desactivarContrata(id, activo, fecha_baja).then(() => {
        return ({
          status: 'success',
          message: 'Contrata actualizada correctamente.'
        });
      }).catch((error) => {
        return ({
          status: 'error',
          message: error.message
        })
      });
    } else {
      this.logger.error(`usuario -${usuario.id}- intentó desactivar la contrata -${id}- (sin permisos)`)
      throw new HttpException({
        status: 'error',
        message: 'No dispones de los permisos necesarios.'
      }, HttpStatus.NOT_FOUND)
    };   
  };
};
