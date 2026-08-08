import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BranchMenuService } from './branch-menu.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../tenant/tenant.guard';
import { apiSuccess } from '../common/responses/api-response';

@ApiTags('Branch Menu Configuration')
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
@Controller('branches/:branchId/menu-configs')
export class BranchMenuController {
  constructor(private readonly service: BranchMenuService) {}

  @Post()
  @ApiOperation({ summary: 'Set branch price override and availability toggle' })
  async setConfig(
    @Req() req: any,
    @Param('branchId') branchId: string,
    @Body('menuItemId') menuItemId: string,
    @Body('isAvailable') isAvailable?: boolean,
    @Body('priceOverride') priceOverride?: number,
  ) {
    const tenantId = req.user.tenantId!;
    const config = await this.service.setBranchItemConfig(
      tenantId,
      branchId,
      menuItemId,
      isAvailable,
      priceOverride,
    );
    return apiSuccess(config, 'Branch menu configuration updated');
  }

  @Get()
  @ApiOperation({ summary: 'Get branch menu configurations' })
  async getConfigs(
    @Req() req: any,
    @Param('branchId') branchId: string,
  ) {
    const tenantId = req.user.tenantId!;
    const configs = await this.service.getBranchMenuConfigs(tenantId, branchId);
    return apiSuccess(configs);
  }
}
