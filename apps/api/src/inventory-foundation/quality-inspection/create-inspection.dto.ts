import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateQualityInspectionDto {
  @ApiProperty({ example: 'inv_item_cuid_123' })
  @IsString()
  @IsNotEmpty()
  inventoryItemId: string;

  @ApiPropertyOptional({ example: 'batch_cuid_123' })
  @IsOptional()
  @IsString()
  batchId?: string;

  @ApiPropertyOptional({ example: 'INCOMING' })
  @IsOptional()
  @IsString()
  inspectionType?: string;

  @ApiPropertyOptional({ example: 'PASSED' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'Visual check and seal integrity verified' })
  @IsOptional()
  @IsString()
  notes?: string;
}
