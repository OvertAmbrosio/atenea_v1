import { Body, Controller, Get, Post } from '@nestjs/common';
// import { Response } from 'express';

import { RedisService } from 'src/database/redis.service';
import { OrdenesGateway } from './api/ordenes/ordenes.gateway';
import { AppService } from './app.service';
import { TRespuesta } from './helpers/types';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redisService: RedisService,
    private readonly ordenesGateway: OrdenesGateway
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  };

  @Get('/liberarUsuarios')
  liberar(){
    this.redisService.reset();
    return ("todo borrado")
  };

  @Post("/indicadores")
  async guardarImagen(@Body("data") data:any): Promise<TRespuesta> {
    await this.redisService.set(`IMAGENES_${data.titulo}`, data.imagen, 86400);
    await this.ordenesGateway.enviarEnConexionIndicadores()
    return ({
      status: "success",
      message: "Todo ok compa."
    })
  };

  @Get("/indicadores")
  async listarImagenes(): Promise<TRespuesta> {
    return await Promise.all([1,2,3,4,5,6,7,8].map(async(e) => await this.redisService.get(`IMAGENES_imagen${e}`)))
      .then((a) => ({status: "success",
      message: "hola",
      data: a}));
  };
};
