import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  roleName!: string;

  @IsArray()
  @IsString({ each: true })
  permissions!: string[];
}
