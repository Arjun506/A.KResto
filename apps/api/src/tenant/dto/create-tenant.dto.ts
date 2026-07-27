import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTenantDto {
  @ApiProperty({ example: 'Acme Global' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'acme-global' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ example: 'UTC' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ example: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  branding?: Record<string, any>;

  @ApiPropertyOptional({ example: ['acme.com', 'app.acme.com'] })
  @IsOptional()
  customDomains?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  limits?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}
