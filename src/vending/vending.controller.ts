import { Controller, Post, Put, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Controller('vending')
export class VendingController {
  constructor(
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}

  @Post('deposit/:amount')
  async deposit(@Param('amount') amount: string, @Req() req): Promise<User> {
    const user = req.user;
    const validCoins = [5, 10, 20, 50, 100];
    if (!validCoins.includes(parseInt(amount))) {
      throw new Error('Invalid coin amount');
    }
    user.deposit += parseInt(amount);
    await this.userService.update(user.id, user);
    return user;
  }

  @Post('buy/:productId/:amount')
  @UseGuards(AuthGuard('local')) // Only buyer can buy
  async buy(
    @Param('productId') productId: string,
    @Param('amount') amount: string,
    @CurrentUser() user: User,
  ): Promise<{ totalSpent: number; purchased: Product[]; change: number[] }> {
    const product = await this.productService.findOne(parseInt(productId));
    const productCost = product.cost * parseInt(amount);

    if (productCost > user.deposit) {
      throw new Error('Insufficient funds');
    }

    if (product.amountAvailable < parseInt(amount)) {
      throw new Error('Not enough products available');
    }

    // Update product and user
    product.amountAvailable -= parseInt(amount);
    user.deposit -= productCost;
    await this.productService.update(product.id, product);
    await this.userService.update(user.id, user);

    // Calculate and return change
    const change = this.calculateChange(user.deposit);
    user.deposit = 0;
    await this.userService.update(user.id, user);

    return {
      totalSpent: productCost,
      purchased: [product],
      change,
    };
  }

  @Put('reset')
  @UseGuards(AuthGuard('local')) // Only buyer can reset
  async reset(@CurrentUser() user: User): Promise<User> {
    user.deposit = 0;
    await this.userService.update(user.id, user);
    return user;
  }

  // Helper function to calculate change
  private calculateChange(amount: number): number[] {
    const coins = [100, 50, 20, 10, 5];
    const change = [];
    for (const coin of coins) {
      while (amount >= coin) {
        amount -= coin;
        change.push(coin);
      }
    }
    return change;
  }
}