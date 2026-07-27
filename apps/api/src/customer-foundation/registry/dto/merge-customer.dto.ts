import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MergeCustomerDto {
  @ApiProperty({ example: 'cust_target_cuid' })
  @IsString()
  @IsNotEmpty()
  targetCustomerId: string;

  @ApiPropertyOptional({ example: 'Duplicate account consolidation' })
  @IsOptional()
  @IsString()
  reason?: string;
}
