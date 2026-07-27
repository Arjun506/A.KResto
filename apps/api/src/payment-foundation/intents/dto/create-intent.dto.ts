import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePaymentIntentDto {
  @ApiPropertyOptional({ example: 't_cuid_123' })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiPropertyOptional({ example: 'order_cuid_123' })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiProperty({ example: 'INT-2026-081290' })
  @IsString()
  @IsNotEmpty()
  intentNumber: string;

  @ApiProperty({ example: 250.0 })
  @IsNumber()
  @Min(0.01)
  @IsNotEmpty()
  amount: number;

  @ApiPropertyOptional({ example: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: 'IDEM-KEY-991208' })
  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}
