import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  Response,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { AuthGuard } from '@nestjs/passport';
import { Auth, JwtPayload } from 'src/auth/decorators/auth.decorator';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/getAll')
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('/me')
  async getMe(@Auth() auth: JwtPayload) {
    return this.userService.getMe(auth._id);
  }

  @Get()
  async getOne(@Query('name') name: string) {
    console.log((await this.userService.findByName(name))._id);
    return await this.userService.findByName(name);
  }
}
