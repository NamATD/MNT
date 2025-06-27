import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

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
    try {
      const token = await this.authService.login(body.username, body.password);
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).send('Login success');
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
