import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AssignSerialDto {
  @ApiProperty({ example: 'inv_item_cuid_123' })
  @IsString()
  @IsNotEmpty()
  inventoryItemId: string;

  @ApiProperty({ example: 'SN-9988112233' })
  @IsString()
  @IsNotEmpty()
  serialNumber: string;

  @ApiPropertyOptional({ example: 'wh_cuid_123' })
  @IsOptional()
  @IsString()
  warehouseId?: string;

  @ApiPropertyOptional({ example: 'loc_cuid_123' })
  @IsOptional()
  @IsString()
  locationId?: string;
}
