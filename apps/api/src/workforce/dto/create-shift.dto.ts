import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateShiftDto {
  @IsString()
  @IsNotEmpty()
  employeeId!: string;

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @IsNumber()
  dayOfWeek?: number;

  @IsOptional()
  @IsString()
  shiftType?: string;

  @IsString()
  @IsNotEmpty()
  startTime!: string;

  @IsString()
  @IsNotEmpty()
  endTime!: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  rotationWeek?: number;
}
