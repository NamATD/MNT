import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/user/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<UserDocument> {
    const user = await this.usersService.findByName(username);
    const isCorrectPassword = await bcrypt.compare(pass, user.password);
    if (!user || !isCorrectPassword) {
      throw new UnauthorizedException();
    }

    return user;
  }

  createToken(user: UserDocument): string {
    const payload = { _id: user._id, role: user.role };
    return this.jwtService.sign(payload);
  }

  async login(username: string, pass: string) {
    const user = await this.validateUser(username, pass);
    if (!user) {
      throw new UnauthorizedException();
    }

    return this.createToken(user);
  }
}
