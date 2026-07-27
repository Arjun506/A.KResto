import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateFacilityDto {
  @ApiProperty({ example: 'General Hospital Berlin' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'HOSPITAL' })
  @IsString()
  @IsIn(['HOSPITAL', 'CLINIC', 'LAB'])
  type: string;
}
