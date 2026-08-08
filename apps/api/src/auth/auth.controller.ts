import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordRequestDto } from './dto/forgot-password-request.dto';
import { ForgotPasswordVerifyDto } from './dto/forgot-password-verify.dto';
import { ForgotPasswordResetDto } from './dto/forgot-password-reset.dto';
import { VerifyEmailConfirmDto } from './dto/verify-email-confirm.dto';
import { OtpVerifyDto } from './dto/otp-verify.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PublicTenant } from '../tenant/public-tenant.decorator';

@ApiTags('Authentication')
@PublicTenant()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @ApiOperation({ summary: 'Register new user account' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @ApiOperation({ summary: 'Authenticate user credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get currently authenticated user profile' })
  async getProfile(@Req() req: any) {
    return this.authService.getProfile(req.user.id);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @ApiOperation({ summary: 'Refresh expired access token' })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke session token' })
  async logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto.refreshToken);
  }

  @Post('forgot-password/request')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 60000, limit: 3 } })
  @ApiOperation({ summary: 'Request password reset OTP code' })
  async requestForgotPassword(@Body() dto: ForgotPasswordRequestDto) {
    return this.authService.requestForgotPassword(dto.email);
  }

  @Post('forgot-password/verify')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @ApiOperation({ summary: 'Verify password reset OTP code' })
  async verifyForgotPasswordOtp(@Body() dto: ForgotPasswordVerifyDto) {
    return this.authService.verifyForgotPasswordOtp(dto.email, dto.code);
  }

  @Post('forgot-password/reset')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @ApiOperation({ summary: 'Reset account password with token' })
  async resetPassword(@Body() dto: ForgotPasswordResetDto) {
    return this.authService.resetPassword(dto.resetToken, dto.newPassword);
  }

  @Post('verify-email/request')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request email verification link' })
  async requestEmailVerification(@Req() req: any) {
    return this.authService.requestEmailVerification(req.user.id);
  }

  @Post('verify-email/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm email verification token' })
  async confirmEmailVerification(@Body() dto: VerifyEmailConfirmDto) {
    return this.authService.confirmEmailVerification(dto.token);
  }

  @Post('2fa/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @ApiOperation({ summary: 'Verify 2FA TOTP / OTP code' })
  async verify2faOtp(@Req() req: any, @Body() dto: OtpVerifyDto) {
    return this.authService.verify2faOtp(req.user.id, dto.code);
  }
}
