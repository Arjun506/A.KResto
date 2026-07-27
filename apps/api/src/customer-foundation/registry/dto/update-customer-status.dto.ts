import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { CustomerStatus } from '@prisma/client';

export class UpdateCustomerStatusDto {
  @ApiProperty({ enum: CustomerStatus, example: CustomerStatus.ACTIVE })
  @IsEnum(CustomerStatus)
  @IsNotEmpty()
  status: CustomerStatus;
}
