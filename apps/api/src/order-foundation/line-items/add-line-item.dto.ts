import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class AddLineItemDto {
  @ApiProperty({ example: 'prod_cuid_123' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiPropertyOptional({ example: 'var_cuid_123' })
  @IsOptional()
  @IsString()
  variantId?: string;

  @ApiPropertyOptional({ example: 'inv_item_cuid_123' })
  @IsOptional()
  @IsString()
  inventoryItemId?: string;

  @ApiProperty({ example: 'SKU-CASE-01' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 'Protective Leather Case' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1.0 })
  @IsNumber()
  @Min(0.001)
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ example: 49.99 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  unitPrice: number;

  @ApiPropertyOptional({ example: 5.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;

  @ApiPropertyOptional({ example: 3.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxAmount?: number;
}
