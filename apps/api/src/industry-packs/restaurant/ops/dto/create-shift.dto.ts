import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRestaurantShiftDto {
  @ApiProperty({ example: 'emp_waiter_123' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ example: '2026-07-24T08:00:00.000Z' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ example: '2026-07-24T16:00:00.000Z' })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({ example: 'WAITER' })
  @IsString()
  @IsNotEmpty()
  role: string;
}
