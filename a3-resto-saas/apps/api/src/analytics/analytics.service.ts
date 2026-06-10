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

  async getKpis(user: JwtUser | undefined): Promise<KpisResponse> {
    const tenantWhere = this.getTenantWhere(user);

    const now = new Date();
    const startToday = this.startOfDay(now);

    const [
      revenueAgg,
      todayRevenueAgg,
      ordersAgg,
      todayOrdersAgg,
      customerAgg,
      avgOrderAgg,
    ] = await Promise.all([
      this.prisma.orders.aggregate({
        where: tenantWhere,
        _sum: { totalAmount: true },
      }),
      this.prisma.orders.aggregate({
        where: {
          ...tenantWhere,
          createdAt: { gte: startToday },
        },
        _sum: { totalAmount: true },
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
      this.prisma.orders.aggregate({
        where: tenantWhere,
        _avg: { totalAmount: true },
      }),
    ]);

    const totalRevenue = revenueAgg._sum.totalAmount;
    const todayRevenue = todayRevenueAgg._sum.totalAmount;

    const totalOrders = ordersAgg._count.id;
    const todayOrders = todayOrdersAgg._count.id;

    const activeCustomers = customerAgg.length;

    const averageOrderValue = avgOrderAgg._avg.totalAmount;

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

    const daily = await this.prisma.orders.groupBy({
      by: ['createdAt'],
      where: {
        ...tenantWhere,
        createdAt: { gte: dailyStart, lte: now },
      },
      _sum: { totalAmount: true },
      orderBy: { createdAt: 'asc' },
    });

    const dailyMapped: RevenueBucket[] = daily
      .map((row) => ({
        label: this.formatDay(row.createdAt),
        revenue: String(row._sum.totalAmount ?? 0),
      }))
      .filter((x) => x.revenue !== undefined);

    // Weekly + Monthly: bucket labels computed from date parts.
    // Prisma doesn't do arbitrary date trunc across all versions; do bucketing in app.
    const weeklyOrders = await this.prisma.orders.findMany({
      where: {
        ...tenantWhere,
        createdAt: { gte: weeklyStart, lte: now },
      },
      select: { createdAt: true, totalAmount: true },
    });

    const weeklyMap = new Map<string, Prisma.Decimal>();

    for (const o of weeklyOrders) {
      const d = o.createdAt;
      // week label: YYYY-WW
      const week = this.getISOWeek(d);
      const label = `${week.year}-W${String(week.week).padStart(2, '0')}`;
      const prev = weeklyMap.get(label) ?? new Prisma.Decimal(0);
      const next = prev.add(o.totalAmount);

      weeklyMap.set(label, next);
    }

    const weeklyArr = Array.from(weeklyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-5)
      .map(([label, revenue]) => ({ label, revenue: String(revenue ?? 0) }));

    const monthlyOrders = await this.prisma.orders.findMany({
      where: {
        ...tenantWhere,
        createdAt: { gte: monthlyStart, lte: now },
      },
      select: { createdAt: true, totalAmount: true },
    });

    const monthlyMap = new Map<string, Prisma.Decimal>();
    for (const o of monthlyOrders) {
      const d = o.createdAt;
      const label = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const prev = monthlyMap.get(label) ?? new Prisma.Decimal(0);
      const next = prev.add(o.totalAmount);
      monthlyMap.set(label, next);
    }

    const monthlyArr = Array.from(monthlyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-4)
      .map(([label, revenue]) => ({ label, revenue: String(revenue ?? 0) }));

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

    // Aggregate by menu item using order_items.
    // We'll compute top/lowest by quantity within tenant.
    const orderItems = await this.prisma.order_items.groupBy({
      by: ['menuItemId'],
      where: {
        orders: {
          ...tenantWhere,
        },
      },
      _sum: { quantity: true, price: true },
      _count: { id: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 50,
    });

    const menuIds = orderItems.map((r) => r.menuItemId);
    const items = await this.prisma.menu_items.findMany({
      where: {
        restaurantId: tenantWhere.restaurantId ?? undefined,
        id: { in: menuIds },
      },
      select: { id: true, name: true },
    });
    const nameById = new Map(items.map((i) => [i.id, i.name]));

    const normalized: MenuItemAgg[] = orderItems.map((r) => ({
      menuItemId: r.menuItemId,
      name: nameById.get(r.menuItemId) ?? 'Unknown',
      quantity: r._sum.quantity ?? 0,
      revenue: String((r._sum.price ?? new Prisma.Decimal(0)) as any),
    }));

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
