import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  ParseFloatPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BranchService } from './branch.service';
import { CreateBranchDto, UpdateBranchDto } from './dto/create-branch.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../tenant/tenant.guard';
import { apiSuccess } from '../common/responses/api-response';
import { PublicTenant } from '../tenant/public-tenant.decorator';

@ApiTags('Branch Management')
@Controller('branches')
export class BranchController {
  constructor(private readonly service: BranchService) {}

  @Post()
  @UseGuards(JwtAuthGuard, TenantGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new branch / outlet' })
  async createBranch(
    @Req() req: any,
    @Body() dto: CreateBranchDto,
  ) {
    const tenantId = req.user.tenantId!;
    const branch = await this.service.createBranch(tenantId, dto);
    return apiSuccess(branch, 'Branch created successfully');
  }

  @Get()
  @UseGuards(JwtAuthGuard, TenantGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List tenant branches / outlets' })
  async listBranches(
    @Req() req: any,
    @Query('status') status?: string,
    @Query('industryType') industryType?: string,
  ) {
    const tenantId = req.user.tenantId!;
    const branches = await this.service.listBranches(tenantId, { status, industryType });
    return apiSuccess(branches);
  }

  @Get('nearby')
  @PublicTenant()
  @ApiOperation({ summary: 'Discover nearby branches for customer platform & AI Buddy' })
  async findNearby(
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
    @Query('radiusKm') radiusKm?: number,
    @Query('industryType') industryType?: string,
  ) {
    const radius = radiusKm ? Number(radiusKm) : 10;
    const branches = await this.service.findNearbyBranches(latitude, longitude, radius, industryType);
    return apiSuccess(branches);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, TenantGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get branch details by ID' })
  async getBranchById(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    const tenantId = req.user.tenantId!;
    const branch = await this.service.getBranchById(tenantId, id);
    return apiSuccess(branch);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, TenantGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update branch information' })
  async updateBranch(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateBranchDto,
  ) {
    const tenantId = req.user.tenantId!;
    const updated = await this.service.updateBranch(tenantId, id, dto);
    return apiSuccess(updated, 'Branch updated successfully');
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, TenantGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate or deactivate branch' })
  async updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    const tenantId = req.user.tenantId!;
    const updated = await this.service.updateBranchStatus(tenantId, id, status);
    return apiSuccess(updated, `Branch status updated to ${status}`);
  }
}
