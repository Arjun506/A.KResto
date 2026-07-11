import { IsIn, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateCloudinarySignatureDto {
  @IsString()
  @IsNotEmpty()
  folder!: string;
}

export class AttachImageDto {
  @IsIn(['restaurantLogo', 'menuImage', 'profileImage'])
  target!: 'restaurantLogo' | 'menuImage' | 'profileImage';

  @IsString()
  @IsNotEmpty()
  targetId!: string;

  @IsUrl()
  imageUrl!: string;
}
