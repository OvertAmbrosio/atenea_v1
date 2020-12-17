import { Injectable  } from '@nestjs/common'
import { Cron } from '@nestjs/schedule';
// import { exec } from 'child_process';

import { RedisService } from './database/redis.service';

@Injectable()
export class AppService {
  constructor ( private readonly redisService: RedisService ) {}

  getHello(): string {
    return 'Hello World!';
  }

  @Cron('0 0 0 * * *')
  handleCreon() {
    this.redisService.reset()
      .then(() => console.log('se resetea el registro de la caché'))
      .catch(() => console.log('error limpiando la caché'));
  };

  // @Cron('0 * * * * *')
  // prueba() {
  //   console.log('notepad.exe')
  //   exec('notepad.exe')
  // }
}
