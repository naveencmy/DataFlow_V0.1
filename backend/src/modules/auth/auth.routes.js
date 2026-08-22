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

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', rateLimiter({ maxAttempts: 5, windowMs: 900000 }), validate(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authenticateJWT, authController.logout);
router.post('/verify-email', validate(verifyEmailSchema), authController.verifyEmail);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);
router.get('/me', authenticateJWT, authController.me);

export default router;
