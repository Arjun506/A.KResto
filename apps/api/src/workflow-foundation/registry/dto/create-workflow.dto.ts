import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';

export class CreateWorkflowDefinitionDto {
  @ApiPropertyOptional({ example: 't_cuid_123' })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiProperty({ example: 'Order Approval Flow' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'ORD_APP_FLOW_V1' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({
    example: 'Multi-stage order routing and manager validation flow',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: { initialStep: 'START', steps: {} } })
  @IsObject()
  @IsNotEmpty()
  definitionJson: Record<string, any>;

  @ApiPropertyOptional({ example: { layout: 'GRID', zoom: 1.0 } })
  @IsOptional()
  @IsObject()
  canvasMetadata?: Record<string, any>;
}
