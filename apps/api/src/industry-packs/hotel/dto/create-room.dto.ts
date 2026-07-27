import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: 'prop_id_123' })
  @IsString()
  @IsNotEmpty()
  propertyId: string;

  @ApiProperty({ example: 'room_type_id_123' })
  @IsString()
  @IsNotEmpty()
  roomTypeId: string;

  @ApiProperty({ example: '304' })
  @IsString()
  @IsNotEmpty()
  roomNumber: string;
}
