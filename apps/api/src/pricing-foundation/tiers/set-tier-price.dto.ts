import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class SetTierPriceDto {
  @ApiProperty({ example: 'prod_cuid_123' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  minQuantity: number;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsNumber()
  maxQuantity?: number;

  @ApiProperty({ example: 12.5 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price: number;
}
