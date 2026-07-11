import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import type { JwtUser } from '../common/types/jwt-user.interface';

type TenantWhere = { restaurantId?: string };

type KpisResponse = {
  totalRevenue: string;
  todayRevenue: string;
  totalOrders: number;
  todayOrders: number;
  activeCustomers: number;
  averageOrderValue: string;
};

type RevenueBucket = { label: string; revenue: string };

type RevenueResponse = {
  daily: RevenueBucket[];
  weekly: RevenueBucket[];
  monthly: RevenueBucket[];
};

type OrdersByStatus = Array<{ status: string; count: number }>;

type OrdersByDay = Array<{ day: string; count: number }>;

type OrdersResponse = {
  ordersByStatus: OrdersByStatus;
  ordersByDay: OrdersByDay;
};

type MenuItemAgg = {
  menuItemId: string;
  name: string;
  quantity: number;
  revenue: string;
};

type MenuResponse = {
  topSellingItems: MenuItemAgg[];
  lowestSellingItems: MenuItemAgg[];
};

type RevenuePayment = {
  createdAt: Date;
  amount: Prisma.Decimal;
};

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  private isSuperAdmin(user: JwtUser | undefined): boolean {
    return user?.role === 'SUPER_ADMIN';
  }

  private getTenantWhere(user: JwtUser | undefined): TenantWhere {
    if (this.isSuperAdmin(user)) return {};
    if (!user?.restaurantId) {
      // TenantGuard should already protect this, but keep safety.
      return {};
    }
    return { restaurantId: user.restaurantId };
  }

  private startOfDay(d: Date): Date {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  private addDays(d: Date, days: number): Date {
    const x = new Date(d);
    x.setDate(x.getDate() + days);
    return x;
  }

  private formatDay(d: Date): string {
    // Mon/Tue/.. based on server locale; stable enough for UI labels.
    return d.toLocaleDateString(undefined, { weekday: 'short' });
  }

  private getPaymentWhere(
    tenantWhere: TenantWhere,
    createdAt?: Prisma.DateTimeFilter<'order_payments'>,
  ): Prisma.order_paymentsWhereInput {
    return {
      status: 'SUCCESS',
      createdAt,
      order: tenantWhere,
    };
  }

  private bucketPaymentRevenue(
    payments: RevenuePayment[],
    getLabel: (date: Date) => string,
    take: number,
  ): RevenueBucket[] {
    const buckets = new Map<string, Prisma.Decimal>();

    for (const payment of payments) {
      const label = getLabel(payment.createdAt);
      const prev = buckets.get(label) ?? new Prisma.Decimal(0);
      buckets.set(label, prev.add(payment.amount));
    }

    return Array.from(buckets.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-take)
      .map(([label, revenue]) => ({ label, revenue: String(revenue) }));
  }

  async getKpis(user: JwtUser | undefined): Promise<KpisResponse> {
    const tenantWhere = this.getTenantWhere(user);

    const now = new Date();
    const startToday = this.startOfDay(now);

    const [
      paymentAgg,
      todayPaymentAgg,
      ordersAgg,
      todayOrdersAgg,
      customerAgg,
    ] = await Promise.all([
      this.prisma.order_payments.aggregate({
        where: this.getPaymentWhere(tenantWhere),
        _sum: { amount: true },
        _avg: { amount: true },
      }),
      this.prisma.order_payments.aggregate({
        where: this.getPaymentWhere(tenantWhere, { gte: startToday }),
        _sum: { amount: true },
      }),
      this.prisma.orders.aggregate({
        where: tenantWhere,
        _count: { id: true },
      }),
      this.prisma.orders.aggregate({
        where: {
          ...tenantWhere,
          createdAt: { gte: startToday },
        },
        _count: { id: true },
      }),
      // Customers with any historic order (unique customerName+phone fallback).
      this.prisma.orders.findMany({
        where: tenantWhere,
        select: { customerName: true, customerPhone: true },
        distinct: ['customerName', 'customerPhone'],
      }),
    ]);

    const totalRevenue = paymentAgg._sum.amount;
    const todayRevenue = todayPaymentAgg._sum.amount;

    const totalOrders = ordersAgg._count.id;
    const todayOrders = todayOrdersAgg._count.id;

    const activeCustomers = customerAgg.length;

    const averageOrderValue = paymentAgg._avg.amount;

    return {
      totalRevenue: String(totalRevenue ?? 0),
      todayRevenue: String(todayRevenue ?? 0),
      totalOrders,
      todayOrders,
      activeCustomers,
      averageOrderValue: String(averageOrderValue ?? 0),
    };
  }

  async getRevenue(user: JwtUser | undefined): Promise<RevenueResponse> {
    const tenantWhere = this.getTenantWhere(user);

    const now = new Date();

    const dailyStart = this.addDays(this.startOfDay(now), -6);
    const weeklyStart = this.addDays(this.startOfDay(now), -27);
    const monthlyStart = this.addDays(this.startOfDay(now), -89);

    const dailyPayments = await this.prisma.order_payments.findMany({
      where: this.getPaymentWhere(tenantWhere, { gte: dailyStart, lte: now }),
      select: { createdAt: true, amount: true },
      orderBy: { createdAt: 'asc' },
    });

    const dailyMapped = this.bucketPaymentRevenue(
      dailyPayments,
      (date) => this.formatDay(date),
      7,
    );

    // Weekly + Monthly: bucket labels computed from date parts.
    // Prisma doesn't do arbitrary date trunc across all versions; do bucketing in app.
    const weeklyPayments = await this.prisma.order_payments.findMany({
      where: this.getPaymentWhere(tenantWhere, { gte: weeklyStart, lte: now }),
      select: { createdAt: true, amount: true },
      orderBy: { createdAt: 'asc' },
    });

    const weeklyArr = this.bucketPaymentRevenue(
      weeklyPayments,
      (date) => {
        const week = this.getISOWeek(date);
        return `${week.year}-W${String(week.week).padStart(2, '0')}`;
      },
      5,
    );

    const monthlyPayments = await this.prisma.order_payments.findMany({
      where: this.getPaymentWhere(tenantWhere, { gte: monthlyStart, lte: now }),
      select: { createdAt: true, amount: true },
      orderBy: { createdAt: 'asc' },
    });

    const monthlyArr = this.bucketPaymentRevenue(
      monthlyPayments,
      (date) =>
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      4,
    );

    return {
      daily: dailyMapped.slice(-7),
      weekly: weeklyArr,
      monthly: monthlyArr,
    };
  }

  async getOrders(user: JwtUser | undefined): Promise<OrdersResponse> {
    const tenantWhere = this.getTenantWhere(user);

    const ordersByStatusRows = await this.prisma.orders.groupBy({
      by: ['status'],
      where: tenantWhere,
      _count: { id: true },
      orderBy: { status: 'asc' },
    });

    const ordersByStatus: OrdersByStatus = ordersByStatusRows.map((r) => ({
      status: String(r.status),
      count: r._count.id,
    }));

    const now = new Date();
    const start = this.addDays(this.startOfDay(now), -13);

    const orders = await this.prisma.orders.findMany({
      where: {
        ...tenantWhere,
        createdAt: { gte: start, lte: now },
      },
      select: { createdAt: true, id: true },
      orderBy: { createdAt: 'asc' },
    });

    const byDay = new Map<string, number>();
    for (const o of orders) {
      const d = o.createdAt;
      const key = d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      byDay.set(key, (byDay.get(key) ?? 0) + 1);
    }

    const ordersByDay: OrdersByDay = Array.from(byDay.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-7)
      .map(([day, count]) => ({ day, count }));

    return { ordersByStatus, ordersByDay };
  }

  async getMenu(user: JwtUser | undefined): Promise<MenuResponse> {
    const tenantWhere = this.getTenantWhere(user);

    const orderItems = await this.prisma.order_items.findMany({
      where: {
        orders: {
          ...tenantWhere,
          payments: { some: { status: 'SUCCESS' } },
        },
      },
      select: {
        menuItemId: true,
        quantity: true,
        price: true,
        menu_items: { select: { name: true } },
      },
    });

    const byMenuItem = new Map<string, MenuItemAgg & { revenueValue: Prisma.Decimal }>();
    for (const item of orderItems) {
      const existing =
        byMenuItem.get(item.menuItemId) ??
        ({
          menuItemId: item.menuItemId,
          name: item.menu_items.name,
          quantity: 0,
          revenue: '0',
          revenueValue: new Prisma.Decimal(0),
        } satisfies MenuItemAgg & { revenueValue: Prisma.Decimal });

      existing.quantity += item.quantity;
      existing.revenueValue = existing.revenueValue.add(
        item.price.mul(item.quantity),
      );
      existing.revenue = String(existing.revenueValue);
      byMenuItem.set(item.menuItemId, existing);
    }

    const normalized: MenuItemAgg[] = Array.from(byMenuItem.values()).map(
      ({ revenueValue: _revenueValue, ...item }) => item,
    );

    const topSellingItems = normalized
      .slice()
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const lowestSellingItems = normalized
      .slice()
      .sort((a, b) => a.quantity - b.quantity)
      .slice(0, 5);

    return { topSellingItems, lowestSellingItems };
  }

  private getISOWeek(date: Date): { year: number; week: number } {
    // Copy date so don't modify original
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
    // Set to nearest Thursday: current date + 4 - current day number
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(
      ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
    );
    return { year: d.getUTCFullYear(), week: weekNo };
  }
}
