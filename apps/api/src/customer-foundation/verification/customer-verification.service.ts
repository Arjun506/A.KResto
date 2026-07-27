import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  RequestVerificationDto,
  ConfirmVerificationDto,
} from './verify-channel.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { CustomerVerifiedEvent } from '../../event-bus/events/customer.events';

@Injectable()
export class CustomerVerificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async requestVerification(customerId: string, dto: RequestVerificationDto) {
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const record = await this.prisma.customer_verifications.create({
      data: {
        customerId,
        channel: dto.channel,
        token,
        expiresAt,
      },
    });

    return { success: true, verificationId: record.id, token, expiresAt };
  }

  async confirmVerification(customerId: string, dto: ConfirmVerificationDto) {
    const record = await this.prisma.customer_verifications.findFirst({
      where: {
        customerId,
        channel: dto.channel,
        token: dto.token,
        isVerified: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!record) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    await this.prisma.customer_verifications.update({
      where: { id: record.id },
      data: { isVerified: true, verifiedAt: new Date() },
    });

    await this.prisma.customers.update({
      where: { id: customerId },
      data: { verificationStatus: 'VERIFIED' },
    });

    await this.eventBus.publish(
      new CustomerVerifiedEvent(customerId, {
        customerId,
        channel: dto.channel,
      }),
    );

    return {
      success: true,
      message: `Customer channel ${dto.channel} verified successfully`,
    };
  }
}
