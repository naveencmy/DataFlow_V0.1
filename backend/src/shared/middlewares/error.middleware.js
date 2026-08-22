import { AppError } from '../errors/AppError.js';
import { logger } from '../../config/logger.js';
import { env } from '../../config/env.js';

export function notFoundHandler(req, res, next) {
  next(new AppError(`Resource not found: ${req.method} ${req.originalUrl}`, 404, 'NOT_FOUND'));
}

export function globalErrorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let code = err.code || 'INTERNAL_SERVER_ERROR';
  let message = err.message || 'An unexpected error occurred on the server';
  let details = err.details || null;

  // Handle Prisma / Database known error codes
  if (err.code === 'P2002') {
    statusCode = 409;
    code = 'DUPLICATE_KEY';
    message = 'A record with this identifier already exists';
    details = err.meta?.target || null;
  } else if (err.code === 'P2025') {
    statusCode = 404;
    code = 'NOT_FOUND';
    message = 'The requested database record was not found';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = 'INVALID_TOKEN';
    message = 'Invalid authentication token';
  }

  // Structured error logging
  if (statusCode >= 500) {
    logger.error(
      {
        err: {
          message: err.message,
          stack: err.stack,
          code: err.code,
        },
        path: req.originalUrl,
        method: req.method,
      },
      '💥 Unhandled Server Exception'
    );
  }

  const responsePayload = {
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
      ...(env.NODE_ENV === 'development' && statusCode >= 500 ? { stack: err.stack } : {}),
    },
  };

  res.status(statusCode).json(responsePayload);
}

export default {
  notFoundHandler,
  globalErrorHandler,
};
