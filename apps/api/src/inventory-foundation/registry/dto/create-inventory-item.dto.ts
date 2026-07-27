import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ValuationMethod } from '@prisma/client';

export class CreateInventoryItemDto {
  @ApiPropertyOptional({ example: 't_cuid_123' })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiProperty({ example: 'prod_cuid_123' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiPropertyOptional({ example: 'var_cuid_123' })
  @IsOptional()
  @IsString()
  variantId?: string;

  @ApiProperty({ example: 'INV-SKU-89421' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 'UltraTech Wireless Headphones (Stock Item)' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ enum: ValuationMethod, example: ValuationMethod.AVCO })
  @IsOptional()
  @IsEnum(ValuationMethod)
  valuationMethod?: ValuationMethod;

  // Multi-UOM Conversion Factors
  @ApiPropertyOptional({ example: 'uom_box_cuid' })
  @IsOptional()
  @IsString()
  purchaseUomId?: string;

  @ApiPropertyOptional({ example: 'uom_unit_cuid' })
  @IsOptional()
  @IsString()
  storageUomId?: string;

  @ApiPropertyOptional({ example: 'uom_unit_cuid' })
  @IsOptional()
  @IsString()
  salesUomId?: string;

  @ApiPropertyOptional({ example: 'uom_unit_cuid' })
  @IsOptional()
  @IsString()
  reportingUomId?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  purchaseToStorageFactor?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  salesToStorageFactor?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  reorderPoint?: number;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  reorderQuantity?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  safetyStock?: number;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}
