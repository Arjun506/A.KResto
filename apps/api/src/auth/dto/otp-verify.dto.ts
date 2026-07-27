import { IsNotEmpty, IsString, Length } from 'class-validator';

export class OtpVerifyDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  code: string;
}
