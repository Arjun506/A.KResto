import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CloseSessionDto {
  @IsNumber()
  @IsNotEmpty()
  closingBalance!: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
