import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateBusinessSettingsDto } from './dto/update-business-settings.dto';

@Injectable()
export class BusinessSettingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertSettings(businessId: string, dto: UpdateBusinessSettingsDto) {
    return this.prisma.business_settings.upsert({
      where: { businessId },
      create: {
        businessId,
        locale: dto.locale || 'en-US',
        currency: dto.currency || 'USD',
        timezone: dto.timezone || 'UTC',
        language: dto.language || 'en',
        fiscalYearStart: dto.fiscalYearStart || '01-01',
        workingHours: dto.workingHours,
        regionalPreferences: dto.regionalPreferences,
      },
      update: {
        ...(dto.locale && { locale: dto.locale }),
        ...(dto.currency && { currency: dto.currency }),
        ...(dto.timezone && { timezone: dto.timezone }),
        ...(dto.language && { language: dto.language }),
        ...(dto.fiscalYearStart && { fiscalYearStart: dto.fiscalYearStart }),
        ...(dto.workingHours && { workingHours: dto.workingHours }),
        ...(dto.regionalPreferences && {
          regionalPreferences: dto.regionalPreferences,
        }),
      },
    });
  }

  async getSettings(businessId: string) {
    return this.prisma.business_settings.findUnique({
      where: { businessId },
    });
  }
}
