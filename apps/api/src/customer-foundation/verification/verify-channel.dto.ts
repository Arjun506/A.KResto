import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RequestVerificationDto {
  @ApiProperty({ example: 'EMAIL' })
  @IsString()
  @IsNotEmpty()
  channel: string;
}

export class ConfirmVerificationDto {
  @ApiProperty({ example: 'EMAIL' })
  @IsString()
  @IsNotEmpty()
  channel: string;

  @ApiProperty({ example: '483921' })
  @IsString()
  @IsNotEmpty()
  token: string;
}
