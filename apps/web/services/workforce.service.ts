import api from './api';
import { unwrap } from './helpers';

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email?: string;
  phone?: string;
  department: string;
  designation: string;
  role: string;
  status: string;
  branchId?: string;
  branch?: { id: string; name: string; code: string };
  branchAssignments?: any[];
  createdAt: string;
}

export interface WorkforceSummary {
  totalEmployees: number;
  activeStaff: number;
  workingToday: number;
  absentToday: number;
  onLeave: number;
  openShifts: number;
}

export const WorkforceService = {
  async getSummary(branchId?: string): Promise<WorkforceSummary> {
    const res = await api.get('/workforce/summary', { params: { branchId } });
    return unwrap<WorkforceSummary>(res);
  },

  async listEmployees(branchId?: string, status?: string): Promise<Employee[]> {
    const res = await api.get('/workforce/employees', { params: { branchId, status } });
    return unwrap<Employee[]>(res);
  },

  async createEmployee(payload: any): Promise<Employee> {
    const res = await api.post('/workforce/employees', payload);
    return unwrap<Employee>(res);
  },

  async assignBranch(employeeId: string, branchId: string, isPrimary = false) {
    const res = await api.post(`/workforce/employees/${employeeId}/branches`, { branchId, isPrimary });
    return unwrap(res);
  },

  async removeBranchAssignment(employeeId: string, branchId: string) {
    const res = await api.delete(`/workforce/employees/${employeeId}/branches/${branchId}`);
    return unwrap(res);
  },

  async clockInEmployee(employeeId: string, latitude?: number, longitude?: number) {
    const res = await api.post('/workforce/attendance/clock-in-employee', { employeeId, latitude, longitude });
    return unwrap(res);
  },

  async clockOutEmployee(employeeId: string) {
    const res = await api.post('/workforce/attendance/clock-out-employee', { employeeId });
    return unwrap(res);
  },

  async listAttendance(): Promise<any[]> {
    const res = await api.get('/workforce/attendance/history');
    return unwrap<any[]>(res);
  },

  async createShift(payload: any) {
    const res = await api.post('/workforce/shifts', payload);
    return unwrap(res);
  },

  async listShifts(branchId?: string) {
    const res = await api.get('/workforce/shifts', { params: { branchId } });
    return unwrap<any[]>(res);
  },

  async applyLeave(payload: any) {
    const res = await api.post('/workforce/leaves', payload);
    return unwrap(res);
  },

  async listLeaves() {
    const res = await api.get('/workforce/leaves');
    return unwrap<any[]>(res);
  },

  async updateLeaveStatus(leaveId: string, status: string) {
    const res = await api.patch(`/workforce/leaves/${leaveId}/status`, { status });
    return unwrap(res);
  },
};
