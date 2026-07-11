# Specification: Accounting Module

## 1. Overview
The Accounting Module manages charts of accounts, double-entry journals, ledger logs, and tax configurations.

## 2. Technical Specifications
- **Table Mapping:** `accounts`, `journal_entries`, `transactions` (new).
- **Core Interfaces:**
  - `createAccount(data: CreateAccountDto): Promise<Account>`
  - `postJournalEntry(entry: PostJournalEntryDto): Promise<JournalEntry>`
  - `getTrialBalance(tenantId: string): Promise<TrialBalanceReport>`

## 3. Endpoints & API Contract
- `POST /api/v1/accounting/accounts` - Registers an account in the chart of accounts.
- `POST /api/v1/accounting/journal` - Posts a balanced journal entry (debits must match credits).
- `GET /api/v1/accounting/ledger/:id` - Fetches account transaction logs.
