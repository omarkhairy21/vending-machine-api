import { Logger, Module } from '@nestjs/common';
import { VendingService } from './vending.service';
import { VendingController } from './vending.controller';
import { UserModule } from '@/user/user.module';
import { ProductModule } from '@/product/product.module';

@Module({
  imports: [UserModule, ProductModule],
  controllers: [VendingController],
  providers: [VendingService, Logger],
})
export class VendingModule {}
