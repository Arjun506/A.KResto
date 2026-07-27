import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash } from 'node:crypto';

import type { JwtUser } from '../common/types/jwt-user.interface';
import { PrismaService } from '../prisma/prisma.service';
import { AttachImageDto, CreateCloudinarySignatureDto } from './dto/upload.dto';

@Injectable()
export class UploadsService {
  constructor(private readonly prisma: PrismaService) {}

  private tenantId(user: JwtUser | undefined) {
    if (!user?.tenantId) {
      throw new ForbiddenException('Missing tenantId for tenant access');
    }

    return user.tenantId;
  }

  createCloudinarySignature(dto: CreateCloudinarySignatureDto) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new BadRequestException('Cloudinary environment is not configured');
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = dto.folder.replace(/[^a-zA-Z0-9/_-]/g, '');
    const signatureBase = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = createHash('sha1').update(signatureBase).digest('hex');

    return {
      cloudName,
      apiKey,
      folder,
      timestamp,
      signature,
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    };
  }

  async attachImage(user: JwtUser | undefined, dto: AttachImageDto) {
    const tenantId = this.tenantId(user);

    if (dto.target === 'restaurantLogo') {
      if (dto.targetId !== tenantId) {
        throw new ForbiddenException('Not allowed');
      }

      const updated = await this.prisma.tenant.updateMany({
        where: { id: tenantId },
        data: { logo: dto.imageUrl },
      });
      if (!updated.count) throw new NotFoundException('Restaurant not found');
      return { id: dto.targetId, imageUrl: dto.imageUrl };
    }

    if (dto.target === 'menuImage') {
      const updated = await this.prisma.menu_items.updateMany({
        where: { id: dto.targetId, tenantId },
        data: { imageUrl: dto.imageUrl },
      });
      if (!updated.count) throw new NotFoundException('Menu item not found');
      return { id: dto.targetId, imageUrl: dto.imageUrl };
    }

    const updated = await this.prisma.users.updateMany({
      where: { id: dto.targetId, tenantId },
      data: { profileImageUrl: dto.imageUrl },
    });
    if (!updated.count) throw new NotFoundException('User not found');
    return { id: dto.targetId, imageUrl: dto.imageUrl };
  }
}
