import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBusinessProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  legalName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  branding?: {
    logo?: string;
    banner?: string;
    icon?: string;
    theme?: string;
    fonts?: Record<string, string>;
    favicon?: string;
    emailBranding?: Record<string, any>;
    colors?: Record<string, string>;
  };

  @ApiPropertyOptional()
  @IsOptional()
  socialLinks?: Record<string, string>;
}
