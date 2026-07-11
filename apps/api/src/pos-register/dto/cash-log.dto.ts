import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CashLogDto {
  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @IsString()
  @IsIn(['CASH_IN', 'CASH_OUT'])
  type!: 'CASH_IN' | 'CASH_OUT';

  @IsString()
  @IsNotEmpty()
  reason!: string;
}
