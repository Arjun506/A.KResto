import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddOrderNoteDto {
  @ApiProperty({
    example: 'Please leave parcel at side entrance if no response',
  })
  @IsString()
  @IsNotEmpty()
  noteText: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isCustomerFacing?: boolean;
}
