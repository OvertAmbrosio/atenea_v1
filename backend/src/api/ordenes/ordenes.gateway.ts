import { Inject } from '@nestjs/common';
import { 
  MessageBody,
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

  @SubscribeMessage('suscribirseOrdenesGpon')
  enviarOrdenes(client: Socket, data: string) {
    return this.prueba();
  };

  public async prueba() {
    const ordenes = await this.redisService.get(cache_keys.ORDENES_ALTAS).then(async(altas) => {
      const averias = await this.redisService.get(cache_keys.ORDENES_AVERIAS);
      return ({altas, averias});
    }).catch((err) => console.log(err))
    return this.server.emit('ordenesGpon',  ordenes);
  };  

  public afterInit(server: Server): void {
    console.log('Init');
  }

  public handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
  }

  public handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    return client.id
  }
}
