import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CustomerAttachmentCategory } from '@prisma/client';

export class CreateCustomerAttachmentDto {
  @ApiProperty({ example: 'customer-docs/passport-123.pdf' })
  @IsString()
  @IsNotEmpty()
  fileKey: string;

  @ApiProperty({ example: 'Passport_Scan.pdf' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ example: 1048576 })
  @IsNumber()
  @IsNotEmpty()
  fileSize: number;

  @ApiProperty({ example: 'application/pdf' })
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiProperty({
    enum: CustomerAttachmentCategory,
    example: CustomerAttachmentCategory.ID_CARD,
  })
  @IsEnum(CustomerAttachmentCategory)
  @IsNotEmpty()
  category: CustomerAttachmentCategory;

  @ApiProperty({ example: '/uploads/customer-docs/passport-123.pdf' })
  @IsString()
  @IsNotEmpty()
  url: string;
}
