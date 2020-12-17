import { Module, CacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { RedisService } from './redis.service';

import { variables } from '../config';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get(variables.redis_host),
        port: configService.get(variables.redis_port),
        password: configService.get(variables.redis_pass),
        ttl: variables.redis_ttl,
      }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService] // This is IMPORTANT,  you need to export RedisCacheService here so that other modules can use it
})
export class RedisModule {}
