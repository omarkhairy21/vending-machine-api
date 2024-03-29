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
import { CustomRequest } from '@/types';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '@/auth/role.guard';
import { Roles } from '@/decorators/roles.decorator';

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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('seller')
  @ApiBearerAuth('JWT')
  async create(
    @Body() product: CreateProductDto,
    @Req() request: CustomRequest,
  ): Promise<Product> {
    const user = request.user;
    product.sellerId = user.id;
    return await this.productService.create(product);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('seller')
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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('seller')
  async delete(
    @Param('id') id: string,
    @Req() request: CustomRequest,
  ): Promise<void> {
    const user = request.user;
    await this.productService.delete(parseInt(id), user.id);
  }
}
