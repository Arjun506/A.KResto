import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';

export interface CreateAuditLogPayload {
  tenantId: string;
  userId?: string;
  entity: string;
  entityId: string;
  action: string;
  changes?: string[];
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateAuditLogPayload) {
    return this.prisma.audit_logs.create({
      data: {
        tenantId: payload.tenantId,
        userId: payload.userId,
        entity: payload.entity,
        entityId: payload.entityId,
        action: payload.action,
        changes: payload.changes || [],
        oldValues: payload.oldValues,
        newValues: payload.newValues,
        ipAddress: payload.ipAddress,
        userAgent: payload.userAgent,
      },
    });
  }

  async findLogs(query: QueryAuditLogDto) {
    const where: any = {};
    if (query.tenantId) where.tenantId = query.tenantId;
    if (query.userId) where.userId = query.userId;
    if (query.entity) where.entity = query.entity;
    if (query.action) where.action = query.action;

    const skip = ((query.page || 1) - 1) * (query.limit || 20);
    const take = query.limit || 20;

    const [items, total] = await Promise.all([
      this.prisma.audit_logs.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.audit_logs.count({ where }),
    ]);

    return { items, total };
  }
}
