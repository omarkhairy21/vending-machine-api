import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@/user/entities/user.entity';

type UserRecord = keyof User;

export const CurrentUser = createParamDecorator(
  (data: UserRecord, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.user[data] : request.user;
  },
);
