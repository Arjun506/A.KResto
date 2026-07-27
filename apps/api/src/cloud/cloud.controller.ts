import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UnauthorizedException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { apiSuccess } from '../common/responses/api-response';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.interface';
import { TenantGuard } from '../tenant/tenant.guard';
import { CloudService } from './cloud.service';

@Controller('cloud')
export class CloudController {
  constructor(private readonly cloudService: CloudService) {}

  /**
   * Upload file (Tenant-aware & Auth-guarded)
   */
  @Post('upload')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles(
    'OWNER',
    'RESTAURANT_OWNER',
    'MANAGER',
    'SUPER_ADMIN',
    'CASHIER',
    'CHEF',
  )
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Req() req: AuthenticatedRequest,
    @UploadedFile() file: any,
    @Query('category') category = 'general',
    @Query('isPublic') isPublicQuery = 'false',
  ) {
    const user = req.user;
    if (!user || !user.tenantId) {
      throw new UnauthorizedException('Missing tenant context');
    }

    const isPublic = isPublicQuery === 'true';
    const metadata = await this.cloudService.uploadFile(
      user.tenantId,
      user.id,
      file,
      category,
      isPublic,
    );
    return apiSuccess(metadata, 'File uploaded successfully to AK Cloud');
  }

  /**
   * List file metadata for tenant
   */
  @Get('files')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('OWNER', 'RESTAURANT_OWNER', 'MANAGER', 'SUPER_ADMIN')
  async listFiles(
    @Req() req: AuthenticatedRequest,
    @Query('category') category?: string,
  ) {
    const user = req.user;
    if (!user || !user.tenantId) {
      throw new UnauthorizedException('Missing tenant context');
    }

    const files = await this.cloudService.listFiles(user.tenantId, category);
    return apiSuccess(files, 'Files list retrieved');
  }

  /**
   * Get file metadata
   */
  @Get('files/:id')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('OWNER', 'RESTAURANT_OWNER', 'MANAGER', 'SUPER_ADMIN')
  async getMetadata(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const user = req.user;
    if (!user || !user.tenantId) {
      throw new UnauthorizedException('Missing tenant context');
    }

    const file = await this.cloudService.getFileMetadata(user.tenantId, id);
    return apiSuccess(file, 'File metadata retrieved');
  }

  /**
   * Delete file
   */
  @Delete('files/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('OWNER', 'RESTAURANT_OWNER', 'SUPER_ADMIN')
  async deleteFile(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const user = req.user;
    if (!user || !user.tenantId) {
      throw new UnauthorizedException('Missing tenant context');
    }

    await this.cloudService.deleteFile(user.tenantId, id);
    return apiSuccess(null, 'File permanently deleted from AK Cloud');
  }

  /**
   * Stream secure file asset (Auth-guarded)
   */
  @Get('secure/:id')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles(
    'OWNER',
    'RESTAURANT_OWNER',
    'MANAGER',
    'SUPER_ADMIN',
    'CASHIER',
    'CHEF',
  )
  async streamSecureFile(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Res() res: any,
  ) {
    const user = req.user;
    if (!user || !user.tenantId) {
      throw new UnauthorizedException('Missing tenant context');
    }

    const { buffer, metadata } = await this.cloudService.getFileBuffer(
      user.tenantId,
      id,
    );

    res.set({
      'Content-Type': metadata.mimeType,
      'Content-Disposition': `inline; filename="${metadata.originalName}"`,
      'Content-Length': buffer.length,
      'Cache-Control': 'private, max-age=3600',
    });

    res.end(buffer);
  }

  /**
   * Stream public file asset (Public unauthenticated access)
   */
  @Get('public/tenants/:tenantId/:category/:filename')
  async streamPublicFile(
    @Param('tenantId') tenantId: string,
    @Param('category') category: string,
    @Param('filename') filename: string,
    @Res() res: any,
  ) {
    const storageKey = `tenants/${tenantId}/${category}/${filename}`;
    const buffer = await this.cloudService.getFileBufferByPath(storageKey);

    // Simple mime-type mapping for common extension types
    let mimeType = 'application/octet-stream';
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'png') mimeType = 'image/png';
    else if (ext === 'jpg' || ext === 'jpeg') mimeType = 'image/jpeg';
    else if (ext === 'svg') mimeType = 'image/svg+xml';
    else if (ext === 'pdf') mimeType = 'application/pdf';
    else if (ext === 'mp4') mimeType = 'video/mp4';

    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `inline; filename="${filename}"`,
      'Content-Length': buffer.length,
      'Cache-Control': 'public, max-age=86400',
    });

    res.end(buffer);
  }
}
