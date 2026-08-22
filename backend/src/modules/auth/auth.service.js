import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { authRepository } from './auth.repository.js';
import { env } from '../../config/env.js';
import redis from '../../config/redis.js';
import { generateSystemLoginId } from '../../shared/utils/idGenerator.js';
import { buildDefaultSalaryComponents } from '../../shared/utils/salaryEngine.js';
import { sendVerificationOtpEmail, sendWelcomeEmail } from '../../shared/utils/emailService.js';
import {
  AppError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../../shared/errors/AppError.js';

export class AuthService {
  constructor(repo = authRepository) {
    this.repo = repo;
  }

  generateTokens(payload) {
    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRY,
    });
    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRY,
    });
    return { accessToken, refreshToken };
  }

  async register(data) {
    const existing = await this.repo.findByEmail(data.email);
    if (existing) {
      throw new ConflictError('An account with this email address already exists');
    }

    // Generate unique Login ID
    const count = await this.repo.countEmployees();
    const loginId = generateSystemLoginId(data.fullName, data.companyName, new Date().getFullYear(), [
      { loginId: `OITEMP${new Date().getFullYear()}${String(count).padStart(4, '0')}` },
    ]);

    // Password Hash (cost factor 12)
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const userId = randomUUID();
    const employeeId = `emp-${count + 1}`;

    const defaultWage = 75000;
    const defaultSalary = {
      wageType: 'Fixed Wage',
      monthlyWage: defaultWage,
      annualWage: defaultWage * 12,
      components: buildDefaultSalaryComponents(defaultWage),
      employeePFPercentage: 12,
      employerPFPercentage: 12,
      professionalTax: 200,
      workingDaysPerWeek: 5,
      breakTimeMinutes: 60,
    };

    const result = await this.repo.createUserWithEmployee({
      user: {
        id: userId,
        email: data.email,
        loginId,
        passwordHash,
        role: data.role || 'EMPLOYEE',
        isEmailVerified: false,
      },
      employee: {
        id: employeeId,
        name: data.fullName,
        department: data.department || 'General',
        jobPosition: data.jobPosition || 'Team Member',
        company: data.companyName || 'Dayflow Technologies Pvt Ltd',
        dateOfJoining: new Date().toISOString().split('T')[0],
        salary: defaultSalary,
        skills: [],
        certifications: [],
        documents: [],
        bankDetails: {},
      },
    });

    // Generate 6-digit OTP in Redis (10m TTL)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(`otp:${data.email}`, otp, 'EX', 600);

    // Asynchronously send OTP email
    sendVerificationOtpEmail(data.email, otp).catch(() => {});
    sendWelcomeEmail(data.email, data.fullName, loginId, data.password).catch(() => {});

    return {
      message: 'Registration successful. Verification OTP sent to email.',
      user: {
        id: result.user.id,
        email: result.user.email,
        loginId: result.user.loginId,
        role: result.user.role,
        employeeId,
      },
    };
  }

  async login(identifier, password) {
    const user = await this.repo.findByEmailOrLoginId(identifier);
    if (!user) {
      throw new UnauthorizedError('Invalid login credentials');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid login credentials');
    }

    const payload = {
      userId: user.id,
      loginId: user.loginId,
      email: user.email,
      role: user.role,
      employeeId: user.employeeRecordId || null,
    };

    const tokens = this.generateTokens(payload);
    await this.repo.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        loginId: user.loginId,
        email: user.email,
        role: user.role,
        employeeId: user.employeeRecordId,
        name: user.employeeName || user.loginId,
        isEmailVerified: user.isEmailVerified,
      },
      tokens,
    };
  }

  async refreshTokens(refreshToken) {
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token required');
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    } catch (err) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const user = await this.repo.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedError('Refresh token revoked or invalid');
    }

    const payload = {
      userId: user.id,
      loginId: user.loginId,
      email: user.email,
      role: user.role,
      employeeId: user.employeeRecordId || null,
    };

    const tokens = this.generateTokens(payload);
    await this.repo.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId) {
    if (userId) {
      await this.repo.updateRefreshToken(userId, null);
    }
    return { success: true, message: 'Logged out successfully' };
  }

  async verifyEmail(email, otp) {
    const cachedOtp = await redis.get(`otp:${email}`);
    if (!cachedOtp || cachedOtp !== otp) {
      throw new ValidationError('Invalid or expired OTP verification code');
    }

    await this.repo.markEmailVerified(email);
    await redis.del(`otp:${email}`);

    return { success: true, message: 'Email verified successfully' };
  }

  async forgotPassword(email) {
    const user = await this.repo.findByEmail(email);
    if (!user) {
      // Return success anyway to avoid user enumeration attack
      return { success: true, message: 'If an account exists, a reset code has been sent.' };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(`pwd_reset:${email}`, otp, 'EX', 600);
    await sendVerificationOtpEmail(email, otp);

    return { success: true, message: 'Password reset code sent to your email.' };
  }

  async resetPassword(email, otp, newPassword) {
    const cachedOtp = await redis.get(`pwd_reset:${email}`);
    if (!cachedOtp || cachedOtp !== otp) {
      throw new ValidationError('Invalid or expired password reset OTP');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await this.repo.updatePassword(email, passwordHash);
    await redis.del(`pwd_reset:${email}`);

    return { success: true, message: 'Password updated successfully. You can now log in.' };
  }

  async getCurrentUser(userId) {
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found');
    }

    return {
      id: user.id,
      email: user.email,
      loginId: user.loginId,
      role: user.role,
      employeeId: user.employeeRecordId,
      isEmailVerified: user.isEmailVerified,
    };
  }
}

export const authService = new AuthService();
export default authService;
