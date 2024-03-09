import {
  Controller,
  Post,
  Put,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '@/decorators/currentUser.decorator';
import { Product } from '@/product/entities/product.entity';
import { ProductService } from '@/product/product.service';
import { User } from '@/user/entities/user.entity';
import { UserService } from '@/user/user.service';
import { VendingService } from './vending.service';
import { Roles } from '@/decorators/roles.decorator';
import { RolesGuard } from '@/auth/role.guard';

@Controller('vending')
export class VendingController {
  constructor(
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly vendingService: VendingService,
    private readonly logger: Logger,
  ) {}

  @Post('deposit/:amount')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('buyer')
  async deposit(
    @Param('amount') amount: string,
    @CurrentUser() user,
  ): Promise<User> {
    this.logger.log('Depositing ' + amount + ' for user: ' + user.id);

    const validCoins = [5, 10, 20, 50, 100];
    if (!validCoins.includes(parseInt(amount))) {
      throw new HttpException('Invalid coin', HttpStatus.BAD_REQUEST);
    }
    user.deposit += parseInt(amount);
    await this.userService.update(user.id, user);
    this.logger.log('User deposit updated: ' + JSON.stringify(user));
    return user;
  }

  @Post('buy/:productId/:amount')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('buyer')
  async buy(
    @Param('productId') productId: string,
    @Param('amount') amount: string,
    @CurrentUser() user: User,
  ): Promise<{ totalSpent: number; purchased: Product[]; change: number[] }> {
    this.logger.log(
      'Buying ' +
        amount +
        ' of product with id: ' +
        productId +
        ' for user: ' +
        user.id,
    );
    const product = await this.productService.findOne(parseInt(productId));
    const totalProductCost = product.cost * parseInt(amount);
    this.logger.log('Total product cost: ' + totalProductCost);

    if (totalProductCost > user.deposit) {
      this.logger.error('Insufficient funds');
      throw new HttpException('Insufficient funds', HttpStatus.BAD_REQUEST);
    }

    if (product.amountAvailable < parseInt(amount)) {
      this.logger.error('Insufficient stock');
      throw new HttpException('Insufficient stock', HttpStatus.BAD_REQUEST);
    }

    // Update product and user
    product.amountAvailable -= parseInt(amount);
    user.deposit -= totalProductCost;

    await this.productService.update(product.id, product);
    await this.userService.update(user.id, user);

    // Calculate and return change
    const change = this.vendingService.calculateChange(user.deposit);
    this.logger.log('Change: ' + change);
    return {
      totalSpent: totalProductCost,
      purchased: [product],
      change,
    };
  }

  @Put('reset')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('buyer')
  async reset(@CurrentUser() user: User): Promise<User> {
    user.deposit = 0;
    await this.userService.update(user.id, user);
    this.logger.log('User deposit reset: ' + JSON.stringify(user));
    return user;
  }
}
