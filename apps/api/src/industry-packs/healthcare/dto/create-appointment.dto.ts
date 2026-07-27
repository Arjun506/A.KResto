import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'pat_profile_id_123' })
  @IsString()
  @IsNotEmpty()
  patientProfileId: string;

  @ApiProperty({ example: 'doc_employee_id_123' })
  @IsString()
  @IsNotEmpty()
  doctorEmployeeId: string;

  @ApiProperty({ example: '2026-07-25T10:00:00.000Z' })
  @IsDateString()
  dateTime: string;
}
