import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UniversalOrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: UniversalOrderStatus,
    example: UniversalOrderStatus.SUBMITTED,
  })
  @IsEnum(UniversalOrderStatus)
  @IsNotEmpty()
  status: UniversalOrderStatus;
}
