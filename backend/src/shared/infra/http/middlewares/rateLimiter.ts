import { Request, Response, NextFunction } from 'express';
import redis from 'redis';
/**
 *  By default the information about the requests is stored in the memory of our
 *  application.
 *
 * Instead of the application memory we are going to store on Redis. Thus
 * we import RateLimiterRedis. We are going to store the IP and how many requests
 * this IP made in the period of time that we defined.
 * */
import { RateLimiterRedis } from 'rate-limiter-flexible';
import AppError from '@shared/errors/AppError';

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit',
  // How many request. Here 5 requests
  points: 5,
  // How long. Here per 1 second by IP
  duration: 1,
});

export default async function (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await limiter.consume(request.ip);

    return next();
  } catch (err) {
    throw new AppError('Too many requests', 429);
  }
}
