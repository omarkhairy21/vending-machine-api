import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '@/types';
import { User } from '@/user/entities/user.entity';
import { UserService } from '@/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string): Promise<User | null> {
    // find the user in your database
    const user = await this.userService.findOneByUsername(username);
    if (!user) return null;
    // compare the provided password with the stored password
    if (user.password === password) return user;
    return null;
  }

  // validate the user from the JWT token
  async validateUserFromJwt(payload: TokenPayload): Promise<User | null> {
    const user = await this.userService.findOneByUsername(payload.username);
    if (!user) return null;
    return user;
  }

  // generate the JWT token
  generateJwtToken(user: User): string {
    const payload: TokenPayload = {
      username: user.username,
      userId: user.id,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }
}
