import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class SetCustomerPriceDto {
  @ApiProperty({ example: 'cust_vip_cuid' })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ example: 'prod_cuid_123' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 89.99 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  customPrice: number;

  @ApiPropertyOptional({ example: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;
}

export class SetBusinessPriceDto {
  @ApiProperty({ example: 'biz_partner_cuid' })
  @IsString()
  @IsNotEmpty()
  businessId: string;

  @ApiProperty({ example: 'prod_cuid_123' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 75.0 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  contractPrice: number;

  @ApiPropertyOptional({ example: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;
}
