import { Injectable } from '@nestjs/common';
import { BusinessSettingsRepository } from './business-settings.repository';
import { UpdateBusinessSettingsDto } from './dto/update-business-settings.dto';

@Injectable()
export class BusinessSettingsService {
  constructor(private readonly repo: BusinessSettingsRepository) {}

  async upsertSettings(businessId: string, dto: UpdateBusinessSettingsDto) {
    return this.repo.upsertSettings(businessId, dto);
  }

  async getSettings(businessId: string) {
    const settings = await this.repo.getSettings(businessId);
    if (!settings) {
      return this.repo.upsertSettings(businessId, {});
    }
    return settings;
  }
}
