import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PriceType } from '@prisma/client';

export class SetProductPriceDto {
  @ApiPropertyOptional({ example: 'var_cuid_123' })
  @IsOptional()
  @IsString()
  variantId?: string;

  @ApiProperty({ enum: PriceType, example: PriceType.BASE })
  @IsEnum(PriceType)
  @IsNotEmpty()
  priceType: PriceType;

  @ApiProperty({ example: 'USD' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ example: 149.99 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  minQuantity?: number;

  // Pricing Readiness Overrides
  @ApiPropertyOptional({ example: 'cust_vip_cuid' })
  @IsOptional()
  @IsString()
  targetCustomerId?: string;

  @ApiPropertyOptional({ example: 'biz_partner_cuid' })
  @IsOptional()
  @IsString()
  targetBusinessId?: string;

  @ApiPropertyOptional({ example: 'US_WEST' })
  @IsOptional()
  @IsString()
  regionCode?: string;

  @ApiPropertyOptional({ example: 'B2B_PORTAL' })
  @IsOptional()
  @IsString()
  channelCode?: string;
}
