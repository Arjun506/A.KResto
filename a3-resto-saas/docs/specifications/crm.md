# Specification: CRM Module

## 1. Overview
The CRM Module manages customer contacts, segmentation filters, interaction timelines, and feedback summaries.

## 2. Technical Specifications
- **Table Mapping:** `customers`, `customer_groups`, `interactions` (new).
- **Core Interfaces:**
  - `createCustomer(data: CreateCustomerDto): Promise<Customer>`
  - `addInteraction(customerId: string, note: string): Promise<Interaction>`
  - `segmentCustomers(filter: SegmentFilterDto): Promise<Customer[]>`

## 3. Endpoints & API Contract
- `POST /api/v1/crm/customers` - Creates a new customer profile.
- `GET /api/v1/crm/customers` - Returns a list of customer contacts with search pagination.
- `POST /api/v1/crm/customers/:id/interactions` - Logs interaction history (calls, emails, visits).
