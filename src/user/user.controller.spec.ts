import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  const loadedUsers: UserDto[] = [
    {
      id: 1,
      username: 'JohnDoe',
      deposit: 100,
      role: 'buyer',
      password: 'password',
    },
  ];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue(loadedUsers);

      expect(await controller.findAll()).toBe(loadedUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(loadedUsers[0]);

      expect(await controller.findOne('1')).toBe(loadedUsers[0]);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.findOne('1')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'JohnDoe',
        password: 'password',
        deposit: 100,
        role: 'buyer',
      };

      jest.spyOn(service, 'create').mockResolvedValue(createUserDto as User);

      expect(await controller.create(createUserDto)).toBe(loadedUsers[0]);
    });
  });

  describe('update', () => {
    it('should update a user by id', async () => {
      const updateUserDto: UpdateUserDto = { deposit: 200 };
      const updatedUser = {
        id: 1,
        username: 'John Doe',
        deposit: 200,
        role: 'buyer',
        password: 'password',
      };
      jest.spyOn(service, 'update').mockResolvedValue(updatedUser);

      expect(await controller.update('1', updateUserDto)).toBe(updatedUser);
    });
  });
});
