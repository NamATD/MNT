import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Post('/login')
  async login(@Body() body: { username: string; password: string }) {
    return await this.userService.create(body.username, body.password);
  }
}
