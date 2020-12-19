import { 
  Controller, Get, Post, Body, Put, 
  Param, Delete, Req, UseGuards, Inject, Query 
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Request } from 'express';

import { OrdenesService } from './ordenes.service';
import { CreateOrdeneDto } from './dto/create-ordene.dto';
import { UpdateOrdeneDto } from './dto/update-ordene.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { tipos_orden, tipos_usuario } from 'src/constants/enum';
import { TRespuesta } from 'src/helpers/types';
import { cache_keys } from 'src/config/variables';

@Controller('ordenes/')
export class OrdenesController {
  constructor(
    private readonly ordenesService: OrdenesService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}
  
  @Post()
  @UseGuards(JwtAuthGuard)
  async postOrdenes(
    @Req() req:Request,
    @Body('metodo') metodo:string, 
    @Body('ordenes') createOrdenesDto:CreateOrdeneDto[],
    @Body('orden') createOrdenDto:CreateOrdeneDto
  ): Promise<TRespuesta> {
    const user:any = req.user;
    //metodo para subir las data del excel de cms
    if (metodo === 'subirData' && user && user.cargo <= tipos_usuario.LIDER_GESTION) {
      return await this.ordenesService.subirData(createOrdenesDto, user.id).then((resp) => {
        return (resp)
      }).catch((err) => {
        this.logger.error({
          message: err.message,
          service: 'Error subiendo las ordenes (subirData)'
        });
        return ({status: 'error', message: err.message});
      });
    } else {
      return ({
        status: 'error',
        message: 'Metodo incorrecto o permisos innecesarios.'
      });
    };
  };

  @Post('actividades')
  async postActividades(
    @Body('rutas') rutas: Array<any>,
    @Body('hfcR') averias:Array<any>, 
    @Body('hfcP') altas:Array<any>, 
    @Body('adsl') speedy:Array<any>, 
    @Body('registro') estado:string
  ):Promise<TRespuesta> {

    this.logger.info(estado);

    return await this.ordenesService.guardarDataToa(rutas, averias, altas, speedy).then((data) => {
      this.logger.info(`(${data.insertedCount}) ordenes insertadas.`)
      return({
        status: 'success',
        message: 'Todo ok'
      });
    }).catch((err) => {
      this.logger.error({
        message: err.message,
        service: 'postActividades'
      });
      return({
        status: 'error',
        message: 'Todo mal'
      })
    });
  };

  @Get()
  @UseGuards(JwtAuthGuard)
  async getOrdenes(@Req() req:Request, @Query('metodo') metodo:string, @Query('tipo') tipo:string): Promise<TRespuesta> {
    const user:any = req.user;
    const key = tipo === tipos_orden.AVERIAS ? cache_keys.ORDENES_AVERIAS : 
                tipo === tipos_orden.ALTAS ? cache_keys.ORDENES_ALTAS :
                tipo === tipos_orden.SPEEDY ? cache_keys.ORDENES_SPEEDY :
                '-'
    if (metodo === 'cruzarData' && user.cargo <= tipos_usuario.LIDER_GESTION) {
      return await this.ordenesService.cruzarOrdenes(key).then((res) => {
        return ({
          status: 'success',
          message: `(${res.length}) Ordenes actualizadas.`
        });
      }).catch((err) => {
        this.logger.error({message: err.message,service: 'getOrdenes(cruzarData)'});
        return ({
          status: 'error',
          message: err.message
        });
      });
    } else if (metodo === 'ordenesHoy' && user.cargo <= tipos_usuario.LIDER_GESTION) {
      return await this.ordenesService.obtenerOrdenesHoy(tipo).then((res) => {
        return ({
          status: 'success',
          message: `(${res.length}) Ordenes encontradas.`,
          data: res
        });
      }).catch((err) => {
        this.logger.error({message: err.message,service: 'getOrdenes(ordenesHoy)'});
        return ({
          status: 'error',
          message: err.message,
          data: null
        });
      });
    } else {
      this.logger.error({message: `Usuario: ${user.id} - intentó acceder sin permisos.`,service: 'getOrdenes(cruzarData)'});
      return({
        status: 'error',
        message: 'Metodo incorrecto o permisos insuficientes.'
      });
    };
  };

  // PRUEBA
  @Get('actividades')
  async getInicadores(@Query('tipo') tipo:string): Promise<TRespuesta> {
    const key = tipo === tipos_orden.AVERIAS ? cache_keys.ORDENES_AVERIAS : 
                tipo === tipos_orden.ALTAS ? cache_keys.ORDENES_ALTAS :
                tipo === tipos_orden.SPEEDY ? cache_keys.ORDENES_SPEEDY :
                '-'
    return this.ordenesService.obtenerIndicadorToa(key).then((data) => {
      return ({
        status: 'success',
        message: 'Data obtenido con exito.',
        data,
      })
    }).catch((e) => {
      return({
        status: 'error',
        message: e.message,
        data: null
      })
    })
  };

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.ordenesService.findOne(+id);
  // }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateOrdeneDto: UpdateOrdeneDto) {
  //   return this.ordenesService.update(+id, updateOrdeneDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ordenesService.remove(+id);
  // }
}
