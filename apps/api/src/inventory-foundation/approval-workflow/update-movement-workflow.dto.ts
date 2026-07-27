import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { MovementWorkflowStatus } from '@prisma/client';

export class UpdateMovementWorkflowDto {
  @ApiProperty({
    enum: MovementWorkflowStatus,
    example: MovementWorkflowStatus.SUBMITTED,
  })
  @IsEnum(MovementWorkflowStatus)
  @IsNotEmpty()
  status: MovementWorkflowStatus;
}
