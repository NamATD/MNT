import * as bcrypt from 'bcrypt';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByAddress(address: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ address });
  }

  async create(username: string, password: string): Promise<UserDocument> {
    try {
      // Check if user exists
      const existingUser = await this.userModel.findOne({ username }).exec();

      // If user already exists, check password
      if (existingUser) {
        // Verify password with bcrypt
        const isPasswordValid = await bcrypt.compare(
          password,
          existingUser.password,
        );

        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid credentials');
        }

        return existingUser;
      }

      // Hash the password before saving
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user with hashed password
      const newUser = await this.userModel.create({
        username,
        password: hashedPassword,
        role: 'user',
        createdAt: new Date(),
      });

      console.log(`Created new user: ${username}`);
      return newUser;
    } catch (error) {
      console.error('[USER] error:', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findById(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async findAll(): Promise<UserDocument[]> {
    const users = await this.userModel.find().exec();
    if (!users) {
      throw new NotFoundException();
    }
    return users;
  }

  async findByName(username: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ username }).lean().exec();
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async findByGoogleId(googleId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ googleId });
  }
}
