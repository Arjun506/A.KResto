import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDigitalAssetDto } from './create-digital-asset.dto';

@Injectable()
export class ProductDigitalService {
  constructor(private readonly prisma: PrismaService) {}

  async addDigitalAsset(productId: string, dto: CreateDigitalAssetDto) {
    return this.prisma.product_digital_assets.create({
      data: {
        productId,
        fileKey: dto.fileKey,
        url: dto.url,
        downloadLimit: dto.downloadLimit,
        expiryDays: dto.expiryDays,
        requiresLicenseKey: dto.requiresLicenseKey ?? false,
      },
    });
  }

  async getDigitalAssets(productId: string) {
    return this.prisma.product_digital_assets.findMany({
      where: { productId },
    });
  }
}
