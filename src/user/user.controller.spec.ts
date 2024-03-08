import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

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
      const users = [{ id: 1, name: 'John Doe' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(users);

      expect(await controller.findAll()).toBe(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = { id: 1, name: 'John Doe' };
      jest.spyOn(service, 'findOne').mockResolvedValue(user);

      expect(await controller.findOne('1')).toBe(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.findOne('1')).rejects.toThrowError(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = { name: 'John Doe' };
      const createdUser = { id: 1, name: 'John Doe' };
      jest.spyOn(service, 'create').mockResolvedValue(createdUser);

      expect(await controller.create(createUserDto)).toBe(createdUser);
    });
  });

  describe('update', () => {
    it('should update a user by id', async () => {
      const updateUserDto: UpdateUserDto = { name: 'John Doe' };
      const updatedUser = { id: 1, name: 'John Doe' };
      jest.spyOn(service, 'update').mockResolvedValue(updatedUser);

      expect(await controller.update('1', updateUserDto)).toBe(updatedUser);
    });
  });

  describe('delete', () => {
    it('should delete a user by id', async () => {
      const request = { user: { id: 1, role: 'admin' } };
      jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      await expect(controller.delete('1', request)).resolves.toBeUndefined();
    });

    it('should throw an error if unauthorized access', async () => {
      const request = { user: { id: 2, role: 'user' } };
      jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      await expect(controller.delete('1', request)).rejects.toThrowError('Unauthorized access');
    });
  });
});