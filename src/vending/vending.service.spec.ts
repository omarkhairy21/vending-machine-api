import { Test, TestingModule } from '@nestjs/testing';
import { VendingService } from './vending.service';

describe('VendingService', () => {
  let service: VendingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VendingService],
    }).compile();

    service = module.get<VendingService>(VendingService);
  });

  describe('calculateChange', () => {
    it('should return correct change for amount 185', () => {
      const change = service.calculateChange(185);
      expect(change).toEqual([100, 50, 20, 10, 5]);
    });

    it('should return correct change for amount 75', () => {
      const change = service.calculateChange(75);
      expect(change).toEqual([50, 20, 5]);
    });

    it('should return correct change for amount 30', () => {
      const change = service.calculateChange(30);
      expect(change).toEqual([20, 10]);
    });

    it('should return correct change for amount 0', () => {
      const change = service.calculateChange(0);
      expect(change).toEqual([]);
    });

    it('should return correct change for amount 5', () => {
      const change = service.calculateChange(5);
      expect(change).toEqual([5]);
    });

    it('should throw an error for negative amount', () => {
      expect(() => service.calculateChange(-5)).toThrow();
    });
  });
});
