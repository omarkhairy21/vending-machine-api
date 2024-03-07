import { Test, TestingModule } from '@nestjs/testing';
import { VendingController } from './vending.controller';
import { VendingService } from './vending.service';

describe('VendingController', () => {
  let controller: VendingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendingController],
      providers: [VendingService],
    }).compile();

    controller = module.get<VendingController>(VendingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
