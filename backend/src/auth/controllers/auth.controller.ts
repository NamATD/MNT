import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Res() res: Response,
  ) {
    const frontend_url = this.configService.get<string>('FRONTEND_URL') || '/';
    try {
      const token = await this.authService.login(body.username, body.password);
      console.log(token);
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1 * 24 * 60 * 60 * 1000,
      });

      res.redirect(frontend_url);
      console.log('user login');
    } catch {
      res.redirect(`${frontend_url}/login/error`);
    }
  }
}
