import { logger } from '../../config/logger.js';

export function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      durationMs: duration,
      userId: req.user?.userId || 'anonymous',
      ip: req.ip || req.socket.remoteAddress,
    };

    if (res.statusCode >= 500) {
      logger.error(logData, 'HTTP Request Error');
    } else if (res.statusCode >= 400) {
      logger.warn(logData, 'HTTP Request Warning');
    } else {
      logger.info(logData, 'HTTP Request Completed');
    }
  });

  next();
}

export default requestLogger;
