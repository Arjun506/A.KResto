import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePriceRuleDto } from './create-price-rule.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { PriceRuleCreatedEvent } from '../../event-bus/events/pricing.events';

@Injectable()
export class PriceRulesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createPriceRule(tenantId: string | undefined, dto: CreatePriceRuleDto) {
    const rule = await this.prisma.price_rules.create({
      data: {
        tenantId,
        name: dto.name,
        ruleType: dto.ruleType,
        value: dto.value,
        minQuantity: dto.minQuantity ?? 1,
        priority: dto.priority ?? 0,
        isStackable: dto.isStackable ?? false,
        formulaExpression: dto.formulaExpression,
      },
    });

    await this.eventBus.publish(
      new PriceRuleCreatedEvent(
        rule.id,
        { priceRuleId: rule.id, ruleType: rule.ruleType, value: rule.value },
        tenantId,
      ),
    );

    return rule;
  }

  async listPriceRules(tenantId?: string) {
    return this.prisma.price_rules.findMany({
      where: tenantId ? { tenantId, deletedAt: null } : { deletedAt: null },
      orderBy: { priority: 'desc' },
    });
  }
}
