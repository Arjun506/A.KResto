import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({ example: 'inv_item_cuid_123' })
  @IsString()
  @IsNotEmpty()
  inventoryItemId: string;

  @ApiProperty({ example: 'wh_cuid_123' })
  @IsString()
  @IsNotEmpty()
  warehouseId: string;

  @ApiProperty({ example: 10.0 })
  @IsNumber()
  @Min(0.001)
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ example: 'ORDER' })
  @IsString()
  @IsNotEmpty()
  reservedForType: string;

  @ApiProperty({ example: 'ORD-99120' })
  @IsString()
  @IsNotEmpty()
  reservedForId: string;

  @ApiPropertyOptional({ example: '2026-08-01T00:00:00Z' })
  @IsOptional()
  @IsString()
  expiresAt?: string;
}
