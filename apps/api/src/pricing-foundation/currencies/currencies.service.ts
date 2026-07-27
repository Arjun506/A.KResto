import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCurrencyDto, SetExchangeRateDto } from './create-currency.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { ExchangeRateUpdatedEvent } from '../../event-bus/events/pricing.events';

@Injectable()
export class CurrenciesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createCurrency(tenantId: string | undefined, dto: CreateCurrencyDto) {
    return this.prisma.currencies.upsert({
      where: { code: dto.code },
      create: {
        tenantId,
        code: dto.code,
        name: dto.name,
        symbol: dto.symbol,
        precision: dto.precision ?? 2,
      },
      update: {
        name: dto.name,
        symbol: dto.symbol,
        precision: dto.precision ?? 2,
      },
    });
  }

  async listCurrencies(tenantId?: string) {
    return this.prisma.currencies.findMany({
      where: tenantId ? { tenantId, isActive: true } : { isActive: true },
    });
  }

  async setExchangeRate(dto: SetExchangeRateDto) {
    const rate = await this.prisma.exchange_rates.create({
      data: {
        baseCurrency: dto.baseCurrency,
        targetCurrency: dto.targetCurrency,
        rate: dto.rate,
      },
    });

    await this.eventBus.publish(
      new ExchangeRateUpdatedEvent(dto.baseCurrency, {
        baseCurrency: dto.baseCurrency,
        targetCurrency: dto.targetCurrency,
        rate: dto.rate,
      }),
    );

    return rate;
  }

  async getExchangeRate(baseCurrency: string, targetCurrency: string) {
    if (baseCurrency === targetCurrency) return 1.0;
    const rate = await this.prisma.exchange_rates.findFirst({
      where: { baseCurrency, targetCurrency },
      orderBy: { effectiveAt: 'desc' },
    });
    return rate?.rate || 1.0;
  }
}
