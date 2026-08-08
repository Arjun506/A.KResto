import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WorkforceService } from './workforce.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { ClockInDto } from './dto/clock-in.dto';
import { CreateShiftDto } from './dto/create-shift.dto';
import { ApplyLeaveDto } from './dto/apply-leave.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequirePermission } from '../auth/require-permission.decorator';
import { apiSuccess } from '../common/responses/api-response';

@ApiTags('Workforce & Attendance')
@Controller('workforce')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WorkforceController {
  constructor(private readonly service: WorkforceService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get workforce KPI summary metrics' })
  async getSummary(
    @Req() req: any,
    @Query('branchId') branchId?: string,
  ) {
    const tenantId = req.user.tenantId || 'global';
    const data = await this.service.getWorkforceSummary(tenantId, branchId);
    return apiSuccess(data);
  }

  @Get('employees')
  @RequirePermission('staff:read')
  async getEmployees(
    @Req() req: any,
    @Query('branchId') branchId?: string,
    @Query('status') status?: string,
  ) {
    const tenantId = req.user.tenantId || 'global';
    const data = await this.service.getEmployees(tenantId, branchId, status);
    return apiSuccess(data, 'Employees retrieved successfully');
  }

  @Post('employees')
  @RequirePermission('staff:write')
  async createEmployee(@Req() req: any, @Body() dto: CreateEmployeeDto) {
    const tenantId = req.user.tenantId || 'global';
    const data = await this.service.createEmployee(tenantId, dto);
    return apiSuccess(data, 'Employee registered successfully');
  }

  @Get('employees/:id')
  @RequirePermission('staff:read')
  async getEmployee(@Req() req: any, @Param('id') id: string) {
    const tenantId = req.user.tenantId || 'global';
    const data = await this.service.getEmployee(tenantId, id);
    return apiSuccess(data, 'Employee profile retrieved successfully');
  }

  @Put('employees/:id')
  @RequirePermission('staff:write')
  async updateEmployee(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    const tenantId = req.user.tenantId || 'global';
    const data = await this.service.updateEmployee(tenantId, id, dto);
    return apiSuccess(data, 'Employee profile updated successfully');
  }

  @Delete('employees/:id')
  @RequirePermission('staff:write')
  async deleteEmployee(@Req() req: any, @Param('id') id: string) {
    const tenantId = req.user.tenantId || 'global';
    const data = await this.service.deleteEmployee(tenantId, id);
    return apiSuccess(data, 'Employee profile removed successfully');
  }

  @Post('employees/:id/branches')
  @RequirePermission('staff:write')
  @ApiOperation({ summary: 'Assign employee to secondary branch' })
  async assignBranch(
    @Req() req: any,
    @Param('id') id: string,
    @Body('branchId') branchId: string,
    @Body('isPrimary') isPrimary?: boolean,
  ) {
    const tenantId = req.user.tenantId || 'global';
    const data = await this.service.assignBranch(tenantId, id, branchId, isPrimary);
    return apiSuccess(data, 'Branch assigned to employee');
  }

  @Delete('employees/:id/branches/:branchId')
  @RequirePermission('staff:write')
  @ApiOperation({ summary: 'Remove branch assignment from employee' })
  async removeBranchAssignment(
    @Req() req: any,
    @Param('id') id: string,
    @Param('branchId') branchId: string,
  ) {
    const tenantId = req.user.tenantId || 'global';
    await this.service.removeBranchAssignment(tenantId, id, branchId);
    return apiSuccess(null, 'Branch assignment removed');
  }

  @Post('attendance/clock-in')
  async clockIn(@Req() req: any, @Body() dto: ClockInDto) {
    const tenantId = req.user.tenantId || 'global';
    const data = await this.service.clockIn(tenantId, req.user.id, dto);
    return apiSuccess(data, 'Clocked in successfully');
  }

  @Post('attendance/clock-in-employee')
  @RequirePermission('staff:write')
  async clockInEmployee(
    @Req() req: any,
    @Body() dto: { employeeId: string; latitude?: number; longitude?: number },
  ) {
    const tenantId = req.user.tenantId || 'global';
    const data = await this.service.clockInEmployee(
      tenantId,
      dto.employeeId,
      dto.latitude,
      dto.longitude,
    );
    return apiSuccess(data, 'Employee clocked in successfully');
  }

  @Post('attendance/clock-out')
  async clockOut(@Req() req: any) {
    const tenantId = req.user.tenantId || 'global';
    const data = await this.service.clockOut(tenantId, req.user.id);
    return apiSuccess(data, 'Clocked out successfully');
  }

  @Post('attendance/clock-out-employee')
  @RequirePermission('staff:write')
  async clockOutEmployee(@Req() req: any, @Body() dto: { employeeId: string }) {
    const tenantId = req.user.tenantId || 'global';
    const data = await this.service.clockOutEmployee(tenantId, dto.employeeId);
    return apiSuccess(data, 'Employee clocked out successfully');
  }

  @Get('attendance/today')
  async getTodayAttendance(@Req() req: any) {
    const tenantId = req.user.tenantId || 'global';
    const data = await this.service.getTodayAttendance(tenantId, req.user.id);
    return apiSuccess(data, 'Today attendance status retrieved');
  }

  @Get('attendance/history')
  async getAttendanceHistory(
    @Req() req: any,
    @Query('employeeId') employeeId?: string,
  ) {
    const tenantId = req.user.tenantId || 'global';
    const data = await this.service.getAttendanceHistory(tenantId, employeeId);
    return apiSuccess(data, 'Attendance history logs retrieved');
  }

  @Get('shifts')
  @RequirePermission('staff:read')
  async getShifts(
    @Req() req: any,
    @Query('branchId') branchId?: string,
    @Query('shiftDate') shiftDate?: string,
  ) {
    const tenantId = req.user.tenantId || 'global';
    const data = await this.service.getShifts(tenantId, branchId, shiftDate);
    return apiSuccess(data, 'Shifts roster retrieved successfully');
  }

  @Post('shifts')
  @RequirePermission('staff:write')
  async upsertShift(@Req() req: any, @Body() dto: CreateShiftDto) {
    const tenantId = req.user.tenantId || 'global';
    const data = await this.service.upsertShift(tenantId, dto);
    return apiSuccess(data, 'Shift schedule configured successfully');
  }

  @Delete('shifts/:id')
  @RequirePermission('staff:write')
  async deleteShift(@Req() req: any, @Param('id') id: string) {
    const tenantId = req.user.tenantId || 'global';
    await this.service.deleteShift(tenantId, id);
    return apiSuccess(null, 'Shift assignment removed');
  }

  @Post('leaves')
  async applyLeave(@Req() req: any, @Body() dto: ApplyLeaveDto) {
    const tenantId = req.user.tenantId || 'global';
    const data = await this.service.applyLeave(tenantId, req.user.id, dto);
    return apiSuccess(data, 'Leave application submitted');
  }

  @Get('leaves')
  @RequirePermission('staff:read')
  async getLeaves(
    @Req() req: any,
    @Query('status') status?: string,
  ) {
    const tenantId = req.user.tenantId || 'global';
    const data = await this.service.getLeaves(tenantId, status);
    return apiSuccess(data, 'Leaves log retrieved successfully');
  }

  @Patch('leaves/:id/status')
  @RequirePermission('staff:write')
  async updateLeaveStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    const tenantId = req.user.tenantId || 'global';
    const data = await this.service.updateLeaveStatus(
      tenantId,
      id,
      status,
      req.user.id,
    );
    return apiSuccess(data, 'Leave request status updated');
  }
}
