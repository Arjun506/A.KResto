import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../tenant/tenant.guard';
import { apiSuccess } from '../common/responses/api-response';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.interface';
import { BusinessService } from './business.service';
import { CheckNameQueryDto } from './dto/check-name-query.dto';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { RegisterBusinessDto } from './dto/register-business.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  // ─────────────────────────────────────────────
  // PUBLIC: Workspace Provisioning (Milestone 1B)
  // ─────────────────────────────────────────────

  @Post('workspace')
  async createWorkspace(@Body() dto: CreateWorkspaceDto) {
    // Delegate to WorkspaceProvisioningService (transactional pipeline engine)
    const data = await this.businessService.createWorkspace(dto);
    return apiSuccess(data, 'Business workspace provisioned successfully');
  }

  @Get('check-name')
  async checkBusinessName(@Query() query: CheckNameQueryDto) {
    const data = await this.businessService.checkBusinessName(query.name);
    return apiSuccess(data);
  }

  @Get('industries')
  getIndustries() {
    const data = this.businessService.getIndustries();
    return apiSuccess(data);
  }

  @Get('currencies')
  getCurrencies() {
    const data = this.businessService.getCurrencies();
    return apiSuccess(data);
  }

  @Get('timezones')
  getTimezones() {
    const data = this.businessService.getTimezones();
    return apiSuccess(data);
  }

  /** @deprecated Use POST /business/workspace */
  @Post('register')
  async register(@Body() dto: RegisterBusinessDto) {
    const data = await this.businessService.register(dto);
    return apiSuccess(data, 'Business registered successfully');
  }

  // ─────────────────────────────────────────────
  // PROTECTED: Settings
  // ─────────────────────────────────────────────

  @Get('launch-status')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async getLaunchStatus(@Req() req: AuthenticatedRequest) {
    const tenantId = this.resolveTenantId(req);
    const data = await this.businessService.getLaunchStatus(tenantId);
    return apiSuccess(data);
  }

  @Get('settings')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async getSettings(@Req() req: AuthenticatedRequest) {
    const tenantId = this.resolveTenantId(req);
    const data = await this.businessService.getSettings(tenantId);
    return apiSuccess(data);
  }

  @Patch('settings')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async updateSettings(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateSettingsDto,
  ) {
    const tenantId = this.resolveTenantId(req);
    const data = await this.businessService.updateSettings(tenantId, dto);
    return apiSuccess(data, 'Business settings updated');
  }

  // ─────────────────────────────────────────────
  // PROTECTED: Subscription
  // ─────────────────────────────────────────────

  @Get('subscription')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async getSubscription(@Req() req: AuthenticatedRequest) {
    const tenantId = this.resolveTenantId(req);
    const data = await this.businessService.getSubscription(tenantId);
    return apiSuccess(data);
  }

  // ─────────────────────────────────────────────
  // PROTECTED: Branch Management
  // ─────────────────────────────────────────────

  @Get('branches')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async getBranches(@Req() req: AuthenticatedRequest) {
    const tenantId = this.resolveTenantId(req);
    const data = await this.businessService.getBranches(tenantId);
    return apiSuccess(data);
  }

  @Post('branches')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async createBranch(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateBranchDto,
  ) {
    const tenantId = this.resolveTenantId(req);
    const data = await this.businessService.createBranch(tenantId, dto);
    return apiSuccess(data, 'Branch created successfully');
  }

  @Patch('branches/:id')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async updateBranch(
    @Req() req: AuthenticatedRequest,
    @Param('id') branchId: string,
    @Body() dto: UpdateBranchDto,
  ) {
    const tenantId = this.resolveTenantId(req);
    const data = await this.businessService.updateBranch(
      tenantId,
      branchId,
      dto,
    );
    return apiSuccess(data, 'Branch updated successfully');
  }

  // ─────────────────────────────────────────────
  // PROTECTED: Capability Feature Registry
  // ─────────────────────────────────────────────

  @Get('features')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async getFeatures(@Req() req: AuthenticatedRequest) {
    const tenantId = this.resolveTenantId(req);
    const data = await this.businessService.getFeatures(tenantId);
    return apiSuccess(data);
  }

  @Patch('features/:key')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async updateFeature(
    @Req() req: AuthenticatedRequest,
    @Param('key') featureKey: string,
    @Body() dto: UpdateFeatureDto,
  ) {
    const tenantId = this.resolveTenantId(req);
    const data = await this.businessService.updateFeature(
      tenantId,
      featureKey,
      dto,
    );
    return apiSuccess(data, `Feature "${featureKey}" updated`);
  }

  private resolveTenantId(req: AuthenticatedRequest): string {
    if (!req.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return req.tenantId;
  }
}
