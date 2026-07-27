import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProductIdentityType, ProductLifecycleStage } from '@prisma/client';

export class CreateProductDto {
  @ApiPropertyOptional({ example: 't_cuid_123' })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiPropertyOptional({ example: 'biz_cuid_123' })
  @IsOptional()
  @IsString()
  businessId?: string;

  @ApiProperty({ example: 'SKU-89421' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiPropertyOptional({ example: '012345678905' })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiProperty({ example: 'UltraTech Wireless Headphones' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'ultratech-wireless-headphones' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiPropertyOptional({
    enum: ProductIdentityType,
    example: ProductIdentityType.PHYSICAL,
  })
  @IsOptional()
  @IsEnum(ProductIdentityType)
  identityType?: ProductIdentityType;

  @ApiPropertyOptional({
    enum: ProductLifecycleStage,
    example: ProductLifecycleStage.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ProductLifecycleStage)
  lifecycleStage?: ProductLifecycleStage;

  @ApiPropertyOptional({ example: 'UltraTech' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isTaxable?: boolean;

  // Inventory Readiness Toggles
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  trackInventory?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isBatchManaged?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isSerialized?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isExpiryManaged?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isStockManaged?: boolean;

  // SEO Baseline
  @ApiPropertyOptional({
    example: 'UltraTech Wireless Headphones - Best Noise Cancelling',
  })
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiPropertyOptional({
    example:
      'Buy UltraTech wireless headphones with active noise cancellation.',
  })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}
