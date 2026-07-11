import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CheckNameQueryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name!: string;
}
