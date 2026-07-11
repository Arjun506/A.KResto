import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { apiSuccess } from '../common/responses/api-response';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const data = await this.authService.register(registerDto);
    return apiSuccess(data, 'User registered successfully');
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);
    return apiSuccess(data);
  }
}
