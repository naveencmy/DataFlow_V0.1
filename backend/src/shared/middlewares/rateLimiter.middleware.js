import redis from '../../config/redis.js';
import { env } from '../../config/env.js';
import { AppError } from '../errors/AppError.js';

/**
 * Redis-backed rate limiter for sensitive endpoints like login
 */
export function rateLimiter({
  keyPrefix = 'rl',
  maxAttempts = env.LOGIN_RATE_LIMIT_MAX || 5,
  windowMs = env.LOGIN_RATE_LIMIT_WINDOW_MS || 900000,
} = {}) {
  return async (req, res, next) => {
    try {
      const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
      const key = `${keyPrefix}:${ip}`;

      const current = await redis.incr(key);

      if (current === 1) {
        await redis.expire(key, Math.ceil(windowMs / 1000));
      }

      if (current > maxAttempts) {
        return next(
          new AppError(
            'Too many requests. Please try again in 15 minutes.',
            429,
            'RATE_LIMIT_EXCEEDED'
          )
        );
      }

      res.setHeader('X-RateLimit-Limit', maxAttempts);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxAttempts - current));

      next();
    } catch (error) {
      // If Redis has issues, fail open to avoid service outage
      next();
    }
  };
}

export default rateLimiter;
