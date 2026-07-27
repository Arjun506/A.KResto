import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsIn,
} from 'class-validator';

export class OnboardTenantDto {
  @ApiProperty({ example: 'Acme Logistics' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'acme-logistics' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'admin@acme.com' })
  @IsEmail()
  @IsNotEmpty()
  adminEmail: string;

  @ApiProperty({ example: 'admin123' })
  @IsString()
  @IsNotEmpty()
  adminPassword?: string;

  @ApiProperty({ example: 'STARTER' })
  @IsString()
  @IsIn(['TRIAL', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE'])
  planTier: 'TRIAL' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';

  @ApiPropertyOptional({ example: 'LOGISTICS' })
  @IsOptional()
  @IsString()
  industry?: string;
}
