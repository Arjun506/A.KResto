import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PricingWorkflowStatus } from '@prisma/client';

export class UpdatePricingWorkflowStatusDto {
  @ApiProperty({
    enum: PricingWorkflowStatus,
    example: PricingWorkflowStatus.SUBMITTED,
  })
  @IsEnum(PricingWorkflowStatus)
  @IsNotEmpty()
  status: PricingWorkflowStatus;

  @ApiPropertyOptional({ example: 'Margin threshold exceeds 45% policy' })
  @IsOptional()
  @IsString()
  reason?: string;
}
