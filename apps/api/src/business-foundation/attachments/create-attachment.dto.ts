import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AttachmentCategory } from '@prisma/client';

export class CreateAttachmentDto {
  @ApiProperty({ example: 'docs/license-123.pdf' })
  @IsString()
  @IsNotEmpty()
  fileKey: string;

  @ApiProperty({ example: 'Business_License_2026.pdf' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ example: 2048500 })
  @IsNumber()
  @IsNotEmpty()
  fileSize: number;

  @ApiProperty({ example: 'application/pdf' })
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiProperty({
    enum: AttachmentCategory,
    example: AttachmentCategory.LICENSE,
  })
  @IsEnum(AttachmentCategory)
  @IsNotEmpty()
  category: AttachmentCategory;

  @ApiProperty({ example: '/uploads/docs/license-123.pdf' })
  @IsString()
  @IsNotEmpty()
  url: string;
}
