import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TransferOwnershipDto {
  @ApiProperty({ example: 'usr_new_owner_cuid' })
  @IsString()
  @IsNotEmpty()
  newOwnerId: string;
}

export class MergeBusinessDto {
  @ApiProperty({ example: 'biz_target_cuid' })
  @IsString()
  @IsNotEmpty()
  targetBusinessId: string;
}
