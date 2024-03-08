import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    required: true,
    description: 'The username of the user',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    minLength: 8,
    required: true,
    description: 'Password must be at least 8 characters',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  deposit: number;

  @ApiProperty({
    required: true,
    description: 'The role of user, buyer or seller',
  })
  @IsNotEmpty()
  @IsString()
  role: string;
}

export class UserDto extends CreateUserDto {
  @ApiProperty()
  id: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
