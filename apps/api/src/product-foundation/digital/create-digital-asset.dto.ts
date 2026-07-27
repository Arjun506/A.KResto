import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDigitalAssetDto {
  @ApiProperty({ example: 'digital-products/software-v1.0.zip' })
  @IsString()
  @IsNotEmpty()
  fileKey: string;

  @ApiProperty({ example: '/downloads/software-v1.0.zip' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  downloadLimit?: number;

  @ApiPropertyOptional({ example: 365 })
  @IsOptional()
  @IsNumber()
  expiryDays?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  requiresLicenseKey?: boolean;
}
