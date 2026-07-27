import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TokenVaultService {
  constructor(private readonly prisma: PrismaService) {}

  async tokenizeCard(
    customerId: string,
    brand: string,
    lastFour: string,
    expiryMonth: number,
    expiryYear: number,
  ) {
    const mockToken = `tok_vault_${Math.random().toString(36).substr(2, 12)}`;
    const expiresAt = new Date();
    expiresAt.setFullYear(expiryYear, expiryMonth - 1, 1);

    return this.prisma.payment_tokens.create({
      data: {
        customerId,
        token: mockToken,
        cardBrand: brand,
        lastFour,
        expiryMonth,
        expiryYear,
        expiresAt,
      },
    });
  }

  async rotateToken(id: string) {
    const token = await this.prisma.payment_tokens.findUnique({
      where: { id },
    });
    if (!token) {
      throw new NotFoundException(`Token with ID ${id} not found`);
    }

    const rotated = `tok_vault_rot_${Math.random().toString(36).substr(2, 12)}`;
    return this.prisma.payment_tokens.update({
      where: { id },
      data: {
        token: rotated,
        rotatedAt: new Date(),
      },
    });
  }

  async getCustomerTokens(customerId: string) {
    return this.prisma.payment_tokens.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
