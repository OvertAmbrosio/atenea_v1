import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache
  ) {}

  async get(key: string) {
    return await this.cache.get(key);
  };

  async set(key: string, value: string, ttl: number) {
    await this.cache.set(key, value, { ttl });
  };

  async remove(key: string) {
    await this.cache.del(key);
  };

  async reset() {
    await this.cache.reset();
  };
}