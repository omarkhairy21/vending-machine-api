import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { UserService } from '@/user/user.service';
import { User } from '@/user/entities/user.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly userService: UserService,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({ relations: ['seller'] });
  }

  async findOne(id: number): Promise<Product> {
    return await this.productRepository.findOne({
      where: { id },
      relations: ['seller'],
    });
  }

  async create(product: CreateProductDto): Promise<Product> {
    const seller = await this.userService.findOne(product.sellerId);
    if (!seller) {
      throw new Error('Seller not found');
    }
    product.sellerId = seller.id;
    return await this.productRepository.save(product);
  }

  async update(id: number, product: Product): Promise<Product> {
    await this.productRepository.update(id, product);
    return await this.productRepository.findOne({
      where: { id },
      relations: ['seller'],
    });
  }

  async delete(id: number, userId: User['id']): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['seller'],
    });

    if (product.seller.id !== userId) {
      throw new Error('Unauthorized access');
    }

    await this.productRepository.delete(id);
  }
}
