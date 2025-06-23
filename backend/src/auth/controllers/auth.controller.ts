import { Controller, Inject, Injectable, Post, Req } from '@nestjs/common';
import { AuthService } from '../services/auth.service'; // Adjust the import path as necessary

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService, // Replace 'any' with the actual type if available
    ) { }

    @Post('/login')
    login(@Req() req) {
        const { username, password } = req.body;
        if (!username || !password) {
            return JSON.stringify({
                code: 400,
                message: "Username and password are required",
            });
        }

        return this.authService.login(username, password);

    }
    @Post('/register')
    register() {
        return JSON.stringify({
            code: 201,
            message: "Feature not implemented yet",
        });
    }
}
