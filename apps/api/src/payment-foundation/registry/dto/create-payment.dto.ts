import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PaymentMethodType } from '@prisma/client';

export class CreatePaymentTransactionDto {
  @ApiPropertyOptional({ example: 't_cuid_123' })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiPropertyOptional({ example: 'order_cuid_123' })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiPropertyOptional({ example: 'biz_cuid_123' })
  @IsOptional()
  @IsString()
  businessId?: string;

  @ApiPropertyOptional({ example: 'cust_cuid_123' })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({ example: 'PMT-2026-901290' })
  @IsString()
  @IsNotEmpty()
  paymentNumber: string;

  @ApiProperty({
    enum: PaymentMethodType,
    example: PaymentMethodType.CREDIT_CARD,
  })
  @IsEnum(PaymentMethodType)
  @IsNotEmpty()
  methodType: PaymentMethodType;

  @ApiPropertyOptional({ example: 'prov_stripe_123' })
  @IsOptional()
  @IsString()
  providerId?: string;

  @ApiPropertyOptional({ example: 'STRIPE' })
  @IsOptional()
  @IsString()
  gatewayName?: string;

  @ApiPropertyOptional({ example: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ example: 150.0 })
  @IsNumber()
  @Min(0.01)
  @IsNotEmpty()
  amount: number;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}
