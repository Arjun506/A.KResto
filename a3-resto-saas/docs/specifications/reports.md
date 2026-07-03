# Specification: Reports Module

## 1. Overview
The Reports Module generates balance sheets, cashflow reports, sales analytics, and audit logs.

## 2. Technical Specifications
- **Table Mapping:** Dynamic database views pulling from `sales_orders`, `journal_entries`, and `audit_logs`.
- **Core Interfaces:**
  - `generateBalanceSheet(tenantId: string, end: Date): Promise<BalanceSheet>`
  - `generateCashFlow(tenantId: string, range: DateRange): Promise<CashFlowReport>`
  - `exportToPdf(data: any, template: string): Promise<Buffer>`

## 3. Endpoints & API Contract
- `GET /api/v1/reports/balance-sheet` - Compiles a balance sheet report.
- `GET /api/v1/reports/cashflow` - Aggregates a cashflow statement.
- `GET /api/v1/reports/export` - Triggers PDF or CSV exports of reports.
