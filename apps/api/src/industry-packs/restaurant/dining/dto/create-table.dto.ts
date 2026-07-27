import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateRestaurantTableDto {
  @ApiProperty({ example: 'T-12' })
  @IsString()
  @IsNotEmpty()
  tableNumber: string;

  @ApiProperty({ example: 4 })
  @IsNumber()
  seatingCapacity: number;

  @ApiProperty({ example: 'TERRACE' })
  @IsString()
  @IsNotEmpty()
  zone: string;
}
