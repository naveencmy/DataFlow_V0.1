import { Router } from 'express';
import { authController } from './auth.controller.js';
import { validate } from '../../shared/middlewares/validate.middleware.js';
import { authenticateJWT } from '../../shared/middlewares/auth.middleware.js';
import { rateLimiter } from '../../shared/middlewares/rateLimiter.middleware.js';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.validation.js';

const router = Router();

// Registration / Signup
router.post('/register', validate(registerSchema), authController.register);
router.post('/signup', validate(registerSchema), authController.register);

// Login
router.post('/login', rateLimiter({ maxAttempts: 10, windowMs: 900000 }), validate(loginSchema), authController.login);

// Session & Profile
router.post('/refresh', authController.refresh);
router.post('/logout', authenticateJWT, authController.logout);
router.get('/me', authenticateJWT, authController.me);

// Security & Passwords
router.put('/change-password', authenticateJWT, authController.changePassword);
router.post('/change-password', authenticateJWT, authController.changePassword);
router.post('/verify-email', validate(verifyEmailSchema), authController.verifyEmail);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

export default router;
