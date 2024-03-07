import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async validateUser(username: string, password: string): Promise<User | null> {
    // find the user in your database
    const user = await this.userService.findOneByUsername(username);
    if (!user) return null;
    // compare the provided password with the stored password
    if (user.password === password) return user;
    return null;
  }
}
