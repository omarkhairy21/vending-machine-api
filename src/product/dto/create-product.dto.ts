import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'The name of the product' })
  @IsNotEmpty()
  @IsString()
  productName: string;

  @ApiProperty({ description: 'The cost of the product' })
  @IsNotEmpty()
  @IsNumber()
  cost: number;

  @ApiProperty({ description: 'The amount available of the product' })
  @IsNotEmpty()
  @IsNumber()
  amountAvailable: number;

  @ApiProperty({ description: 'The ID of the seller' })
  @IsNotEmpty()
  @IsNumber()
  sellerId: number;
}
