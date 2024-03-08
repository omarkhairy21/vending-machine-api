import {
  Controller,
  Post,
  UseGuards,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // login
  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          example: 'user1',
        },
        password: {
          type: 'string',
          example: 'password',
        },
      },
    },
  })
  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Req() req) {
    const user = req.user;
    if (!user) {
      throw new NotFoundException('User not found');
    }
    //  generate the JWT token
    const token = this.authService.generateJwtToken(user);
    return { token };
  }
}
