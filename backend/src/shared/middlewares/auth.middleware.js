import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { UnauthorizedError } from '../errors/AppError.js';

export function authenticateJWT(req, res, next) {
  try {
    let token = null;

    // 1. Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // 2. Fallback to access_token cookie
    if (!token && req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new UnauthorizedError('Authentication token missing. Please sign in.');
    }

    // Verify token
    jwt.verify(token, env.JWT_ACCESS_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return next(new UnauthorizedError('Token has expired. Please refresh your session.'));
        }
        return next(new UnauthorizedError('Invalid authentication token.'));
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    next(error);
  }
}

export default authenticateJWT;
