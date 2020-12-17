import { Controller, Get } from '@nestjs/common';
import { RedisService } from 'src/database/redis.service';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  };

  @Get('/liberarUsuarios')
  liberar(){
    this.redisService.reset();
    return ("todo borrado")
  }
}
