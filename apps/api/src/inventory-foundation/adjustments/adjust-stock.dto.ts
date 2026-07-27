import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AdjustStockDto {
  @ApiProperty({ example: 'inv_item_cuid_123' })
  @IsString()
  @IsNotEmpty()
  inventoryItemId: string;

  @ApiProperty({ example: 'wh_cuid_123' })
  @IsString()
  @IsNotEmpty()
  warehouseId: string;

  @ApiProperty({ example: -5.0 })
  @IsNumber()
  @IsNotEmpty()
  adjustmentQuantity: number;

  @ApiProperty({ example: 'DAMAGED_IN_TRANSIT' })
  @IsString()
  @IsNotEmpty()
  reasonCode: string;

  @ApiPropertyOptional({ example: 'Box dropped during shelf reorganization' })
  @IsOptional()
  @IsString()
  notes?: string;
}
