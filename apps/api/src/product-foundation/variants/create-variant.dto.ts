import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductVariantDto {
  @ApiProperty({ example: 'SKU-89421-BLK-L' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiPropertyOptional({ example: '012345678906' })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiProperty({ example: 'UltraTech Headphones - Black / Large' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: { color: 'Black', size: 'Large' } })
  @IsNotEmpty()
  optionCombination: Record<string, any>;

  @ApiPropertyOptional({ example: 10.0 })
  @IsOptional()
  @IsNumber()
  priceAdjustment?: number;

  @ApiPropertyOptional({ example: 0.35 })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
