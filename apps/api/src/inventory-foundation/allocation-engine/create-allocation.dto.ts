import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class AllocateStockDto {
  @ApiProperty({ example: 'inv_item_cuid_123' })
  @IsString()
  @IsNotEmpty()
  inventoryItemId: string;

  @ApiProperty({ example: 'wh_cuid_123' })
  @IsString()
  @IsNotEmpty()
  warehouseId: string;

  @ApiProperty({ example: 25.0 })
  @IsNumber()
  @Min(0.001)
  @IsNotEmpty()
  quantity: number;

  @ApiPropertyOptional({ example: 'AUTO_FIFO' })
  @IsOptional()
  @IsString()
  ruleStrategy?: string;
}
