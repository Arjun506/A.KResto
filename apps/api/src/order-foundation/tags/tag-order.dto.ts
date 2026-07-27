import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TagOrderDto {
  @ApiProperty({ example: 'VIP_CUSTOMER' })
  @IsString()
  @IsNotEmpty()
  tag: string;
}
