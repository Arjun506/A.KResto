import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsObject } from 'class-validator';

export class CreateEmrDto {
  @ApiProperty({ example: 'appt_id_123' })
  @IsString()
  @IsNotEmpty()
  appointmentId: string;

  @ApiProperty({ example: 'Patient complains of mild fever.' })
  @IsString()
  @IsNotEmpty()
  clinicalNotes: string;

  @ApiProperty({
    example: { icd10: ['R50.9'], description: 'Fever, unspecified' },
  })
  @IsObject()
  @IsNotEmpty()
  diagnoses: Record<string, any>;
}
