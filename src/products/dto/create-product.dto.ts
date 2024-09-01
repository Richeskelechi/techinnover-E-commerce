import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Laptop', description: 'The name of the product' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 999.99, description: 'The price of the product' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  price: number;

  @ApiProperty({ example: 'A high-end laptop with powerful specifications.', description: 'A brief description of the product' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 10, description: 'The quantity of the product available' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}
