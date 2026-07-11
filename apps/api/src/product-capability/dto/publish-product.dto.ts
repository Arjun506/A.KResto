import { IsString } from 'class-validator';

export class PublishProductDto {
  @IsString()
  status: string;
}
