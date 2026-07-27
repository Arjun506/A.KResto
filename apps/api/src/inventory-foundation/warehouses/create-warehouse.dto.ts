import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { WarehouseType } from '@prisma/client';

export class CreateWarehouseDto {
  @ApiPropertyOptional({ example: 't_cuid_123' })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiPropertyOptional({ example: 'biz_cuid_123' })
  @IsOptional()
  @IsString()
  businessId?: string;

  @ApiProperty({ example: 'WH-MAIN-01' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Central Fulfillment Hub' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    enum: WarehouseType,
    example: WarehouseType.MAIN_WAREHOUSE,
  })
  @IsOptional()
  @IsEnum(WarehouseType)
  type?: WarehouseType;

  // Warehouse Hierarchy
  @ApiPropertyOptional({ example: 'NORTH_AMERICA' })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({ example: 'ZONE_EAST' })
  @IsOptional()
  @IsString()
  zone?: string;

  @ApiPropertyOptional({ example: 'TECH_PARK_CAMPUS' })
  @IsOptional()
  @IsString()
  campus?: string;

  @ApiPropertyOptional({ example: 'BUILDING_B' })
  @IsOptional()
  @IsString()
  building?: string;

  @ApiPropertyOptional({ example: 'FLOOR_2' })
  @IsOptional()
  @IsString()
  floor?: string;

  @ApiPropertyOptional({ example: 'ROOM_204' })
  @IsOptional()
  @IsString()
  room?: string;

  @ApiPropertyOptional({ example: '100 Logistics Blvd' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Austin' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'USA' })
  @IsOptional()
  @IsString()
  country?: string;
}
