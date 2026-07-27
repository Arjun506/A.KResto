import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePaymentProviderDto {
  @ApiPropertyOptional({ example: 't_cuid_123' })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiProperty({ example: 'Stripe Merchant Gateway' })
  @IsString()
  @IsNotEmpty()
  providerName: string;

  @ApiProperty({ example: 'STRIPE' })
  @IsString()
  @IsNotEmpty()
  providerCode: string;

  @ApiProperty({ example: { apiKey: 'sk_test_123' } })
  @IsNotEmpty()
  credentials: Record<string, any>;
}
