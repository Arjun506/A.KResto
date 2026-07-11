import { IsNotEmpty, IsNumber } from 'class-validator';

export class OpenSessionDto {
  @IsNumber()
  @IsNotEmpty()
  openingBalance!: number;
}
