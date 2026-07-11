import { IsBoolean } from 'class-validator';

export class UpdateMenuAvailabilityDto {
  @IsBoolean()
  isAvailable!: boolean;
}
