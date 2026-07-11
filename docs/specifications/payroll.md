# Specification: Payroll Module

## 1. Overview
The Payroll Module calculates salaries, manages tax deductions, processes payout checks, and issues payslips.

## 2. Technical Specifications
- **Table Mapping:** `payslips`, `payroll_runs`, `deductions` (new).
- **Core Interfaces:**
  - `runPayroll(month: Date): Promise<PayrollRun>`
  - `calculateDeductions(employeeId: string, baseSalary: number): Promise<Deduction[]>`
  - `issuePayslip(employeeId: string, runId: string): Promise<Payslip>`

## 3. Endpoints & API Contract
- `POST /api/v1/payroll/runs` - Executes a payroll calculation run.
- `GET /api/v1/payroll/payslips/:employeeId` - Fetches employee payslip details.
- `POST /api/v1/payroll/payout` - Disperses bank payroll records.
