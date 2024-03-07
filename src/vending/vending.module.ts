import { Module } from '@nestjs/common';
import { VendingService } from './vending.service';
import { VendingController } from './vending.controller';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [UserModule, ProductModule],
  controllers: [VendingController],
  providers: [VendingService],
})
export class VendingModule {}
