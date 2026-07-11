import { IsBoolean, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class UpdateFeatureDto {
  @IsBoolean()
  @IsNotEmpty()
  isEnabled!: boolean;

  @IsObject()
  @IsOptional()
  config?: Record<string, unknown>;
}
