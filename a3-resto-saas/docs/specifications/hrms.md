# Specification: HRMS Module

## 1. Overview
The HRMS Module manages employees, contracts, shifts, leaves, and performance logs.

## 2. Technical Specifications
- **Table Mapping:** `employees`, `shifts`, `contracts`, `leaves` (new).
- **Core Interfaces:**
  - `registerEmployee(data: RegisterEmployeeDto): Promise<Employee>`
  - `assignShift(employeeId: string, shift: ShiftDto): Promise<Shift>`
  - `requestLeave(employeeId: string, leave: LeaveRequestDto): Promise<Leave>`

## 3. Endpoints & API Contract
- `POST /api/v1/hrms/employees` - Registers a new employee profile.
- `POST /api/v1/hrms/shifts` - Schedules employee shifts.
- `POST /api/v1/hrms/leaves` - Submits a leave request.
