import {
  BadRequestException,
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

@Injectable()
export class WorkforceService {
  private readonly logger = new Logger(WorkforceService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Employees CRUD
   */
  async getEmployees(tenantId: string) {
    return this.prisma.employees.findMany({
      where: { tenantId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async createEmployee(tenantId: string, dto: CreateEmployeeDto) {
    // Check if employeeId is unique for this tenant
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
      // Auto-provision a user account if email or phone is provided
      const email =
        dto.email || `emp_${dto.employeeId.toLowerCase()}@akresto.com`;
      const existingUser = await this.prisma.users.findUnique({
        where: { email },
      });

      if (existingUser) {
        userId = existingUser.id;
      } else {
        // Generate random initial password
        const plainPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        // Map designation to UserRole enum
        let mappedRole: UserRole = UserRole.OPERATOR;
        const des = dto.designation.toUpperCase();
        if (des.includes('MANAGER')) mappedRole = UserRole.MANAGER;
        else if (des.includes('CHEF')) mappedRole = UserRole.OPERATOR;
        else if (des.includes('CASHIER')) mappedRole = UserRole.CASHIER;
        else if (des.includes('WAITER')) mappedRole = UserRole.OPERATOR;
        else if (des.includes('OWNER')) mappedRole = UserRole.OWNER;

        const user = await this.prisma.users.create({
          data: {
            email,
            passwordHash: hashedPassword,
            name: dto.name,
            role: mappedRole,
            tenantId: tenantId,
          },
        });

        userId = user.id;
        generatedCredentials = {
          username: email,
          password: plainPassword,
        };
      }
    }

    const employee = await this.prisma.employees.create({
      data: {
        tenantId,
        userId,
        employeeId: dto.employeeId,
        name: dto.name,
        email: dto.email || null,
        phone: dto.phone || null,
        photoUrl: dto.photoUrl || null,
        department: dto.department,
        designation: dto.designation,
        managerId: dto.managerId || null,
        role: dto.role || 'STAFF',
        salary: dto.salary || null,
      },
    });

    return {
      ...employee,
      generatedCredentials,
    };
  }

  async getEmployee(tenantId: string, id: string) {
    const employee = await this.prisma.employees.findFirst({
      where: { id, tenantId },
      include: {
        attendance: {
          orderBy: { date: 'desc' },
          take: 30,
        },
        shifts: true,
        leaves: {
          orderBy: { startDate: 'desc' },
        },
        documents: true,
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee profile not found');
    }

    return employee;
  }

  async updateEmployee(tenantId: string, id: string, dto: any) {
    const employee = await this.prisma.employees.findFirst({
      where: { id, tenantId },
    });

    if (!employee) {
      throw new NotFoundException('Employee profile not found');
    }

    return this.prisma.employees.update({
      where: { id },
      data: {
        name: dto.name,
        email: dto.email || null,
        phone: dto.phone || null,
        photoUrl: dto.photoUrl || null,
        department: dto.department,
        designation: dto.designation,
        managerId: dto.managerId || null,
        role: dto.role || 'STAFF',
        status: dto.status || 'ACTIVE',
        salary: dto.salary || null,
      },
    });
  }

  async deleteEmployee(tenantId: string, id: string) {
    const employee = await this.prisma.employees.findFirst({
      where: { id, tenantId },
    });

    if (!employee) {
      throw new NotFoundException('Employee profile not found');
    }

    return this.prisma.employees.delete({
      where: { id },
    });
  }

  /**
   * Attendance Tracking
   */
  async getEmployeeByUserId(tenantId: string, userId: string) {
    const employee = await this.prisma.employees.findUnique({
      where: { userId },
    });

    if (!employee || employee.tenantId !== tenantId) {
      throw new NotFoundException(
        'Employee profile not found for this user account.',
      );
    }

    return employee;
  }

  async clockIn(tenantId: string, userId: string, dto: ClockInDto) {
    const employee = await this.getEmployeeByUserId(tenantId, userId);
    const now = new Date();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already clocked in today
    const existing = await this.prisma.employee_attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: employee.id,
          date: today,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('You have already clocked in for today.');
    }

    // Determine status (ON_TIME vs LATE) based on shift schedules
    let status = 'ON_TIME';
    const dayOfWeek = now.getDay();

    const shift = await this.prisma.employee_shifts.findFirst({
      where: {
        employeeId: employee.id,
        dayOfWeek,
      },
    });

    if (shift && shift.startTime) {
      const [startHour, startMin] = shift.startTime.split(':').map(Number);
      const shiftStart = new Date();
      shiftStart.setHours(startHour, startMin, 0, 0);

      // Give a 15 minute grace window
      if (now.getTime() > shiftStart.getTime() + 15 * 60 * 1000) {
        status = 'LATE';
      }
    }

    return this.prisma.employee_attendance.create({
      data: {
        employeeId: employee.id,
        date: today,
        clockIn: now,
        status,
        latitude: dto.latitude || null,
        longitude: dto.longitude || null,
        qrToken: dto.qrToken || null,
        breaks: [],
      },
    });
  }

  async clockInEmployee(
    tenantId: string,
    employeeId: string,
    latitude?: number,
    longitude?: number,
  ) {
    const employee = await this.prisma.employees.findFirst({
      where: { id: employeeId, tenantId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await this.prisma.employee_attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: employee.id,
          date: today,
        },
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Employee has already clocked in for today.',
      );
    }

    return this.prisma.employee_attendance.create({
      data: {
        employeeId: employee.id,
        date: today,
        clockIn: new Date(),
        status: 'ON_TIME',
        latitude: latitude || null,
        longitude: longitude || null,
        breaks: [],
      },
    });
  }

  async clockOut(tenantId: string, userId: string) {
    const employee = await this.getEmployeeByUserId(tenantId, userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await this.prisma.employee_attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: employee.id,
          date: today,
        },
      },
    });

    if (!attendance) {
      throw new BadRequestException('You have not clocked in today.');
    }

    if (attendance.clockOut) {
      throw new BadRequestException('You have already clocked out today.');
    }

    return this.prisma.employee_attendance.update({
      where: { id: attendance.id },
      data: {
        clockOut: new Date(),
      },
    });
  }

  async clockOutEmployee(tenantId: string, employeeId: string) {
    const employee = await this.prisma.employees.findFirst({
      where: { id: employeeId, tenantId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await this.prisma.employee_attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: employee.id,
          date: today,
        },
      },
    });

    if (!attendance) {
      throw new BadRequestException('Employee is not clocked in today.');
    }

    if (attendance.clockOut) {
      throw new BadRequestException('Employee has already clocked out today.');
    }

    return this.prisma.employee_attendance.update({
      where: { id: attendance.id },
      data: {
        clockOut: new Date(),
      },
    });
  }

  async toggleBreak(tenantId: string, userId: string) {
    const employee = await this.getEmployeeByUserId(tenantId, userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await this.prisma.employee_attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: employee.id,
          date: today,
        },
      },
    });

    if (!attendance) {
      throw new BadRequestException('You have not clocked in today.');
    }

    const breaksList = Array.isArray(attendance.breaks)
      ? [...(attendance.breaks as any[])]
      : [];
    const lastBreak = breaksList[breaksList.length - 1];
    const now = new Date();

    if (lastBreak && !lastBreak.end) {
      // End break
      lastBreak.end = now;
    } else {
      // Start break
      breaksList.push({ start: now, end: null });
    }

    return this.prisma.employee_attendance.update({
      where: { id: attendance.id },
      data: {
        breaks: breaksList,
      },
    });
  }

  async getTodayAttendance(tenantId: string, userId: string) {
    try {
      const employee = await this.getEmployeeByUserId(tenantId, userId);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return await this.prisma.employee_attendance.findUnique({
        where: {
          employeeId_date: {
            employeeId: employee.id,
            date: today,
          },
        },
      });
    } catch {
      return null;
    }
  }

  async getAttendanceHistory(tenantId: string, employeeId: string) {
    const employee = await this.prisma.employees.findFirst({
      where: { id: employeeId, tenantId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return this.prisma.employee_attendance.findMany({
      where: { employeeId },
      orderBy: { date: 'desc' },
    });
  }

  /**
   * Shift Scheduling
   */
  async getShifts(tenantId: string) {
    return this.prisma.employee_shifts.findMany({
      where: {
        employee: { tenantId },
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            designation: true,
          },
        },
      },
    });
  }

  async upsertShift(tenantId: string, dto: CreateShiftDto) {
    const employee = await this.prisma.employees.findFirst({
      where: { id: dto.employeeId, tenantId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // Check if shift already exists for this day and employee
    const existing = await this.prisma.employee_shifts.findFirst({
      where: {
        employeeId: dto.employeeId,
        dayOfWeek: this.normalizeDayOfWeek(dto.dayOfWeek),
      },
    });

    if (existing) {
      return this.prisma.employee_shifts.update({
        where: { id: existing.id },
        data: {
          startTime: dto.startTime,
          endTime: dto.endTime,
          notes: this.buildShiftNotes(dto.shiftType, dto.rotationWeek),
        },
      });
    }

    return this.prisma.employee_shifts.create({
      data: {
        employeeId: dto.employeeId,
        dayOfWeek: this.normalizeDayOfWeek(dto.dayOfWeek),
        startTime: dto.startTime,
        endTime: dto.endTime,
        notes: this.buildShiftNotes(dto.shiftType, dto.rotationWeek),
      },
    });
  }

  async deleteShift(tenantId: string, id: string) {
    const shift = await this.prisma.employee_shifts.findFirst({
      where: {
        id,
        employee: { tenantId },
      },
    });

    if (!shift) {
      throw new NotFoundException('Shift assignment not found');
    }

    return this.prisma.employee_shifts.delete({
      where: { id },
    });
  }

  /**
   * Leaves management
   */
  async applyLeave(tenantId: string, userId: string, dto: ApplyLeaveDto) {
    const employee = await this.getEmployeeByUserId(tenantId, userId);

    return this.prisma.employee_leaves.create({
      data: {
        employeeId: employee.id,
        leaveType: dto.type,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        reason: dto.reason || null,
        status: 'PENDING',
      },
    });
  }

  async getLeaves(tenantId: string) {
    return this.prisma.employee_leaves.findMany({
      where: {
        employee: { tenantId },
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            designation: true,
            department: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateLeaveStatus(
    tenantId: string,
    id: string,
    status: string,
    approvedByUserId: string,
  ) {
    const leave = await this.prisma.employee_leaves.findFirst({
      where: {
        id,
        employee: { tenantId },
      },
    });

    if (!leave) {
      throw new NotFoundException('Leave application not found');
    }

    return this.prisma.employee_leaves.update({
      where: { id },
      data: {
        status,
        approvedById: approvedByUserId,
      },
    });
  }

  private normalizeDayOfWeek(value: string | number): number {
    if (typeof value === 'number') {
      if (value >= 0 && value <= 6) return value;
      throw new BadRequestException('dayOfWeek must be between 0 and 6');
    }

    const parsed = Number(value);
    if (Number.isInteger(parsed) && parsed >= 0 && parsed <= 6) {
      return parsed;
    }

    const dayMap: Record<string, number> = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };

    const day = dayMap[value.trim().toLowerCase()];
    if (day === undefined) {
      throw new BadRequestException('Invalid dayOfWeek value');
    }

    return day;
  }

  private buildShiftNotes(shiftType: string, rotationWeek?: number): string {
    const parts = [`Shift type: ${shiftType}`];
    if (rotationWeek !== undefined) {
      parts.push(`Rotation week: ${rotationWeek}`);
    }
    return parts.join('; ');
  }
}
