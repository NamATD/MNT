// common/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request as HttpRequest } from 'express';

export interface JwtPayload {
  _id: string;
  role: string;
}

type AuthRequest = HttpRequest & { user: JwtPayload };

export const Auth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request: AuthRequest = ctx.switchToHttp().getRequest();
    const { _id, role } = request.user;
    return { _id, role };
  },
);
