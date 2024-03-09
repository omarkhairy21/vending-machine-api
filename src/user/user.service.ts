import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<UserDto[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<UserDto> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findOneByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({ where: { username } });
  }

  async create(user: CreateUserDto): Promise<User> {
    return await this.userRepository.save(user);
  }

  async update(
    id: number,
    userPropsToUpdates: UpdateUserDto,
  ): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new Error('User not found');
    await this.userRepository.update(id, userPropsToUpdates);
    return { ...user, ...userPropsToUpdates };
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
