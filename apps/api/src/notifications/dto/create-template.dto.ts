import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  trigger!: string;

  @IsString()
  @IsNotEmpty()
  titleTemplate!: string;

  @IsString()
  @IsNotEmpty()
  bodyTemplate!: string;

  @IsArray()
  @IsString({ each: true })
  channels!: string[];

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
