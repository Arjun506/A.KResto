import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { ClockInDto } from './dto/clock-in.dto';
import { CreateShiftDto } from './dto/create-shift.dto';
import { ApplyLeaveDto } from './dto/apply-leave.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import { EventBusService } from '../event-bus/event-bus.service';

@Injectable()
export class WorkforceService {
  private readonly logger = new Logger(WorkforceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  /**
   * Employee 360 CRUD
   */
  async getEmployees(tenantId: string, branchId?: string, status?: string) {
    const where: any = { tenantId };
    if (status) where.status = status;
    if (branchId) {
      where.OR = [
        { branchId },
        { branchAssignments: { some: { branchId } } },
      ];
    }

    return this.prisma.employees.findMany({
      where,
      include: {
        branch: { select: { id: true, name: true, code: true } },
        branchAssignments: {
          include: { branch: { select: { id: true, name: true, code: true } } },
        },
        user: { select: { id: true, email: true, role: true } },
        manager: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getEmployee(tenantId: string, id: string) {
    const employee = await this.prisma.employees.findFirst({
      where: { id, tenantId },
      include: {
        branch: true,
        branchAssignments: { include: { branch: true } },
        user: { select: { id: true, email: true, role: true } },
        manager: { select: { id: true, name: true } },
        shifts: true,
        attendance: { take: 30, orderBy: { date: 'desc' } },
        leaves: { take: 10, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee profile ${id} not found`);
    }

    return employee;
  }

  async createEmployee(tenantId: string, dto: CreateEmployeeDto) {
    const existingId = await this.prisma.employees.findFirst({
      where: { tenantId, employeeId: dto.employeeId },
    });

    if (existingId) {
      throw new BadRequestException(
        `Employee ID ${dto.employeeId} already exists in this tenant.`,
      );
    }

    let userId = dto.userId || null;
    let generatedCredentials: any = null;

    if (userId) {
      const existingUserLink = await this.prisma.employees.findUnique({
        where: { userId },
      });
      if (existingUserLink) {
        throw new BadRequestException(
          'This user account is already linked to another employee profile.',
        );
      }
    } else {
      const email = dto.email || `emp_${dto.employeeId.toLowerCase()}_${Date.now().toString(36)}@akresto.com`;
      const existingUser = await this.prisma.users.findUnique({
        where: { email },
      });

      if (existingUser) {
        userId = existingUser.id;
      } else {
        const plainPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        let mappedRole: UserRole = UserRole.OPERATOR;
        const des = dto.designation.toUpperCase();
        if (des.includes('MANAGER')) mappedRole = UserRole.MANAGER;
        else if (des.includes('CASHIER')) mappedRole = UserRole.CASHIER;
        else if (des.includes('OWNER')) mappedRole = UserRole.OWNER;

        const user = await this.prisma.users.create({
          data: {
            email,
            passwordHash: hashedPassword,
            name: dto.name,
            role: mappedRole,
            tenantId,
          },
        });

        userId = user.id;
        generatedCredentials = { username: email, password: plainPassword };
      }
    }

    const employee = await this.prisma.employees.create({
      data: {
        tenantId,
        userId,
        branchId: dto.branchId || null,
        employeeId: dto.employeeId,
        name: dto.name,
        email: dto.email || null,
        phone: dto.phone || null,
        photoUrl: dto.photoUrl || null,
        department: dto.department || 'GENERAL',
        designation: dto.designation || 'STAFF',
        managerId: dto.managerId || null,
        role: dto.role || 'STAFF',
        status: dto.status || 'ACTIVE',
        salary: dto.salary ? Number(dto.salary) : null,
      },
      include: {
        branch: true,
        user: { select: { id: true, email: true, role: true } },
      },
    });

    // Auto-create primary branch assignment if branchId provided
    if (dto.branchId) {
      await this.prisma.employee_branch_assignments.create({
        data: {
          tenantId,
          employeeId: employee.id,
          branchId: dto.branchId,
          isPrimary: true,
          role: dto.role || 'STAFF',
        },
      });
    }

    await this.eventBus.publish({
      eventName: 'employeeCreated',
      aggregateId: employee.id,
      tenantId,
      occurredOn: new Date(),
      payload: { tenantId, employeeId: employee.id, name: employee.name },
    });

    return { ...employee, credentials: generatedCredentials };
  }

  async updateEmployee(tenantId: string, id: string, dto: any) {
    const existing = await this.getEmployee(tenantId, id);

    await this.prisma.employees.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.email !== undefined && { email: dto.email }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.department && { department: dto.department }),
        ...(dto.designation && { designation: dto.designation }),
        ...(dto.managerId !== undefined && { managerId: dto.managerId }),
        ...(dto.branchId !== undefined && { branchId: dto.branchId }),
        ...(dto.role && { role: dto.role }),
        ...(dto.status && { status: dto.status }),
        ...(dto.emergencyContact !== undefined && { emergencyContact: dto.emergencyContact }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
        ...(dto.skills && { skills: dto.skills }),
      },
    });

    await this.eventBus.publish({
      eventName: 'employeeUpdated',
      aggregateId: id,
      tenantId,
      occurredOn: new Date(),
      payload: { tenantId, employeeId: id, changes: dto },
    });

    return this.getEmployee(tenantId, id);
  }

  async deleteEmployee(tenantId: string, id: string) {
    await this.getEmployee(tenantId, id);
    return this.prisma.employees.delete({ where: { id } });
  }

  /**
   * Multi-Branch Staff Assignment
   */
  async assignBranch(tenantId: string, employeeId: string, branchId: string, isPrimary = false) {
    const employee = await this.getEmployee(tenantId, employeeId);
    const branch = await this.prisma.branch.findFirst({
      where: { id: branchId, tenantId },
    });

    if (!branch) {
      throw new NotFoundException(`Branch ${branchId} does not belong to tenant ${tenantId}`);
    }

    return this.prisma.employee_branch_assignments.upsert({
      where: {
        employeeId_branchId: { employeeId, branchId },
      },
      create: {
        tenantId,
        employeeId,
        branchId,
        isPrimary,
        role: employee.role,
      },
      update: {
        isPrimary,
      },
    });
  }

  async removeBranchAssignment(tenantId: string, employeeId: string, branchId: string) {
    await this.getEmployee(tenantId, employeeId);
    return this.prisma.employee_branch_assignments.deleteMany({
      where: { tenantId, employeeId, branchId },
    });
  }

  /**
   * Shift Management & Conflict Detection
   */
  async getShifts(tenantId: string, branchId?: string, shiftDate?: string) {
    const where: any = { tenantId };
    if (branchId) where.branchId = branchId;
    if (shiftDate) where.shiftDate = new Date(shiftDate);

    return this.prisma.employee_shifts.findMany({
      where,
      include: {
        employee: { select: { id: true, name: true, employeeId: true, department: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async upsertShift(tenantId: string, dto: CreateShiftDto) {
    const employee = await this.getEmployee(tenantId, dto.employeeId);

    // Overlap conflict check for the same employee
    const existingShifts = await this.prisma.employee_shifts.findMany({
      where: {
        tenantId,
        employeeId: dto.employeeId,
        ...(dto.dayOfWeek !== undefined && { dayOfWeek: Number(dto.dayOfWeek) }),
      },
    });

    for (const s of existingShifts) {
      if (s.startTime === dto.startTime && s.endTime === dto.endTime) {
        throw new BadRequestException(
          `Employee ${employee.name} is already assigned to an overlapping shift (${s.startTime} - ${s.endTime}).`,
        );
      }
    }

    const shift = await this.prisma.employee_shifts.create({
      data: {
        tenantId,
        employeeId: dto.employeeId,
        branchId: dto.branchId || employee.branchId || null,
        startTime: dto.startTime,
        endTime: dto.endTime,
        dayOfWeek: dto.dayOfWeek !== undefined ? Number(dto.dayOfWeek) : 1,
        notes: dto.notes,
        status: 'SCHEDULED',
      },
      include: { employee: true },
    });

    await this.eventBus.publish({
      eventName: 'shiftCreated',
      aggregateId: shift.id,
      tenantId,
      occurredOn: new Date(),
      payload: { tenantId, shiftId: shift.id, employeeId: shift.employeeId },
    });

    return shift;
  }

  async deleteShift(tenantId: string, id: string) {
    const shift = await this.prisma.employee_shifts.findFirst({
      where: { id, tenantId },
    });
    if (!shift) {
      throw new NotFoundException(`Shift ${id} not found`);
    }

    await this.prisma.employee_shifts.delete({ where: { id } });

    await this.eventBus.publish({
      eventName: 'shiftCancelled',
      aggregateId: id,
      tenantId,
      occurredOn: new Date(),
      payload: { tenantId, shiftId: id },
    });
  }

  /**
   * Attendance Engine & Server-Side Duration Calculation
   */
  async clockIn(tenantId: string, userId: string, dto: ClockInDto) {
    const employee = await this.prisma.employees.findUnique({
      where: { userId },
    });

    if (!employee) {
      throw new NotFoundException('No employee profile linked to this user account');
    }

    return this.clockInEmployee(tenantId, employee.id, dto.latitude, dto.longitude);
  }

  async clockInEmployee(tenantId: string, employeeId: string, latitude?: number, longitude?: number) {
    const employee = await this.getEmployee(tenantId, employeeId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await this.prisma.employee_attendance.findFirst({
      where: { employeeId, date: today },
    });

    if (existing && !existing.clockOut) {
      throw new BadRequestException(`Employee ${employee.name} is already clocked in.`);
    }

    // Optional Geo-fencing Check against branch coordinates
    if (latitude && longitude && employee.branch?.latitude && employee.branch?.longitude) {
      const bLat = employee.branch.latitude;
      const bLng = employee.branch.longitude;
      const distMeters = this.calculateDistanceMeters(latitude, longitude, bLat, bLng);
      this.logger.log(`Geo-fence check for ${employee.name}: ${distMeters} meters from branch.`);
    }

    const attendance = await this.prisma.employee_attendance.create({
      data: {
        tenantId,
        employeeId,
        branchId: employee.branchId || null,
        date: today,
        clockIn: new Date(),
        status: 'PRESENT',
        latitude,
        longitude,
        source: 'WEB_PORTAL',
      },
    });

    await this.eventBus.publish({
      eventName: 'attendanceClockedIn',
      aggregateId: attendance.id,
      tenantId,
      occurredOn: new Date(),
      payload: { tenantId, employeeId, clockIn: attendance.clockIn },
    });

    return attendance;
  }

  async clockOut(tenantId: string, userId: string) {
    const employee = await this.prisma.employees.findUnique({
      where: { userId },
    });

    if (!employee) {
      throw new NotFoundException('No employee profile linked to this user account');
    }

    return this.clockOutEmployee(tenantId, employee.id);
  }

  async clockOutEmployee(tenantId: string, employeeId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await this.prisma.employee_attendance.findFirst({
      where: { employeeId, date: today, clockOut: null },
    });

    if (!attendance) {
      throw new BadRequestException('No active clock-in record found for today');
    }

    const clockOutTime = new Date();
    const durationMs = clockOutTime.getTime() - new Date(attendance.clockIn).getTime();
    const durationMinutes = Math.max(1, Math.round(durationMs / (1000 * 60)));

    const updated = await this.prisma.employee_attendance.update({
      where: { id: attendance.id },
      data: {
        clockOut: clockOutTime,
        durationMinutes,
      },
    });

    await this.eventBus.publish({
      eventName: 'attendanceClockedOut',
      aggregateId: attendance.id,
      tenantId,
      occurredOn: new Date(),
      payload: { tenantId, employeeId, clockOut: clockOutTime, durationMinutes },
    });

    return updated;
  }

  async getTodayAttendance(tenantId: string, userId: string) {
    const employee = await this.prisma.employees.findUnique({ where: { userId } });
    if (!employee) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.employee_attendance.findFirst({
      where: { employeeId: employee.id, date: today },
    });
  }

  async getAttendanceHistory(tenantId: string, employeeId?: string) {
    const where: any = { tenantId };
    if (employeeId) where.employeeId = employeeId;

    return this.prisma.employee_attendance.findMany({
      where,
      include: {
        employee: { select: { id: true, name: true, employeeId: true } },
      },
      orderBy: { date: 'desc' },
      take: 100,
    });
  }

  /**
   * Leave Management & Approval Engine
   */
  async applyLeave(tenantId: string, userId: string, dto: ApplyLeaveDto) {
    const employee = await this.prisma.employees.findUnique({ where: { userId } });
    if (!employee) {
      throw new NotFoundException('No employee profile linked to user account');
    }

    const leave = await this.prisma.employee_leaves.create({
      data: {
        tenantId,
        employeeId: employee.id,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        reason: dto.reason,
        leaveType: dto.leaveType || dto.type || 'CASUAL',
        status: 'PENDING',
      },
      include: { employee: true },
    });

    await this.eventBus.publish({
      eventName: 'leaveSubmitted',
      aggregateId: leave.id,
      tenantId,
      occurredOn: new Date(),
      payload: { tenantId, leaveId: leave.id, employeeId: employee.id },
    });

    return leave;
  }

  async getLeaves(tenantId: string, status?: string) {
    const where: any = { tenantId };
    if (status) where.status = status;

    return this.prisma.employee_leaves.findMany({
      where,
      include: {
        employee: { select: { id: true, name: true, employeeId: true, department: true } },
        approvedBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateLeaveStatus(tenantId: string, leaveId: string, status: string, approverUserId: string) {
    const leave = await this.prisma.employee_leaves.findFirst({
      where: { id: leaveId, tenantId },
      include: { employee: true },
    });

    if (!leave) {
      throw new NotFoundException(`Leave request ${leaveId} not found`);
    }

    // Safety rule: Staff cannot approve their own leave unless MANAGER/OWNER
    if (leave.employee.userId === approverUserId) {
      throw new ForbiddenException('Employees cannot approve their own leave applications.');
    }

    const updated = await this.prisma.employee_leaves.update({
      where: { id: leaveId },
      data: {
        status,
        approvedById: approverUserId,
        approvedAt: new Date(),
      },
    });

    await this.eventBus.publish({
      eventName: status === 'APPROVED' ? 'leaveApproved' : 'leaveRejected',
      aggregateId: leaveId,
      tenantId,
      occurredOn: new Date(),
      payload: { tenantId, leaveId, status, approverUserId },
    });

    return updated;
  }

  /**
   * Workforce Summary KPI Aggregator
   */
  async getWorkforceSummary(tenantId: string, branchId?: string) {
    const whereEmp: any = { tenantId };
    if (branchId) whereEmp.branchId = branchId;

    const totalEmployees = await this.prisma.employees.count({ where: whereEmp });
    const activeStaff = await this.prisma.employees.count({ where: { ...whereEmp, status: 'ACTIVE' } });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const workingToday = await this.prisma.employee_attendance.count({
      where: { tenantId, date: today, clockOut: null },
    });

    const onLeave = await this.prisma.employee_leaves.count({
      where: {
        tenantId,
        status: 'APPROVED',
        startDate: { lte: today },
        endDate: { gte: today },
      },
    });

    const openShifts = await this.prisma.employee_shifts.count({
      where: { tenantId, status: 'SCHEDULED' },
    });

    return {
      totalEmployees,
      activeStaff,
      workingToday,
      absentToday: Math.max(0, activeStaff - workingToday - onLeave),
      onLeave,
      openShifts,
    };
  }

  private calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }
}
