import api from './api';
import { unwrap } from './helpers';

export interface Employee {
  id: string;
  userId?: string | null;
  tenantId: string;
  branchId?: string | null;
  employeeId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  photoUrl?: string | null;
  department: string;
  designation: string;
  managerId?: string | null;
  role: string;
  status: string;
  salary?: string | number | null;
  hireDate: string;
  createdAt: string;
  generatedCredentials?: { username: string; password: string } | null;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut?: string | null;
  status: string;
  latitude?: number | null;
  longitude?: number | null;
  breaks?: any[] | null;
}

export interface Shift {
  id: string;
  employeeId: string;
  dayOfWeek: string;
  shiftType: string;
  startTime: string;
  endTime: string;
  rotationWeek: number;
  employee?: {
    id: string;
    name: string;
    designation: string;
  };
}

export interface Leave {
  id: string;
  employeeId: string;
  type: string;
  startDate: string;
  endDate: string;
  reason?: string | null;
  status: string;
  createdAt: string;
  employee?: {
    id: string;
    name: string;
    designation: string;
    department: string;
  };
}

export const getEmployees = async (): Promise<Employee[]> => {
  return unwrap<Employee[]>(api.get('/workforce/employees'));
};

export const createEmployee = async (data: any): Promise<Employee> => {
  return unwrap<Employee>(api.post('/workforce/employees', data));
};

export const getEmployee = async (id: string): Promise<Employee & { attendance: Attendance[]; shifts: Shift[]; leaves: Leave[] }> => {
  return unwrap<any>(api.get(`/workforce/employees/${id}`));
};

export const updateEmployee = async (id: string, data: any): Promise<Employee> => {
  return unwrap<Employee>(api.put(`/workforce/employees/${id}`, data));
};

export const deleteEmployee = async (id: string): Promise<void> => {
  return unwrap<void>(api.delete(`/workforce/employees/${id}`));
};

export const clockIn = async (data?: { latitude?: number; longitude?: number; qrToken?: string }): Promise<Attendance> => {
  return unwrap<Attendance>(api.post('/workforce/attendance/clock-in', data || {}));
};

export const clockInEmployee = async (employeeId: string, latitude?: number, longitude?: number): Promise<Attendance> => {
  return unwrap<Attendance>(api.post('/workforce/attendance/clock-in-employee', { employeeId, latitude, longitude }));
};

export const clockOut = async (): Promise<Attendance> => {
  return unwrap<Attendance>(api.post('/workforce/attendance/clock-out'));
};

export const clockOutEmployee = async (employeeId: string): Promise<Attendance> => {
  return unwrap<Attendance>(api.post('/workforce/attendance/clock-out-employee', { employeeId }));
};

export const toggleBreak = async (): Promise<Attendance> => {
  return unwrap<Attendance>(api.post('/workforce/attendance/break'));
};

export const getTodayAttendance = async (): Promise<Attendance | null> => {
  return unwrap<Attendance | null>(api.get('/workforce/attendance/today'));
};

export const getAttendanceHistory = async (employeeId: string): Promise<Attendance[]> => {
  return unwrap<Attendance[]>(api.get('/workforce/attendance/history', { params: { employeeId } }));
};

export const getShifts = async (): Promise<Shift[]> => {
  return unwrap<Shift[]>(api.get('/workforce/shifts'));
};

export const saveShift = async (data: {
  employeeId: string;
  dayOfWeek: string;
  shiftType: string;
  startTime: string;
  endTime: string;
}): Promise<Shift> => {
  return unwrap<Shift>(api.post('/workforce/shifts', data));
};

export const deleteShift = async (id: string): Promise<void> => {
  return unwrap<void>(api.delete(`/workforce/shifts/${id}`));
};

export const applyLeave = async (data: {
  type: string;
  startDate: string;
  endDate: string;
  reason?: string;
}): Promise<Leave> => {
  return unwrap<Leave>(api.post('/workforce/leaves', data));
};

export const getLeaves = async (): Promise<Leave[]> => {
  return unwrap<Leave[]>(api.get('/workforce/leaves'));
};

export const updateLeaveStatus = async (id: string, status: string): Promise<Leave> => {
  return unwrap<Leave>(api.patch(`/workforce/leaves/${id}/status`, { status }));
};

