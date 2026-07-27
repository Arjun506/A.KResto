import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStorageLocationDto {
  @ApiProperty({ example: 'wh_cuid_123' })
  @IsString()
  @IsNotEmpty()
  warehouseId: string;

  @ApiProperty({ example: 'LOC-A1-R2-S3' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Aisle 1, Rack 2, Shelf 3' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Aisle 1' })
  @IsOptional()
  @IsString()
  aisle?: string;

  @ApiPropertyOptional({ example: 'Rack 2' })
  @IsOptional()
  @IsString()
  rack?: string;

  @ApiPropertyOptional({ example: 'Shelf 3' })
  @IsOptional()
  @IsString()
  shelf?: string;

  @ApiPropertyOptional({ example: 'Bin B' })
  @IsOptional()
  @IsString()
  bin?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isColdStorage?: boolean;
}
