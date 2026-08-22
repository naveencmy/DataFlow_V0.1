import { authService } from './auth.service.js';
import { env } from '../../config/env.js';

export class AuthController {
  constructor(service = authService) {
    this.service = service;
  }

  setTokenCookie(res, refreshToken) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  register = async (req, res, next) => {
    try {
      const result = await this.service.register(req.body);
      if (result.refreshToken) {
        this.setTokenCookie(res, result.refreshToken);
      }
      res.status(201).json({
        success: true,
        token: result.token,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const identifier = req.body.loginId || req.body.email || req.body.identifier;
      const { password } = req.body;
      const result = await this.service.login(identifier, password);

      this.setTokenCookie(res, result.refreshToken);

      res.status(200).json({
        success: true,
        token: result.token,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
        data: {
          user: result.user,
          token: result.token,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req, res, next) => {
    try {
      const token = req.body.refreshToken || req.cookies?.refreshToken;
      const tokens = await this.service.refreshTokens(token);

      this.setTokenCookie(res, tokens.refreshToken);

      res.status(200).json({
        success: true,
        token: tokens.accessToken,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      await this.service.logout(userId);

      res.clearCookie('refreshToken');
      res.clearCookie('accessToken');

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req, res, next) => {
    try {
      const result = await this.service.changePassword(req.user.userId, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  verifyEmail = async (req, res, next) => {
    try {
      const { email, otp } = req.body;
      const result = await this.service.verifyEmail(email, otp);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      const result = await this.service.forgotPassword(email);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const { email, otp, newPassword } = req.body;
      const result = await this.service.resetPassword(email, otp, newPassword);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  me = async (req, res, next) => {
    try {
      const user = await this.service.getCurrentUser(req.user.userId);
      res.status(200).json({
        success: true,
        user,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
export default authController;
