import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { CustomRequest } from 'src/types';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findOne(parseInt(id));
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
  ): Promise<User> {
    return await this.userService.update(parseInt(id), user);
  }

  @Delete(':id')
  // @UseGuards(AuthGuard)
  async delete(
    @Param('id') id: string,
    @Req() request: CustomRequest,
  ): Promise<void> {
    const user = request.user;
    // Check if the deleting user is the same user or an admin
    if (user.role !== 'admin' && user.id !== parseInt(id)) {
      throw new Error('Unauthorized access');
    }
    await this.userService.delete(parseInt(id));
  }
}
