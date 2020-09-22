import Redis, { Redis as RedisType } from 'ioredis';

import cacheConfig from '@config/cache';
import ICacheProvider from '../models/ICacheProvider';

export default class RedisCacheProvider implements ICacheProvider {
  private client: RedisType;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: any): Promise<void> {
    /**
     * As value is set to any, we can save whatever we want on Redis, and the
     * JSON.stringify() will ensure that whatever we got as a value,
     * it will be converted into a string using JSON
     * Examples of JSON.stringify:
     *
     * console.log(JSON.stringify({ x: 5, y: 6 }));
     * // expected output: "{"x":5,"y":6}"
     *
     *
     * console.log(JSON.stringify([new Number(3), new String('false'), new Boolean(false)]));
     * // expected output: "[3,"false",false]"
     */

    // Save information on Redis
    await this.client.set(key, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }

    /**
     * By default JSON.parse() always return any. So we use "as" to say that the
     * parsedData has type equal to what we pass as a Type argument to recover
     */
    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    // Get all keys that matches a pattern
    /**
     * Asterisk(*) - 	zero or more occurrences of preceding character. In this
     * case all occurrences that has "${prefix}:" and anything after
     * */
    const keys = await this.client.keys(`${prefix}:*`);

    /**
     * A Request/Response server can be implemented so that it is able to process
     * new requests even if the client didn't already read the old responses.
     * This way it is possible to send multiple commands to the server without
     * waiting for the replies at all, and finally read the replies in a single
     * step.
     * This is called pipelining.
     * */
    const pipeline = this.client.pipeline();

    // Arrange the pipeline
    keys.forEach(key => {
      pipeline.del(key);
    });

    // Execute the pipeline at once: all delete on the same time
    await pipeline.exec();
  }
}
