import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class LinkProductSupplierDto {
  @ApiProperty({ example: 'biz_supplier_cuid' })
  @IsString()
  @IsNotEmpty()
  supplierBusinessId: string;

  @ApiPropertyOptional({ example: 'VEND-PART-8891' })
  @IsOptional()
  @IsString()
  supplierPartNumber?: string;

  @ApiPropertyOptional({ example: 85.5 })
  @IsOptional()
  @IsNumber()
  costPrice?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  moq?: number;

  @ApiPropertyOptional({ example: 7 })
  @IsOptional()
  @IsNumber()
  leadTimeDays?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
