import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateCrmOpportunityDto {
  @ApiPropertyOptional({ example: 't_cuid_123' })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiPropertyOptional({ example: 'lead_cuid_123' })
  @IsOptional()
  @IsString()
  leadId?: string;

  @ApiPropertyOptional({ example: 'cust_cuid_123' })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({ example: 'Mid-Market ERP Upgrade' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'PROSPECTING' })
  @IsOptional()
  @IsString()
  stage?: string;

  @ApiPropertyOptional({ example: 12000 })
  @IsOptional()
  @IsNumber()
  estimatedValue?: number;

  @ApiPropertyOptional({ example: 0.2 })
  @IsOptional()
  @IsNumber()
  probability?: number;
}
