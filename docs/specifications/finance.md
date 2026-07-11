# Specification: Finance Module

## 1. Overview
The Finance Module manages bank accounts, cash registers, invoice reconciliations, and currency rates.

## 2. Technical Specifications
- **Table Mapping:** `bank_accounts`, `cash_registers`, `reconciliations` (new).
- **Core Interfaces:**
  - `reconcileInvoice(invoiceId: string, bankTxId: string): Promise<Reconciliation>`
  - `registerBankTransaction(data: RegisterBankTxDto): Promise<BankTransaction>`

## 3. Endpoints & API Contract
- `POST /api/v1/finance/bank-accounts` - Links a tenant corporate bank account.
- `POST /api/v1/finance/transactions` - Imports bank feed transactions.
- `POST /api/v1/finance/reconcile` - Matches bank transactions with pending invoices.
