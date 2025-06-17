import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'The title of the product' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'The price of the product' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ description: 'The description of the product' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'The category of the product' })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({ description: 'The image URL of the product' })
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  image: string;

  @ApiProperty({
    description: 'The stock quantity of the product',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  stock?: number;
}

export class UpdateStockDto {
  @ApiProperty({ description: 'The new stock quantity' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  stock: number;
}

export class ProductResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
