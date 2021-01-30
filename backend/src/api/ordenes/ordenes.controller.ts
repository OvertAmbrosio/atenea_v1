import { 
  Controller, Get, Post, Body, Put, Patch, 
  Param, Delete, Req, UseGuards, Inject, Query, UseInterceptors, UploadedFiles
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Request } from 'express';

import { OrdenesService } from './ordenes.service';
import { CreateOrdeneDto } from './dto/create-ordene.dto';
import { UpdateOrdeneDto } from './dto/update-ordene.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { tipos_orden, tipos_usuario } from 'src/constants/enum';
import { TBodyUpdateOrden, TInfanciasExternas, TRespuesta } from 'src/helpers/types';
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
    @Body('ordenesExternas') ordenesExternas:TInfanciasExternas[],
    @Body('orden') createOrdenDto:CreateOrdeneDto
  ): Promise<TRespuesta> {
    const user:any = req.user;
    //metodo para subir las data del excel de cms
    if (metodo === 'subirData' && user && user.cargo <= tipos_usuario.LIDER_GESTION) {
      return await this.ordenesService.subirData(createOrdenesDto, user.id).then((resp) => {
        return ({
          status: 'success',
          message: 'Ordenes subidas correctamente.',
          data: resp
        })
      }).catch((err) => {
        this.logger.error({
          message: err.message,
          service: 'Error subiendo las ordenes (subirData)'
        });
        return ({status: 'error', message: 'Error subiendo las ordenes (subirData)', data: []});
      });
    } else if (metodo === 'subirInfanciasExternas' && user && user.cargo <= tipos_usuario.LIDER_GESTION) {
      return await this.ordenesService.subirInfanciasExternas(ordenesExternas, user.id).then((resp) => {
        return (resp)
      }).catch((err) => {
        this.logger.error({
          message: err.message,
          service: 'Error subiendo las ordenes (subirData)'
        });
        return ({status: 'error', message: 'Error subiendo las ordenes (subirData)'});
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

    this.logger.info({
      message: estado,
      service: 'actividades'
    });

    return await this.ordenesService.guardarDataToa(rutas, averias, altas, speedy).then(() => {
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
  async getOrdenes(
    @Req() req:Request, 
    @Query('metodo') metodo:string, 
    @Query('tipo') tipo:string, 
    @Query('codigo_cliente') codigo_cliente:string,
    @Query('id') id_orden: string,
    @Query('id_ordenes') id_ordenes: string[],
    @Query('todo') todo: string
  ): Promise<TRespuesta> {
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
    } else if (metodo === 'comprobarInfancias') {
      return await this.ordenesService.comprobarInfancias().then((res:Array<boolean>) => {
        const infanciasEncontradas = res && res.length > 0 ? res.filter((e:boolean) => e) : null;
        
        return ({
          status: 'success',
          message: `(${infanciasEncontradas ? infanciasEncontradas.length : 0}) Infancias encontradas.`,
          data: res
        });
      }).catch((err) => {
        this.logger.error({message: err.message,service: 'getOrdenes(comprobarInfancias)'});
        return ({
          status: 'error',
          message: err.message,
          data: null
        });
      });
    } else if (metodo === 'obtenerOrdenesPendientes' && user.cargo <= tipos_usuario.LIDER_GESTION) {
      return await this.ordenesService.obtenerOrdenesPendientes(tipo).then((res) => {
        return ({
          status: 'success',
          message: `(${res.length}) Ordenes encontradas.`,
          data: res
        });
      }).catch((err) => {
        this.logger.error({message: err.message,service: 'getOrdenes(obtenerOrdenesPendientes)'});
        return ({
          status: 'error',
          message: err.message,
          data: null
        });
      });
    } else if (metodo === 'obtenerOrdenesLiquidadas' && user.cargo <= tipos_usuario.LIDER_GESTION) {
      return await this.ordenesService.obtenerOrdenesLiquidadas(tipo).then((res) => {
        return ({
          status: 'success',
          message: `(${res.length}) Ordenes encontradas.`,
          data: res
        });
      }).catch((err) => {
        this.logger.error({message: err.message,service: 'getOrdenes(obtenerOrdenesLiquidadas)'});
        return ({
          status: 'error',
          message: err.message,
          data: null
        });
      });
    } else if (metodo === 'obtenerOrdenesOtrasBandejas' && user.cargo <= tipos_usuario.LIDER_GESTION) {
      return await this.ordenesService.obtenerOrdenesOtrasBandejas(tipo).then((res) => {
        return ({
          status: 'success',
          message: `(${res.length}) Ordenes encontradas.`,
          data: res
        });
      }).catch((err) => {
        this.logger.error({message: err.message,service: 'getOrdenes(obtenerOrdenesOtrasBandejas)'});
        return ({
          status: 'error',
          message: err.message,
          data: null
        });
      });
    } else if (metodo === 'obtenerOrdenesAnuladas' && user.cargo <= tipos_usuario.LIDER_GESTION) {
      return await this.ordenesService.obtenerOrdenesAnuladas(tipo).then((res) => {
        return ({
          status: 'success',
          message: `(${res.length}) Ordenes encontradas.`,
          data: res
        });
      }).catch((err) => {
        this.logger.error({message: err.message,service: 'getOrdenes(obtenerOrdenesAnuladas)'});
        return ({
          status: 'error',
          message: err.message,
          data: null
        });
      });
    } else if (metodo === 'ordenesHoyGestor') {
      return await this.ordenesService.obtenerOrdenesHoyGestor(user.id).then((res) => {
        return ({
          status: 'success',
          message: `(${res.length}) Ordenes encontradas.`,
          data: res
        });
      }).catch((err) => {
        this.logger.error({message: err.message,service: 'getOrdenes(ordenesHoyGestor)'});
        return ({
          status: 'error',
          message: err.message,
          data: null
        });
      });
    } else if (metodo === 'buscarReiterada' && codigo_cliente) {
      return await this.ordenesService.obtenerReiteradas(codigo_cliente).then((res) => {
        return ({
          status: 'success',
          message: `(${res.length}) Ordenes encontradas.`,
          data: res
        });
      }).catch((err) => {
        this.logger.error({message: err.message,service: 'getOrdenes(buscarReiterada)'});
        return ({
          status: 'error',
          message: err.message,
          data: null
        });
      });
    } else if (metodo === 'buscarInfancia' && id_orden) {
      return await this.ordenesService.obtenerInfancia(id_orden).then((res) => {
        return ({
          status: 'success',
          message: `Orden encontrada correctamente.`,
          data: res
        });
      }).catch((err) => {
        this.logger.error({message: err.message,service: 'getOrdenes(buscarInfancia)'});
        return ({
          status: 'error',
          message: err.message,
          data: null
        });
      });
    } else if (metodo === 'buscarRegistro' && id_orden) {
      return await this.ordenesService.obtenerRegistros(id_orden).then((res) => {
        return ({
          status: 'success',
          message: `Registros encontrados correctamente.`,
          data: res
        });
      }).catch((err) => {
        this.logger.error({message: err.message,service: 'getOrdenes(buscarRegistro)'});
        return ({
          status: 'error',
          message: err.message,
          data: null
        });
      });
    } else if (metodo === 'exportarPendientes' && tipo) {
      return await this.ordenesService.obtenerPendientesExportar(todo, tipo, id_ordenes).then((res) => {
        return ({
          status: 'success',
          message: `Registros encontrados correctamente.`,
          data: res
        });
      }).catch((err) => {
        this.logger.error({message: err.message,service: 'getOrdenes(exportarPendientes)'});
        return ({
          status: 'error',
          message: err.message,
          data: null
        });
      });
    } else {
      this.logger.error({message: `Usuario: ${user.id} - intentó acceder con metodo incorrecto.`, service: 'getOrdenes'});
      return({
        status: 'error',
        message: 'Metodo incorrecto o permisos insuficientes.'
      });
    };
  };

  @Put()
  @UseGuards(JwtAuthGuard)
  async editarOrdenes(@Req() req:Request, @Body('metodo') metodo:string, @Body('ordenes') updateOrdeneDto:UpdateOrdeneDto[]): Promise<TRespuesta> {
    const user:any = req.user; 

    if (metodo === 'actualizarLiquidadas' && user.cargo <= tipos_usuario.LIDER_GESTION) {
      return await this.ordenesService.liquidarOrdenes(updateOrdeneDto, user.id).then((data) => {
        return ({
          status: 'success',
          message: `(${data.actualizados}) Ordenes actualizadas.`,
          data
        })
      }).catch((err) => {
        this.logger.error({ message: err.message, service: 'editarOrdenes(actualizarLiquidadas)' });
        return ({
          status: 'error',
          message: 'Error actualizando las ordenes.',
          data: null,
        })
      });
    } else {
      this.logger.error({message: `Usuario: ${user.id} - intentó acceder sin permisos.`, service: 'editarOrdenes'});
      return({
        status: 'error',
        message: 'Metodo incorrecto o permisos insuficientes.'
      });
    }
  };

  @Patch()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async actualizarOrden(
    @Req() req:Request, 
    @Body() data:TBodyUpdateOrden,
    @UploadedFiles() files:any
  ): Promise<TRespuesta> {
    const user:any = req.user;    
    
    if (data.metodo === 'agendarOrden' && user.cargo <= tipos_usuario.LIDER_GESTION) {
      return await this.ordenesService.agendarOrden(data.ordenes, user.id, data.bucket, data.contrata, data.gestor, data.fecha_cita, data.observacion)
        .then((data) => ({status: 'success', message: `(${data.nModified}) Ordenes actualizadas correctamente.`}))
        .catch((err) => {
          this.logger.error({message: err.message, service: 'actualizarOrden(agendarOrden)'})
          return ({status: 'error', message: 'Error actualizando las ordenes.'})
        })
    } else if (data.metodo === 'agendarOrdenGestor') {
      return await this.ordenesService.agendarOrden(data.ordenes, user.id, data.bucket, data.contrata, user.id, data.tecnico, data.fecha_cita, data.observacion)
        .then((data) => ({status: 'success', message: `(${data.nModified}) Ordenes actualizadas correctamente.`}))
        .catch((err) => {
          this.logger.error({message: err.message, service: 'actualizarOrden(agendarOrden)'})
          return ({status: 'error', message: 'Error actualizando las ordenes.'})
        })
    } else if (data.metodo === 'asignarOrden' && user.cargo <= tipos_usuario.LIDER_GESTION) {
      return await this.ordenesService.asignarOrden(data.ordenes, user.id, data.contrata, data.gestor, data.auditor, data.tecnico, data.observacion)
        .then((data) => ({status: 'success', message: `(${data.nModified}) Ordenes actualizadas correctamente.`}))
        .catch((err) => {
          this.logger.error({message: err.message, service: 'actualizarOrden(asignarOrden)'})
          return ({status: 'error', message: 'Error actualizando las ordenes.'})
        })
    } else if (data.metodo === 'actualizarEstado') {      
      return await this.ordenesService.actualizarEstadoOrden(user.id, data.ordenes, data.observacion, data.estado, files)
        .then(() => ({ status: 'success', message: 'Ordenes actualizadas correctamente.'}))
        .catch((err) => {
        this.logger.error({ message: err.message, service: 'actualizarOrden(actualizarEstado)'});
        return ({
          status: 'error',
          message: 'Error actualizando las ordenes.'
        })
      })
    } else if (data.metodo === 'devolverOrden') {      
      return await this.ordenesService.devolverOrden(user.id, data.id, data.observacion, files)
        .then((data) => {
          if (data) {
            return ({ status: 'success', message: 'Orden actualizadas correctamente.'})
          } else {
            return ({ status: 'warn', message: 'No se encontró la orden o no es una orden "Remedy".'})
          }
        }).catch((err) => {
          this.logger.error({ message: err.message, service: 'actualizarOrden(devolverOrden)'});
        return ({
          status: 'error',
          message: 'Error actualizando las ordenes.'
        })
      })
    } else {
      this.logger.error({message: `Usuario: ${user.id} - intentó acceder sin permisos.`, service: 'actualizarOrden'});
      return({
        status: 'error',
        message: 'Metodo incorrecto o permisos insuficientes.'
      });
    }
  };
};
