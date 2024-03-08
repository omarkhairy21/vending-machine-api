import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: User[] = [/* create some test users here */];
      jest.spyOn(userRepository, 'find').mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user: User = /* create a test user here */;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(result).toEqual(user);
    });
  });

  describe('findOneByUsername', () => {
    it('should return a user by username', async () => {
      const user: User = /* create a test user here */;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await service.findOneByUsername('username');

      expect(result).toEqual(user);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = /* create a test CreateUserDto here */;
      const createdUser: User = /* create a test user here */;
      jest.spyOn(userRepository, 'save').mockResolvedValue(createdUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(createdUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = /* create a test UpdateUserDto here */;
      const updatedUser: User = /* create a test user here */;
      jest.spyOn(userRepository, 'update').mockResolvedValue(undefined);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(updatedUser);

      const result = await service.update(1, updateUserDto);

      expect(result).toEqual(updatedUser);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      jest.spyOn(userRepository, 'delete').mockResolvedValue(undefined);

      await service.delete(1);

      expect(userRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});