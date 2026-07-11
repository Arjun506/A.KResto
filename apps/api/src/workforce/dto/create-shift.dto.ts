import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateShiftDto {
  @IsString()
  @IsNotEmpty()
  employeeId!: string;

  @IsString()
  @IsNotEmpty()
  dayOfWeek!: string;

  @IsString()
  @IsNotEmpty()
  shiftType!: string;

  @IsString()
  @IsNotEmpty()
  startTime!: string;

  @IsString()
  @IsNotEmpty()
  endTime!: string;

  @IsOptional()
  @IsNumber()
  rotationWeek?: number;
}
