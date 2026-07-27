import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OpenSessionDto } from './dto/open-session.dto';
import { CloseSessionDto } from './dto/close-session.dto';
import { CashLogDto } from './dto/cash-log.dto';

@Injectable()
export class PosRegisterService {
  constructor(private readonly prisma: PrismaService) {}

  async getActiveSession(tenantId: string, cashierId: string) {
    const session = await this.prisma.pos_register_sessions.findFirst({
      where: {
        tenantId,
        cashierId,
        status: 'OPEN',
      },
      include: {
        payments: {
          where: { status: 'SUCCESS' },
        },
        cashLogs: true,
        cashier: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!session) return null;

    // Compute expected balance on the fly for real-time display
    const cashPayments = session.payments
      .filter((p) => p.paymentMethod === 'CASH')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const cashIn = session.cashLogs
      .filter((l) => l.type === 'CASH_IN')
      .reduce((sum, l) => sum + Number(l.amount), 0);

    const cashOut = session.cashLogs
      .filter((l) => l.type === 'CASH_OUT')
      .reduce((sum, l) => sum + Number(l.amount), 0);

    const expectedBalance =
      Number(session.openingBalance) + cashPayments + cashIn - cashOut;

    return {
      ...session,
      expectedBalance,
    };
  }

  async openSession(tenantId: string, cashierId: string, dto: OpenSessionDto) {
    const active = await this.prisma.pos_register_sessions.findFirst({
      where: {
        tenantId,
        cashierId,
        status: 'OPEN',
      },
    });

    if (active) {
      throw new BadRequestException(
        'A cash register session is already open for this cashier.',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const session = await tx.pos_register_sessions.create({
        data: {
          tenantId,
          cashierId,
          openingBalance: dto.openingBalance,
          status: 'OPEN',
        },
      });

      await tx.audit_logs.create({
        data: {
          tenantId: tenantId,
          userId: cashierId,
          entity: 'PosRegisterSession',
          entityId: session.id,
          action: 'POS_REGISTER_OPENED',
          changes: [`openingBalance: ${Number(dto.openingBalance).toFixed(2)}`],
          newValues: {
            openingBalance: dto.openingBalance,
            status: session.status,
          },
        },
      });

      return session;
    });
  }

  async closeSession(
    tenantId: string,
    cashierId: string,
    dto: CloseSessionDto,
  ) {
    const session = await this.prisma.pos_register_sessions.findFirst({
      where: {
        tenantId,
        cashierId,
        status: 'OPEN',
      },
      include: {
        payments: {
          where: { status: 'SUCCESS' },
        },
        cashLogs: true,
      },
    });

    if (!session) {
      throw new BadRequestException('No active open register session found.');
    }

    // Compute expected cash balance
    const cashPayments = session.payments
      .filter((p) => p.paymentMethod === 'CASH')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const cashIn = session.cashLogs
      .filter((l) => l.type === 'CASH_IN')
      .reduce((sum, l) => sum + Number(l.amount), 0);

    const cashOut = session.cashLogs
      .filter((l) => l.type === 'CASH_OUT')
      .reduce((sum, l) => sum + Number(l.amount), 0);

    const expectedBalance =
      Number(session.openingBalance) + cashPayments + cashIn - cashOut;

    return this.prisma.$transaction(async (tx) => {
      const closed = await tx.pos_register_sessions.update({
        where: { id: session.id },
        data: {
          status: 'CLOSED',
          closingTime: new Date(),
          closingBalance: dto.closingBalance,
          expectedBalance,
          notes: dto.notes || null,
        },
      });

      await tx.audit_logs.create({
        data: {
          tenantId: tenantId,
          userId: cashierId,
          entity: 'PosRegisterSession',
          entityId: closed.id,
          action: 'POS_REGISTER_CLOSED',
          changes: [
            `closingBalance: ${Number(dto.closingBalance).toFixed(2)}`,
            `expectedBalance: ${this.toMoney(expectedBalance)}`,
          ],
          oldValues: {
            status: session.status,
            openingBalance: Number(session.openingBalance),
          },
          newValues: {
            status: closed.status,
            closingBalance: dto.closingBalance,
            expectedBalance,
          },
        },
      });

      return closed;
    });
  }

  async addCashLog(tenantId: string, cashierId: string, dto: CashLogDto) {
    const session = await this.prisma.pos_register_sessions.findFirst({
      where: {
        tenantId,
        cashierId,
        status: 'OPEN',
      },
    });

    if (!session) {
      throw new BadRequestException('No active open register session found.');
    }

    return this.prisma.$transaction(async (tx) => {
      const log = await tx.pos_register_cash_logs.create({
        data: {
          sessionId: session.id,
          amount: dto.amount,
          type: dto.type,
          reason: dto.reason,
        },
      });

      await tx.audit_logs.create({
        data: {
          tenantId: tenantId,
          userId: cashierId,
          entity: 'PosRegisterCashLog',
          entityId: log.id,
          action: 'POS_REGISTER_CASH_LOGGED',
          changes: [
            `type: ${dto.type}`,
            `amount: ${Number(dto.amount).toFixed(2)}`,
            `reason: ${dto.reason}`,
          ],
          newValues: {
            sessionId: session.id,
            amount: dto.amount,
            type: dto.type,
            reason: dto.reason,
          },
        },
      });

      return log;
    });
  }

  async getSessionHistory(tenantId: string) {
    return this.prisma.pos_register_sessions.findMany({
      where: { tenantId },
      include: {
        cashier: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        cashLogs: true,
        payments: true,
      },
      orderBy: { openingTime: 'desc' },
    });
  }

  private toMoney(value: number) {
    return Number(value).toFixed(2);
  }
}
