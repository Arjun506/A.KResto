import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { apiSuccess } from '../common/responses/api-response';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.interface';
import { TenantGuard } from '../tenant/tenant.guard';
import { AttachImageDto, CreateCloudinarySignatureDto } from './dto/upload.dto';
import { UploadsService } from './uploads.service';

@Controller('uploads')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('cloudinary/signature')
  @Roles('OWNER', 'RESTAURANT_OWNER', 'MANAGER', 'SUPER_ADMIN')
  createCloudinarySignature(@Body() dto: CreateCloudinarySignatureDto) {
    return apiSuccess(
      this.uploadsService.createCloudinarySignature(dto),
      'Upload signature created',
    );
  }

  @Patch('image')
  @Roles('OWNER', 'RESTAURANT_OWNER', 'MANAGER', 'SUPER_ADMIN')
  async attachImage(
    @Req() req: AuthenticatedRequest,
    @Body() dto: AttachImageDto,
  ) {
    return apiSuccess(
      await this.uploadsService.attachImage(req.user, dto),
      'Image attached',
    );
  }
}
