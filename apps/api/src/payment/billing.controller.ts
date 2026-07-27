import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentProviderKey } from './payment-provider.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../tenant/tenant.guard';
import { apiSuccess } from '../common/responses/api-response';
import { PrismaService } from '../prisma/prisma.service';
import { PlanTier } from '@prisma/client';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.interface';

import { BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

function verifyStripeSignature(
  rawBody: string,
  signature: string,
  secret: string,
): boolean {
  try {
    const parts = signature.split(',');
    const timestampPart = parts.find((p) => p.startsWith('t='));
    const signaturePart = parts.find((p) => p.startsWith('v1='));

    if (!timestampPart || !signaturePart) return false;

    const timestamp = timestampPart.split('=')[1];
    const signatureHash = signaturePart.split('=')[1];

    const payload = `${timestamp}.${rawBody}`;
    const expectedHash = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const sigBuf = Buffer.from(signatureHash, 'hex');
    const expBuf = Buffer.from(expectedHash, 'hex');

    if (sigBuf.length !== expBuf.length) return false;
    return crypto.timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

function verifyRazorpaySignature(
  rawBody: string,
  signature: string,
  secret: string,
): boolean {
  try {
    const expectedHash = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    const sigBuf = Buffer.from(signature, 'hex');
    const expBuf = Buffer.from(expectedHash, 'hex');

    if (sigBuf.length !== expBuf.length) return false;
    return crypto.timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

@Controller('billing')
export class BillingController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('stripe/checkout')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async createStripeCheckout(@Body() body: { planId: string }) {
    const result = await this.paymentService.createCheckout(
      PaymentProviderKey.STRIPE,
      body.planId,
    );
    return apiSuccess(result);
  }

  @Post('razorpay/subscriptions')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async createRazorpaySubscription(@Body() body: { planId: string }) {
    const result = await this.paymentService.createSubscription(
      PaymentProviderKey.RAZORPAY,
      body.planId,
    );
    return apiSuccess(result);
  }

  @Post('stripe/portal')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async openStripePortal() {
    const result = await this.paymentService.openBillingPortal(
      PaymentProviderKey.STRIPE,
    );
    return apiSuccess(result);
  }

  @Get('invoices')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async getInvoices() {
    const result = await this.paymentService.getInvoiceHistory(
      PaymentProviderKey.STRIPE,
    );
    return apiSuccess(result);
  }

  @Post('simulate-success')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async simulateSuccess(
    @Req() req: AuthenticatedRequest,
    @Body() body: { planId: string; gateway: string },
  ) {
    const tenantId = req.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing');
    }

    await this.updateTenantSubscription(
      tenantId,
      body.planId,
      `simulated ${body.gateway}`,
      req.user?.id || null,
    );
    return apiSuccess({ ok: true, plan: body.planId });
  }

  @Post('stripe/webhook')
  async handleStripeWebhook(@Req() req: any) {
    const signature = req.headers['stripe-signature'];
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !secret) {
      throw new BadRequestException(
        'Missing signature or webhook secret configuration',
      );
    }

    const rawBody = req.rawBody
      ? req.rawBody.toString('utf8')
      : JSON.stringify(req.body);

    const isValid = verifyStripeSignature(rawBody, signature, secret);
    if (!isValid) {
      throw new BadRequestException('Invalid signature');
    }

    const event = req.body;
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const tenantId = session.metadata?.tenantId;
      const planId = session.metadata?.planId;

      if (tenantId && planId) {
        await this.updateTenantSubscription(tenantId, planId, 'STRIPE', null);
      }
    }

    return { received: true };
  }

  @Post('razorpay/webhook')
  async handleRazorpayWebhook(@Req() req: any) {
    const signature = req.headers['x-razorpay-signature'];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !secret) {
      throw new BadRequestException(
        'Missing signature or webhook secret configuration',
      );
    }

    const rawBody = req.rawBody
      ? req.rawBody.toString('utf8')
      : JSON.stringify(req.body);

    const isValid = verifyRazorpaySignature(rawBody, signature, secret);
    if (!isValid) {
      throw new BadRequestException('Invalid signature');
    }

    const event = req.body;
    if (event.event === 'subscription.charged') {
      const notes = event.payload?.subscription?.entity?.notes;
      const tenantId = notes?.tenantId;
      const planId = notes?.planId;

      if (tenantId && planId) {
        await this.updateTenantSubscription(tenantId, planId, 'RAZORPAY', null);
      }
    }

    return { received: true };
  }

  private async updateTenantSubscription(
    tenantId: string,
    planId: string,
    gateway: string,
    userId: string | null,
  ) {
    const planTierMap: Record<string, PlanTier> = {
      starter: PlanTier.STARTER,
      pro: PlanTier.PROFESSIONAL,
      enterprise: PlanTier.ENTERPRISE,
    };

    const targetPlan = planTierMap[planId] ?? PlanTier.PROFESSIONAL;

    const activeSub = await this.prisma.subscriptions.findFirst({
      where: { tenantId: tenantId },
    });

    const now = new Date();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    if (activeSub) {
      await this.prisma.subscriptions.update({
        where: { id: activeSub.id },
        data: {
          planName: targetPlan,
          status: 'ACTIVE',
          currentPeriodStart: now,
          currentPeriodEnd: expiresAt,
        },
      });
    } else {
      await this.prisma.subscriptions.create({
        data: {
          tenantId: tenantId,
          planName: targetPlan,
          status: 'ACTIVE',
          currentPeriodStart: now,
          currentPeriodEnd: expiresAt,
        },
      });
    }

    await this.prisma.audit_logs.create({
      data: {
        tenantId: tenantId,
        userId,
        entity: 'SUBSCRIPTION',
        entityId: tenantId,
        action: 'UPGRADE',
        changes: [`Subscription upgraded to ${targetPlan} via ${gateway}`],
      },
    });
  }
}
