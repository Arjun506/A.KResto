import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import crypto from 'crypto';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly authTokenPepper: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    const pepper = process.env.AUTH_TOKEN_PEPPER;
    if (!pepper) {
      throw new Error('Missing AUTH_TOKEN_PEPPER env var');
    }
    this.authTokenPepper = pepper;
  }

  private hmacSha256Hex(value: string): string {
    return crypto
      .createHmac('sha256', this.authTokenPepper)
      .update(value)
      .digest('hex');
  }

  // Helper method to safely log auth events to the database audit logs
  private async logAuditEvent(
    userId: string | null,
    tenantId: string | null,
    action: string,
    changes: string[],
  ) {
    try {
      let finaltenantId = tenantId;
      if (!finaltenantId) {
        const firstTenant = await this.prisma.tenant.findFirst();
        if (firstTenant) {
          finaltenantId = firstTenant.id;
        } else {
          return; // Skip if no tenants exist in DB
        }
      }

      await this.prisma.audit_logs.create({
        data: {
          tenantId: finaltenantId,
          userId,
          entity: 'AUTH',
          entityId: userId || 'SYSTEM',
          action,
          changes,
          ipAddress: '127.0.0.1',
          userAgent: 'AK-Console-Browser',
        },
      });
    } catch (err) {
      console.error('Failed to log audit event:', err);
    }
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.users.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.users.create({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        passwordHash: hashedPassword,
        role: UserRole.OWNER,
        tenantId: registerDto.tenantId || null,
        isActive: true, // Default to true for ease of onboarding
      },
    });

    await this.logAuditEvent(user.id, user.tenantId, 'REGISTER', [
      `User ${user.email} registered successfully as ${user.role}`,
    ]);

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }

  // Generate OTP code for supported flows.
  // NOTE: behavior preserved (6 digits, secure-ish randomness).
  private static generateOtpCode(length: number): string {
    const digits = Math.max(1, Math.floor(length));
    const min = 10 ** (digits - 1);
    const max = 10 ** digits - 1;

    const cryptoBytes = crypto.randomBytes(4).readUInt32BE(0);
    const range = max - min + 1;
    const value = min + (cryptoBytes % range);

    return String(value).padStart(digits, '0');
  }

  private async consumeValidOtpOrThrow(params: {
    email: string;
    purpose: string;
    otp: string;
  }) {
    const otpHash = this.hmacSha256Hex(params.otp);

    const now = new Date();

    const session = await this.prisma.otp_sessions.findFirst({
      where: {
        email: params.email,
        purpose: params.purpose,
        otpHash,
        consumedAt: null,
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!session) {
      throw new BadRequestException(
        'Verification code has expired or was not requested',
      );
    }

    await this.prisma.otp_sessions.update({
      where: { id: session.id },
      data: { consumedAt: now },
    });

    return session;
  }

  private async createOtpSession(params: {
    email: string;
    purpose: string;
    otp: string;
    expiresAt: Date;
  }) {
    const otpHash = this.hmacSha256Hex(params.otp);

    await this.prisma.otp_sessions.create({
      data: {
        email: params.email,
        purpose: params.purpose,
        otpHash,
        expiresAt: params.expiresAt,
      },
    });
  }

  private async createPasswordResetToken(params: {
    userId: string;
    email: string;
    expiresAt: Date;
  }) {
    const resetToken = 'reset_' + Math.random().toString(36).substring(2, 15);
    const tokenHash = this.hmacSha256Hex(resetToken);

    await this.prisma.password_reset_tokens.create({
      data: {
        userId: params.userId,
        tokenHash,
        expiresAt: params.expiresAt,
      },
    });

    return resetToken;
  }

  private async consumeValidPasswordResetToken(params: { resetToken: string }) {
    const tokenHash = this.hmacSha256Hex(params.resetToken);
    const now = new Date();

    const record = await this.prisma.password_reset_tokens.findFirst({
      where: {
        tokenHash,
        consumedAt: null,
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new BadRequestException('Reset session has expired or is invalid');
    }

    await this.prisma.password_reset_tokens.update({
      where: { id: record.id },
      data: { consumedAt: now },
    });

    return record;
  }

  private async createRefreshSession(params: {
    userId: string;
    refreshToken: string;
    expiresAt: Date;
  }) {
    await this.prisma.refresh_sessions.create({
      data: {
        userId: params.userId,
        refreshTokenHash: this.hmacSha256Hex(params.refreshToken),
        expiresAt: params.expiresAt,
      },
    });
  }

  private async revokeRefreshSessionByToken(params: { refreshToken: string }) {
    const tokenHash = this.hmacSha256Hex(params.refreshToken);
    await this.prisma.refresh_sessions.updateMany({
      where: {
        refreshTokenHash: tokenHash,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  }

  private async verifyAndConsumeRefreshSession(params: {
    refreshToken: string;
  }) {
    const tokenHash = this.hmacSha256Hex(params.refreshToken);
    const decoded = await this.jwtService
      .verifyAsync(params.refreshToken)
      .catch(() => null);

    if (!decoded || decoded.type !== 'refresh') {
      throw new UnauthorizedException('Invalid or revoked refresh token');
    }

    const now = new Date();

    const session = await this.prisma.refresh_sessions.findFirst({
      where: {
        refreshTokenHash: tokenHash,
        revokedAt: null,
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });

    if (!session) {
      throw new UnauthorizedException('Invalid or revoked refresh token');
    }

    return session;
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.users.findUnique({
      where: { email: loginDto.email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    } as const;

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m', // Short-lived access token
    });

    // Generate stateless refresh token
    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id, type: 'refresh' },
      { expiresIn: '7d' },
    );

    // Persist refresh session (hashed)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.createRefreshSession({
      userId: user.id,
      refreshToken,
      expiresAt,
    });

    // Update user's last login
    await this.prisma.users.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await this.logAuditEvent(user.id, user.tenantId, 'LOGIN', [
      `User logged in. Session tokens generated.`,
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        tenantId: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    if (!user || !user.isActive) {
      throw new NotFoundException('User profile not found or inactive');
    }

    return user;
  }

  async refresh(refreshToken: string) {
    const session = await this.verifyAndConsumeRefreshSession({
      refreshToken,
    });

    const user = session.user;
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not active');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    } as const;

    const newAccessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const newRefreshToken = await this.jwtService.signAsync(
      { sub: user.id, type: 'refresh' },
      { expiresIn: '7d' },
    );

    // Rotate refresh token
    await this.revokeRefreshSessionByToken({ refreshToken });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.createRefreshSession({
      userId: user.id,
      refreshToken: newRefreshToken,
      expiresAt,
    });

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }

  async logout(refreshToken: string) {
    await this.revokeRefreshSessionByToken({ refreshToken });

    // Preserve behavior: attempt audit log using token subject
    try {
      const decoded = this.jwtService.decode(refreshToken);
      if (decoded?.sub) {
        const user = await this.prisma.users.findUnique({
          where: { id: decoded.sub },
        });
        if (user) {
          await this.logAuditEvent(user.id, user.tenantId, 'LOGOUT', [
            `User logged out. Revoked refresh token.`,
          ]);
        }
      }
    } catch {
      // Safe to ignore decode errors on logout
    }

    return { success: true };
  }

  // Forgot Password request
  async requestForgotPassword(email: string) {
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success to prevent email enumeration attacks
      return {
        success: true,
        message: 'Recovery code dispatched if email is registered',
      };
    }

    const code = await AuthService.generateOtpCode(6);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await this.createOtpSession({
      email,
      purpose: 'FORGOT_PASSWORD',
      otp: code,
      expiresAt,
    });

    // RC2: Removed sensitive OTP logging (OTP code and related timing)

    await this.logAuditEvent(
      user.id,
      user.tenantId,
      'FORGOT_PASSWORD_REQUEST',
      [`Password recovery OTP code generated for ${email}`],
    );

    return {
      success: true,
      message: 'Recovery code dispatched if email is registered',
    };
  }

  // Verify OTP
  async verifyForgotPasswordOtp(email: string, code: string) {
    await this.consumeValidOtpOrThrow({
      email,
      purpose: 'FORGOT_PASSWORD',
      otp: code,
    });

    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User no longer exists');
    }

    // Generate temporary reset token
    const resetToken = await this.createPasswordResetToken({
      userId: user.id,
      email,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    return { success: true, resetToken };
  }

  // Reset Password using session token
  async resetPassword(resetToken: string, newPassword: string) {
    const record = await this.consumeValidPasswordResetToken({
      resetToken,
    });

    const user = await this.prisma.users.findUnique({
      where: { id: record.userId },
    });

    if (!user) {
      throw new NotFoundException('User no longer exists');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.users.update({
      where: { id: user.id },
      data: { passwordHash: hashedPassword },
    });

    await this.logAuditEvent(user.id, user.tenantId, 'PASSWORD_RESET', [
      `User password successfully changed using reset token`,
    ]);

    return { success: true, message: 'Password updated successfully' };
  }

  // Verify Email Request
  async requestEmailVerification(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const code = await AuthService.generateOtpCode(6);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await this.createOtpSession({
      email: user.email,
      purpose: 'EMAIL_VERIFICATION',
      otp: code,
      expiresAt,
    });

    // RC2: Removed sensitive email verification token/url logging

    return { success: true, message: 'Verification link dispatched' };
  }

  // Confirm Email Verification
  async confirmEmailVerification(token: string) {
    // Token will be of format: verify_userId
    const userId = token.replace('verify_', '');
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired verification link');
    }

    await this.prisma.users.update({
      where: { id: userId },
      data: { isActive: true },
    });

    await this.logAuditEvent(user.id, user.tenantId, 'EMAIL_VERIFICATION', [
      `User email verified successfully. Account fully activated.`,
    ]);

    return { success: true, message: 'Email verified and account activated' };
  }

  // 2FA OTP verify
  async verify2faOtp(userId: string, code: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Invalid authentication code');
    }

    await this.consumeValidOtpOrThrow({
      email: user.id,
      purpose: '2FA',
      otp: code,
    }).catch(() => {
      // preserve existing message
      throw new BadRequestException('Invalid authentication code');
    });

    if (user) {
      await this.logAuditEvent(user.id, user.tenantId, '2FA_VERIFICATION', [
        `2FA session authorized successfully`,
      ]);
    }

    return { success: true };
  }
}
