import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { FulfillmentStatus } from '@prisma/client';

export class UpdateFulfillmentDto {
  @ApiProperty({
    enum: FulfillmentStatus,
    example: FulfillmentStatus.FULFILLED,
  })
  @IsEnum(FulfillmentStatus)
  @IsNotEmpty()
  status: FulfillmentStatus;
}
