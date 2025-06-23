import { Controller, Post, Req } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    @Post('/login')
    login(@Req() req) {
        const { username, password } = req.body;
        if (!username || !password) {
            return JSON.stringify({
                code: 400,
                message: "Username and password are required",
            });
        }


        
    }
    @Post('/register')
    register() {
        return JSON.stringify({
            code: 201,
            message: "Feature not implemented yet",
        });
    }
}
