import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderType, FulfillmentType } from '@prisma/client';

export class CreateOrderItemDto {
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

  @ApiProperty({ example: 'SKU-HEADSET-01' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 'Wireless Noise Cancelling Headset' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 2.0 })
  @IsNumber()
  @Min(0.001)
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ example: 199.99 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  unitPrice: number;

  @ApiPropertyOptional({ example: 10.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;

  @ApiPropertyOptional({ example: 15.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxAmount?: number;
}

export class CreateOrderDto {
  @ApiPropertyOptional({ example: 't_cuid_123' })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiPropertyOptional({ example: 'biz_cuid_123' })
  @IsOptional()
  @IsString()
  businessId?: string;

  @ApiPropertyOptional({ example: 'cust_cuid_123' })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({ example: 'ORD-2026-90412' })
  @IsString()
  @IsNotEmpty()
  orderNumber: string;

  @ApiPropertyOptional({ enum: OrderType, example: OrderType.SALES_ORDER })
  @IsOptional()
  @IsEnum(OrderType)
  type?: OrderType;

  @ApiPropertyOptional({ example: 'POS' })
  @IsOptional()
  @IsString()
  channelCode?: string;

  @ApiPropertyOptional({ example: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({
    enum: FulfillmentType,
    example: FulfillmentType.DELIVERY,
  })
  @IsOptional()
  @IsEnum(FulfillmentType)
  fulfillmentType?: FulfillmentType;

  @ApiPropertyOptional({ example: 'wh_cuid_123' })
  @IsOptional()
  @IsString()
  fulfillmentWarehouseId?: string;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  lineItems: CreateOrderItemDto[];

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}
