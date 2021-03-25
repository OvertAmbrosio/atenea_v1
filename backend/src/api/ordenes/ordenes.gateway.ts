import { Inject } from '@nestjs/common';
import {
  OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, 
  SubscribeMessage, WebSocketGateway, WebSocketServer,  
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { RedisService } from 'src/database/redis.service';
import { cache_keys } from 'src/config/variables';


@WebSocketGateway()
export class OrdenesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor (
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly redisService: RedisService,
  ) {}

  @WebSocketServer() private readonly server: Server;
  
  @SubscribeMessage('connection')
  handleEvent(client: Socket, data: string) {
    console.log(data);
    console.log('Cliente -- ',client.id);
    
    // this.server.emit('connection', payload);
    return client.id
  };

  @SubscribeMessage('obtenerOrdenes')
  async enviarOrdenes(client: Socket) {
    let averias = {};
    let altas = {} ;
    let hora = new Date();
    try {
      averias = await this.redisService.get(cache_keys.ORDENES_AVERIAS).catch((err) => console.log(err))
      altas = await this.redisService.get(cache_keys.ORDENES_ALTAS).catch((err) => console.log(err))
    } catch (error) {
      console.log(error);
    };
    
    return client.emit('ordenesGraficos', {averias, altas, hora});
  };

  @SubscribeMessage('enviarIndicadores')
  async enviarIndicadores(client: Socket) {
    let imagenes = [];

    try {
      imagenes = await Promise.all([1,2,3,4,5,6,7,8].map(async(e) => await this.redisService.get(`IMAGENES_imagen${e}`)))
    } catch (error) {
      console.log(error);
    };
    
    return client.emit('indicadoresimagenes', imagenes);
  };

  public async enviarOdenesToa() {
    let averias = {};
    let altas = {};
    let hora = new Date();
    try {
      averias =  await this.redisService.get(cache_keys.ORDENES_AVERIAS).catch((err) => console.log(err));
      altas =  await this.redisService.get(cache_keys.ORDENES_ALTAS).catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    };

    return this.server.emit('ordenesGraficos',  {averias, altas, hora});
  };  

  public async enviarEnConexionIndicadores() {
    let imagenes = [];

    try {
      imagenes = await Promise.all([1,2,3,4,5,6,7,8].map(async(e) => await this.redisService.get(`IMAGENES_imagen${e}`)))
    } catch (error) {
      console.log(error);
    };
    

    return this.server.emit('indicadoresimagenes', imagenes);
  };  

  public afterInit(server: Server): void {
    console.log('-------------Socket iniciado---------');
  };

  public handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
  };

  public handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    return client.id
  };
}
