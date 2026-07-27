import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class SetReorderRuleDto {
  @ApiProperty({ example: 'inv_item_cuid_123' })
  @IsString()
  @IsNotEmpty()
  inventoryItemId: string;

  @ApiProperty({ example: 15 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  reorderPoint: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  reorderQuantity: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  safetyStock: number;
}
