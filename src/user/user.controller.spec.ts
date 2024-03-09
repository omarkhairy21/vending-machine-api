import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserDto } from './dto/user.dto';
import { Logger } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
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
      providers: [
        UserService,
        {
          provide: 'UserRepository',
          useValue: {
            find: jest.fn().mockResolvedValue(loadedUsers),
            findOne: jest.fn().mockResolvedValue(loadedUsers[0]),
            save: jest.fn().mockResolvedValue(loadedUsers[0]),
            update: jest
              .fn()
              .mockResolvedValue({ ...loadedUsers[0], deposit: 200 }),
          },
        },
        Logger,
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      expect(await controller.findAll()).toBe(loadedUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      expect(await controller.findOne('1')).toBe(loadedUsers[0]);
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

      expect(await controller.create(createUserDto)).toBe(loadedUsers[0]);
    });
  });

  describe('update', () => {
    it('should update a user by id', async () => {
      const updateUserDto: UpdateUserDto = { deposit: 200 };
      const updatedUser: UserDto = { ...loadedUsers[0], ...updateUserDto };
      expect(await controller.update('1', updateUserDto)).toEqual(updatedUser);
    });
  });
});
