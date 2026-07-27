import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PricingStrategyType } from '@prisma/client';

export class CreatePriceBookDto {
  @ApiPropertyOptional({ example: 't_cuid_123' })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiProperty({ example: 'Standard Retail Price Book' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'PB-RETAIL-STD' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({
    enum: PricingStrategyType,
    example: PricingStrategyType.FIXED_PRICE,
  })
  @IsOptional()
  @IsEnum(PricingStrategyType)
  strategyType?: PricingStrategyType;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}
