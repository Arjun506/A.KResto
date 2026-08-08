import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BranchInventoryService } from './branch-inventory.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../tenant/tenant.guard';
import { apiSuccess } from '../common/responses/api-response';

@ApiTags('Branch Inventory & Inter-Branch Transfers')
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
@Controller()
export class BranchInventoryController {
  constructor(private readonly service: BranchInventoryService) {}

  @Get('branches/:branchId/inventory')
  @ApiOperation({ summary: 'Get stock levels by branch' })
  async getBranchInventory(
    @Req() req: any,
    @Param('branchId') branchId: string,
  ) {
    const tenantId = req.user.tenantId!;
    const items = await this.service.getBranchInventory(tenantId, branchId);
    return apiSuccess(items);
  }

  @Get('branches/:branchId/inventory/low-stock')
  @ApiOperation({ summary: 'Get low-stock inventory alerts by branch' })
  async getLowStockByBranch(
    @Req() req: any,
    @Param('branchId') branchId: string,
  ) {
    const tenantId = req.user.tenantId!;
    const items = await this.service.getLowStockByBranch(tenantId, branchId);
    return apiSuccess(items);
  }

  @Post('inventory/transfers')
  @ApiOperation({ summary: 'Create inter-branch inventory transfer request' })
  async createTransfer(
    @Req() req: any,
    @Body() dto: CreateTransferDto,
  ) {
    const tenantId = req.user.tenantId!;
    const userId = req.user.id;
    const transfer = await this.service.createTransfer(tenantId, userId, dto);
    return apiSuccess(transfer, 'Transfer request created');
  }

  @Get('inventory/transfers')
  @ApiOperation({ summary: 'List inter-branch inventory transfers' })
  async listTransfers(
    @Req() req: any,
    @Query('branchId') branchId?: string,
    @Query('status') status?: string,
  ) {
    const tenantId = req.user.tenantId!;
    const transfers = await this.service.listTransfers(tenantId, branchId, status);
    return apiSuccess(transfers);
  }

  @Get('inventory/transfers/:id')
  @ApiOperation({ summary: 'Get inter-branch transfer details by ID' })
  async getTransferById(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    const tenantId = req.user.tenantId!;
    const transfer = await this.service.getTransferById(tenantId, id);
    return apiSuccess(transfer);
  }

  @Post('inventory/transfers/:id/approve')
  @ApiOperation({ summary: 'Approve inventory transfer' })
  async approveTransfer(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    const tenantId = req.user.tenantId!;
    const userId = req.user.id;
    const transfer = await this.service.approveTransfer(tenantId, userId, id);
    return apiSuccess(transfer, 'Transfer approved');
  }

  @Post('inventory/transfers/:id/ship')
  @ApiOperation({ summary: 'Ship inventory transfer (deducts stock from source branch)' })
  async shipTransfer(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    const tenantId = req.user.tenantId!;
    const userId = req.user.id;
    const transfer = await this.service.shipTransfer(tenantId, userId, id);
    return apiSuccess(transfer, 'Transfer shipped and stock deducted from source branch');
  }

  @Post('inventory/transfers/:id/receive')
  @ApiOperation({ summary: 'Receive inventory transfer (adds stock to destination branch)' })
  async receiveTransfer(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    const tenantId = req.user.tenantId!;
    const userId = req.user.id;
    const transfer = await this.service.receiveTransfer(tenantId, userId, id);
    return apiSuccess(transfer, 'Transfer received and stock added to destination branch');
  }

  @Post('inventory/transfers/:id/cancel')
  @ApiOperation({ summary: 'Cancel inventory transfer' })
  async cancelTransfer(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    const tenantId = req.user.tenantId!;
    const userId = req.user.id;
    const transfer = await this.service.cancelTransfer(tenantId, userId, id);
    return apiSuccess(transfer, 'Transfer cancelled');
  }
}
