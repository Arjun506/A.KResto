import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateBatchDto {
  @ApiProperty({ example: 'inv_item_cuid_123' })
  @IsString()
  @IsNotEmpty()
  inventoryItemId: string;

  @ApiProperty({ example: 'BATCH-2026-001' })
  @IsString()
  @IsNotEmpty()
  batchNumber: string;

  @ApiPropertyOptional({ example: 'SUPP-LOT-8821' })
  @IsOptional()
  @IsString()
  supplierBatchNo?: string;

  @ApiPropertyOptional({ example: '2026-01-01T00:00:00Z' })
  @IsOptional()
  @IsString()
  manufacturedAt?: string;

  @ApiPropertyOptional({ example: '2027-01-01T00:00:00Z' })
  @IsOptional()
  @IsString()
  expiresAt?: string;

  @ApiPropertyOptional({ example: 100.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantityOnHand?: number;
}
