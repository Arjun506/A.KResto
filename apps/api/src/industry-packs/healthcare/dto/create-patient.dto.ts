import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({ example: 'cust_patient_id_123' })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiPropertyOptional({ example: 'O+' })
  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @ApiPropertyOptional({ example: ['Peanuts', 'Penicillin'] })
  @IsOptional()
  @IsArray()
  allergies?: string[];
}
