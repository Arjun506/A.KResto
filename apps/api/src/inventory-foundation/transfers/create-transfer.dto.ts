import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTransferDto {
  @ApiProperty({ example: 'TR-2026-0019' })
  @IsString()
  @IsNotEmpty()
  transferNumber: string;

  @ApiProperty({ example: 'wh_source_cuid' })
  @IsString()
  @IsNotEmpty()
  sourceWarehouseId: string;

  @ApiProperty({ example: 'wh_target_cuid' })
  @IsString()
  @IsNotEmpty()
  targetWarehouseId: string;

  @ApiPropertyOptional({ example: 'PENDING' })
  @IsOptional()
  @IsString()
  status?: string;
}
