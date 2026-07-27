import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBusinessDto {
  @ApiProperty({ example: 'org_cuid_123' })
  @IsString()
  @IsNotEmpty()
  organizationId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiProperty({ example: 'Apex Logistics Inc.' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Apex Logistics Incorporated' })
  @IsOptional()
  @IsString()
  legalName?: string;

  @ApiPropertyOptional({ example: 'Apex Logistics' })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({ example: 'APEX-LOG' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ example: 'LOGISTICS' })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  branding?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  socialLinks?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}
