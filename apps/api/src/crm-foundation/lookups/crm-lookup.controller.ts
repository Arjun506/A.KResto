import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PublicTenant } from '../../tenant/public-tenant.decorator';

@ApiTags('CRM Foundation — Reference Lookups')
@PublicTenant()
@Controller('crm-lookups')
export class CrmLookupController {
  @Get('lead-statuses')
  @ApiOperation({ summary: 'Get lead status classification codes' })
  getLeadStatuses() {
    return ['NEW', 'CONTACTED', 'QUALIFIED', 'UNQUALIFIED'].map((code) => ({
      code,
      label: code,
    }));
  }

  @Get('opportunity-stages')
  @ApiOperation({ summary: 'Get opportunity pipeline milestone stages' })
  getOpportunityStages() {
    return [
      'PROSPECTING',
      'QUALIFICATION',
      'PROPOSAL',
      'NEGOTIATION',
      'WON',
      'LOST',
    ].map((code) => ({ code, label: code }));
  }

  @Get('ticket-statuses')
  @ApiOperation({ summary: 'Get support ticket state codes' })
  getTicketStatuses() {
    return ['NEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map(
      (code) => ({ code, label: code }),
    );
  }

  @Get('case-types')
  @ApiOperation({ summary: 'Get CRM case categories' })
  getCaseTypes() {
    return ['COMPLAINT', 'INQUIRY', 'REQUEST', 'INCIDENT', 'ESCALATION'].map(
      (code) => ({ code, label: code }),
    );
  }
}
