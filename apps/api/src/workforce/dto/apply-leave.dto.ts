import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ApplyLeaveDto {
  @IsOptional()
  @IsString()
  leaveType?: string;

  @IsOptional()
  @IsString()
  type?: string;

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
