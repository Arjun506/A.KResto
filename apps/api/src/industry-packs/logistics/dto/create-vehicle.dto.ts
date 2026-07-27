import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ example: 'DL-1C-A-1234' })
  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @ApiProperty({ example: 'Tata Ace Gold' })
  @IsString()
  @IsNotEmpty()
  makeModel: string;

  @ApiProperty({ example: 850.0 })
  @IsNumber()
  capacityKg: number;
}
