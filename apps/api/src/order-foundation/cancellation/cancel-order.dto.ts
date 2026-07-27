import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CancelOrderDto {
  @ApiProperty({ example: 'CUSTOMER_CHANGE_MIND' })
  @IsString()
  @IsNotEmpty()
  reasonCode: string;

  @ApiPropertyOptional({
    example: 'Customer requested cancellation prior to shipment',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
