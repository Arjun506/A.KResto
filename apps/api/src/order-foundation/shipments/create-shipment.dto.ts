import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateShipmentDto {
  @ApiProperty({ example: 'SHP-2026-0912' })
  @IsString()
  @IsNotEmpty()
  shipmentNumber: string;

  @ApiPropertyOptional({ example: 'CARRIER_FEDEX' })
  @IsOptional()
  @IsString()
  carrierCode?: string;

  @ApiPropertyOptional({ example: 'SHIPPED' })
  @IsOptional()
  @IsString()
  status?: string;
}
