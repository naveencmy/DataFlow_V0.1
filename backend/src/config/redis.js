import Redis from 'ioredis';
import { env } from './env.js';
import { logger } from './logger.js';

class InMemoryFallbackRedis {
  constructor() {
    this.store = new Map();
    this.ttls = new Map();
  }

  async get(key) {
    if (this.ttls.has(key)) {
      if (Date.now() > this.ttls.get(key)) {
        this.store.delete(key);
        this.ttls.delete(key);
        return null;
      }
    }
    return this.store.get(key) || null;
  }

  async set(key, value, mode, ttl) {
    this.store.set(key, String(value));
    if (mode === 'EX' && ttl) {
      this.ttls.set(key, Date.now() + ttl * 1000);
    } else if (mode === 'PX' && ttl) {
      this.ttls.set(key, Date.now() + ttl);
    }
    return 'OK';
  }

  async del(key) {
    this.ttls.delete(key);
    return this.store.delete(key) ? 1 : 0;
  }

  async incr(key) {
    const val = (parseInt(this.store.get(key), 10) || 0) + 1;
    this.store.set(key, String(val));
    return val;
  }

  async expire(key, seconds) {
    this.ttls.set(key, Date.now() + seconds * 1000);
    return 1;
  }
}

let redisClient;

try {
  redisClient = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD || undefined,
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 3) {
        logger.warn('Redis unreachable. Falling back to in-memory store.');
        return null;
      }
      return Math.min(times * 100, 2000);
    },
  });

  redisClient.on('connect', () => {
    logger.info('🔴 Connected to Redis successfully');
  });

  redisClient.on('error', (err) => {
    logger.warn({ err: err.message }, 'Redis error, using fallback');
  });

  // Attempt connect
  redisClient.connect().catch(() => {
    logger.warn('⚠️ Redis not available at localhost:6379, activated in-memory fallback cache');
    redisClient = new InMemoryFallbackRedis();
  });
} catch (e) {
  logger.warn('⚠️ Redis initialization fallback activated');
  redisClient = new InMemoryFallbackRedis();
}

export const redis = redisClient;
export default redis;
