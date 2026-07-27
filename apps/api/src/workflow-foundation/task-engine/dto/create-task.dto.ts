import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorkflowTaskDto {
  @ApiPropertyOptional({ example: 't_cuid_123' })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiPropertyOptional({ example: 'inst_cuid_123' })
  @IsOptional()
  @IsString()
  workflowInstanceId?: string;

  @ApiProperty({ example: 'Verify Product Inventory' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example:
      'Inspect storage zones and verify SKU physical count matches registry',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'emp_cuid_123' })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({ example: 'form_reorder_123' })
  @IsOptional()
  @IsString()
  formId?: string;
}
