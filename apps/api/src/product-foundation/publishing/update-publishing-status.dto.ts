import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { PublishingStatus } from '@prisma/client';

export class UpdatePublishingStatusDto {
  @ApiProperty({ enum: PublishingStatus, example: PublishingStatus.PUBLISHED })
  @IsEnum(PublishingStatus)
  @IsNotEmpty()
  publishingStatus: PublishingStatus;
}
