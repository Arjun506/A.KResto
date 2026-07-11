import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ApplyLeaveDto {
  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @IsDateString()
  @IsNotEmpty()
  endDate!: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
