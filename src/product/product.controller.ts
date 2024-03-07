import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { CustomRequest } from 'src/types';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(): Promise<Product[]> {
    return await this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return await this.productService.findOne(parseInt(id));
  }

  @Post()
  // @UseGuards(AuthGuard) // Only seller can create products
  async create(
    @Body() product: Product,
    @Req() request: CustomRequest,
  ): Promise<Product> {
    const user = request.user;
    product.sellerId = user.id;
    return await this.productService.create(product);
  }

  @Put(':id')
  // @UseGuards(AuthGuard) // Only seller can update products
  async update(
    @Param('id') id: string,
    @Body() product: Product,
    @Req() request: CustomRequest,
  ): Promise<Product> {
    const user = request.user;
    const currentProduct = await this.productService.findOne(parseInt(id));
    if (currentProduct.sellerId !== user.id) {
      throw new Error('Unauthorized access');
    }
    return await this.productService.update(parseInt(id), product);
  }

  @Delete(':id')
  // @UseGuards(AuthGuard) // Only seller can delete products
  async delete(
    @Param('id') id: string,
    @Req() request: CustomRequest,
  ): Promise<void> {
    const user = request.user;
    await this.productService.delete(parseInt(id), user.id);
  }
}
