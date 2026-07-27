import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { BusinessStatus } from '@prisma/client';

export class UpdateBusinessStatusDto {
  @ApiProperty({ enum: BusinessStatus, example: BusinessStatus.ACTIVE })
  @IsEnum(BusinessStatus)
  @IsNotEmpty()
  status: BusinessStatus;
}
