import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    if (email === 'admin@a3resto.com' && password === '123456') {
      return {
        success: true,
        token: 'a3resto-token',
      };
    }

    return {
      success: false,
    };
  }
}
