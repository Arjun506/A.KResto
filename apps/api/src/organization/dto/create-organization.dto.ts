import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Global Enterprises Inc.' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'GLOB-01' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'cuid_tenant_id' })
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class CreateBusinessDto {
  @ApiProperty({ example: 'Acme Retail Division' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'RETAIL' })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiProperty({ example: 'cuid_org_id' })
  @IsString()
  @IsNotEmpty()
  organizationId: string;
}

export class CreateLocationDto {
  @ApiProperty({ example: 'North America HQ' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'cuid_division_id' })
  @IsString()
  @IsNotEmpty()
  divisionId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;
}
