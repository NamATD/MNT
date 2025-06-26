import { Body, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/getAll')
  async findAll() {
    return await this.userService.findAll();
  }

  @Get()
  async getOne(@Query('name') name: string) {
    console.log((await this.userService.findByName(name))._id);
    return await this.userService.findByName(name);
  }
}
