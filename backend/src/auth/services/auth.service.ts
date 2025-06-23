import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) { }

    // Example method for user login
    async login(username: string, password: string): Promise<any> {
        try {
            // Check if user exists
            let user = await this.userModel.findOne({ username });

            // If user doesn't exist, create a new user
            if (!user) {
                user = await this.userModel.create({
                    username,
                    password, // In production, make sure to hash this password
                    role: 'employee', // Default role for new users
                    createdAt: new Date()
                });
                console.log(`Created new user: ${username}`);
            } else {
                if (user.password !== password) {
                    throw new Error('Invalid credentials');
                }
            }

            // Generate JWT token
            // In a real app, use a proper JWT library
            // const token = 'sample-jwt-token';

            return {
                message: 'Login successful',
                user: {
                    _id: user._id,
                    username: user.username,
                    role: user.role,
                },
            };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
}
