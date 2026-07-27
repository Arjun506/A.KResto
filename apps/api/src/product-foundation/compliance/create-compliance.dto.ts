import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateComplianceDto {
  @ApiProperty({ example: 'CE Certification' })
  @IsString()
  @IsNotEmpty()
  certificationName: string;

  @ApiPropertyOptional({ example: 'EU-2026-REG-44' })
  @IsOptional()
  @IsString()
  regulatoryCode?: string;

  @ApiPropertyOptional({ example: 'NO_EXPORT_NORTH_AMERICA' })
  @IsOptional()
  @IsString()
  countryRestriction?: string;

  @ApiPropertyOptional({ example: '/docs/compliance/ce-cert.pdf' })
  @IsOptional()
  @IsString()
  documentUrl?: string;
}
