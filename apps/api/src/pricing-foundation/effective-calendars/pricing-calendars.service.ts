import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePricingCalendarDto } from './create-calendar.dto';

@Injectable()
export class PricingCalendarsService {
  constructor(private readonly prisma: PrismaService) {}

  async createCalendar(
    tenantId: string | undefined,
    dto: CreatePricingCalendarDto,
  ) {
    return this.prisma.pricing_calendars.create({
      data: {
        tenantId,
        name: dto.name,
        timezone: dto.timezone || 'UTC',
        blackoutDates: dto.blackoutDates,
        businessHours: dto.businessHours,
      },
    });
  }

  async listCalendars(tenantId?: string) {
    return this.prisma.pricing_calendars.findMany({
      where: tenantId ? { tenantId } : {},
    });
  }
}
