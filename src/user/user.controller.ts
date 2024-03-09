import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  UseGuards,
  NotFoundException,
  Logger,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto, UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/user.dto';
import { CurrentUser } from '@/decorators/currentUser.decorator';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {}

  @Get()
  async findAll(): Promise<UserDto[]> {
    const users = await this.userService.findAll();
    this.logger.log('Fetching all users', JSON.stringify(users));
    return users;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserDto> {
    this.logger.log('Fetching user with id: ' + id);
    const user = await this.userService.findOne(parseInt(id));
    this.logger.log('User found: ' + JSON.stringify(user));
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Post()
  async create(@Body() user: CreateUserDto): Promise<User> {
    return await this.userService.create(user);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<UserDto> {
    this.logger.log('Updating user with id: ' + id);
    const updatedUser = this.userService.update(parseInt(id), user);
    this.logger.log('User updated: ' + updatedUser);
    return updatedUser;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: UserDto,
  ): Promise<void> {
    this.logger.log('Deleting user with id: ' + id);
    if (user.id !== parseInt(id)) {
      throw new HttpException('Unauthorized access', 401);
    }
    await this.userService.delete(parseInt(id));
  }
}
