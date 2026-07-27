import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentProviderDto } from './dto/create-provider.dto';

@Injectable()
export class PaymentProvidersService {
  constructor(private readonly prisma: PrismaService) {}

  async createProvider(dto: CreatePaymentProviderDto) {
    const existing = await this.prisma.payment_providers.findUnique({
      where: { providerCode: dto.providerCode },
    });
    if (existing) {
      throw new ConflictException(
        `Provider code ${dto.providerCode} already exists`,
      );
    }

    return this.prisma.payment_providers.create({
      data: {
        tenantId: dto.tenantId,
        providerName: dto.providerName,
        providerCode: dto.providerCode,
        credentialsEncrypted: dto.credentials,
      },
    });
  }

  async getProviders(tenantId?: string) {
    const where = tenantId ? { tenantId } : {};
    return this.prisma.payment_providers.findMany({
      where,
      orderBy: { providerName: 'asc' },
    });
  }
}
