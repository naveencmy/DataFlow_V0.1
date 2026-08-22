import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

let ioInstance = null;

export function initializeSocketServer(httpServer) {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    },
    path: '/socket.io',
  });

  const notifNamespace = ioInstance.of('/notifications');

  // Socket Authentication Middleware with JWT
  notifNamespace.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        return next(new Error('Authentication token missing'));
      }

      jwt.verify(token, env.JWT_ACCESS_SECRET, (err, decoded) => {
        if (err) {
          return next(new Error('Invalid socket authentication token'));
        }
        socket.user = decoded;
        next();
      });
    } catch (error) {
      next(new Error('Socket authentication error'));
    }
  });

  notifNamespace.on('connection', (socket) => {
    const user = socket.user;
    logger.info({ userId: user.userId, role: user.role }, '⚡ Real-time WebSocket client connected');

    // Join personal room and role room
    if (user.employeeId) {
      socket.join(`emp_${user.employeeId}`);
    }
    socket.join(`user_${user.userId}`);

    if (user.role === 'ADMIN' || user.role === 'HR') {
      socket.join('admin_room');
    }

    socket.on('disconnect', () => {
      logger.info({ userId: user.userId }, 'WebSocket client disconnected');
    });
  });

  logger.info('🔌 Socket.io /notifications namespace initialized');
  return ioInstance;
}

export function getIO() {
  return ioInstance ? ioInstance.of('/notifications') : null;
}

export default { initializeSocketServer, getIO };
