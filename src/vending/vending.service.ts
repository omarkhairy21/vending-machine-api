import { Injectable } from '@nestjs/common';

@Injectable()
export class VendingService {
  calculateChange(amount: number): number[] {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
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
