import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCrmLeadDto {
  @ApiPropertyOptional({ example: 't_cuid_123' })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiPropertyOptional({ example: 'bus_cuid_123' })
  @IsOptional()
  @IsString()
  businessId?: string;

  @ApiPropertyOptional({ example: 'cust_cuid_123' })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({ example: 'LEAD-998822' })
  @IsString()
  @IsNotEmpty()
  leadNumber: string;

  @ApiPropertyOptional({ example: 'Google Search Ad' })
  @IsOptional()
  @IsString()
  sourceString?: string;

  @ApiPropertyOptional({ example: 'NEW' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'Interested in franchise partner program' })
  @IsOptional()
  @IsString()
  notesString?: string;
}
