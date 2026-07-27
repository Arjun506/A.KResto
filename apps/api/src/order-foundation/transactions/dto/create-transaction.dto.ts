import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateTransactionRecordDto {
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

  @ApiProperty({ example: 'TX-2026-88190' })
  @IsString()
  @IsNotEmpty()
  transactionNumber: string;

  @ApiProperty({
    example: 'QUOTE',
    description:
      'QUOTE, ESTIMATE, RESERVATION, BOOKING, SUBSCRIPTION, INVOICE, CREDIT_NOTE, DEBIT_NOTE, ADJUSTMENT, SERVICE_TICKET, ORDER',
  })
  @IsString()
  @IsNotEmpty()
  transactionType: string;

  @ApiProperty({ example: 450.0 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount: number;

  @ApiPropertyOptional({ example: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: 'CREDIT_CARD' })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiPropertyOptional({ example: 'REF-881290' })
  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}
