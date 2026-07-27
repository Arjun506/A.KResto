import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
} from 'class-validator';

export class RestaurantCheckoutDto {
  @ApiPropertyOptional({ example: 'cust_cuid_123' })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({ example: 'T-10' })
  @IsString()
  @IsNotEmpty()
  tableNumber: string;

  @ApiProperty({ example: [{ dishProductId: 'prod_1', quantity: 2 }] })
  @IsArray()
  @IsNotEmpty()
  items: { dishProductId: string; quantity: number }[];

  @ApiProperty({ example: 25.98 })
  @IsNumber()
  amount: number;
}
