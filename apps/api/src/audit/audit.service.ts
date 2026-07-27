import { Injectable, Logger } from '@nestjs/common';
import { AuditRepository, CreateAuditLogPayload } from './audit.repository';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly repo: AuditRepository) {}

  async logEvent(payload: CreateAuditLogPayload) {
    try {
      return await this.repo.create(payload);
    } catch (err) {
      this.logger.error('[AuditService] Failed to record audit log:', err);
    }
  }

  async getAuditLogs(query: QueryAuditLogDto) {
    const { items, total } = await this.repo.findLogs(query);
    const page = query.page || 1;
    const limit = query.limit || 20;

    return {
      items,
      totalItems: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }
}
