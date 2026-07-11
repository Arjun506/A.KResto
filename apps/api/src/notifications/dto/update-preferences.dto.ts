import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdatePreferencesDto {
  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsArray()
  @IsString({ each: true })
  channels!: string[];
}
