import { Test, TestingModule } from '@nestjs/testing';
import { VendingController } from './vending.controller';
import { VendingService } from './vending.service';
import { UserService } from '@/user/user.service';
import { ProductService } from '@/product/product.service';
import { User } from '@/user/entities/user.entity';
import { Product } from '@/product/entities/product.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('VendingController', () => {
  let controller: VendingController;
  let userService: UserService;
  let productService: ProductService;
  let vendingService: VendingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendingController],
      providers: [VendingService, UserService, ProductService],
    }).compile();

    controller = module.get<VendingController>(VendingController);
    userService = module.get<UserService>(UserService);
    productService = module.get<ProductService>(ProductService);
    vendingService = module.get<VendingService>(VendingService);
  });

  describe('deposit', () => {
    it('should deposit the specified amount for the user', async () => {
      const amount = '10';
      const user = { id: 1, deposit: 0 };
      jest.spyOn(userService, 'update').mockResolvedValue(user as User);

      const result = await controller.deposit(amount, user);

      expect(userService.update).toHaveBeenCalledWith(user.id, user);
      expect(result).toEqual(user);
      expect(user.deposit).toBe(parseInt(amount));
    });

    it('should throw an error for invalid coin amount', async () => {
      const amount = '30';
      const user = { id: 1, deposit: 0 };

      await expect(
        controller.deposit(amount, user as User),
      ).rejects.toThrowError(
        new HttpException('Invalid coin', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('buy', () => {
    it('should buy the specified amount of product for the user', async () => {
      const productId = '1';
      const amount = '2';
      const user = { id: 1, deposit: 100 };
      const product = {
        id: 1,
        productName: 'Product 1',
        cost: 50,
        amountAvailable: 5,
      };
      const change = [50];

      jest
        .spyOn(productService, 'findOne')
        .mockResolvedValue(product as Product);
      jest
        .spyOn(productService, 'update')
        .mockResolvedValue(product as Product);
      jest.spyOn(userService, 'update').mockResolvedValue(user as User);
      jest.spyOn(vendingService, 'calculateChange').mockReturnValue(change);

      const result = await controller.buy(productId, amount, user as User);

      expect(productService.findOne).toHaveBeenCalledWith(parseInt(productId));
      expect(productService.update).toHaveBeenCalledWith(product.id, product);
      expect(userService.update).toHaveBeenCalledWith(user.id, user);
      expect(vendingService.calculateChange).toHaveBeenCalledWith(user.deposit);
      expect(result).toEqual({
        totalSpent: product.cost * parseInt(amount),
        purchased: [product],
        change,
      });
    });

    it('should throw an error for insufficient funds', async () => {
      const productId = '1';
      const amount = '2';
      const user = { id: 1, deposit: 50 };
      const product = {
        id: 1,
        productName: 'Product 1',
        cost: 100,
        amountAvailable: 5,
      };

      jest
        .spyOn(productService, 'findOne')
        .mockResolvedValue(product as Product);

      await expect(
        controller.buy(productId, amount, user as User),
      ).rejects.toThrowError(
        new HttpException('Insufficient funds', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw an error for insufficient stock', async () => {
      const productId = '1';
      const amount = '10';
      const user = { id: 1, deposit: 100 };
      const product = {
        id: 1,
        productName: 'Product 1',
        cost: 50,
        amountAvailable: 5,
      };

      jest
        .spyOn(productService, 'findOne')
        .mockResolvedValue(product as Product);

      await expect(
        controller.buy(productId, amount, user as User),
      ).rejects.toThrowError(
        new HttpException('Insufficient stock', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('reset', () => {
    it('should reset the deposit amount for the user', async () => {
      const user = { id: 1, deposit: 100 };
      jest.spyOn(userService, 'update').mockResolvedValue(user as User);

      const result = await controller.reset(user as User);

      expect(userService.update).toHaveBeenCalledWith(user.id, user);
      expect(result).toEqual(user);
      expect(user.deposit).toBe(0);
    });
  });
});
