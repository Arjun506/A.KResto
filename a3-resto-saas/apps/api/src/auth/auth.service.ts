import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private users: Array<{
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    restaurantId: string | null;
  }> = [];

  constructor(private jwtService: JwtService) {
    void this.seedUsers();
  }

  private async seedUsers() {
    const hashed = await bcrypt.hash('654321', 10);
    this.users.push(
      {
        id: 'admin-id',
        name: 'Super Admin',
        email: 'admin@restobill.com',
        password: hashed,
        role: 'SUPER_ADMIN',
        restaurantId: null,
      },
      {
        id: 'owner-id',
        name: 'Restaurant Owner',
        email: 'owner@restobill.com',
        password: hashed,
        role: 'OWNER',
        restaurantId: 'rest-1',
      }
    );
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = {
      id: Date.now().toString(),
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      role: 'OWNER',
      restaurantId: registerDto.restaurantId || null,
    };

    this.users.push(user);

    return {
      message: 'User registered successfully',
      user,
    };
  }

  async login(loginDto: LoginDto) {
    const user = this.users.find((u) => u.email === loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      restaurantId: user.restaurantId,
    } as const;

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
