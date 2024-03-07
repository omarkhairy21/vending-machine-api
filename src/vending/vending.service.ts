import { Injectable } from '@nestjs/common';

@Injectable()
export class VendingService {
  create() {
    return 'This action adds a new vending';
  }

  findAll() {
    return `This action returns all vending`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vending`;
  }

  update(id: number) {
    return `This action updates a #${id} vending`;
  }

  remove(id: number) {
    return `This action removes a #${id} vending`;
  }
}
