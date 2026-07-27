import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBusinessSettingsDto {
  @ApiPropertyOptional({ example: 'en-US' })
  @IsOptional()
  @IsString()
  locale?: string;

  @ApiPropertyOptional({ example: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: 'UTC' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ example: 'en' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ example: '01-01' })
  @IsOptional()
  @IsString()
  fiscalYearStart?: string;

  @ApiPropertyOptional()
  @IsOptional()
  workingHours?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  regionalPreferences?: Record<string, any>;
}
