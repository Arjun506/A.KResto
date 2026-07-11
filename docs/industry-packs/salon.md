# Industry Pack #4: Salon

## 1. Overview
The Salon Pack configures calendars and service registers for salons and spas.

## 2. Core Configurations & Overrides
- **Business Type:** `SALON`
- **Visual Extensions:** Adds calendar timelines for stylists, booking screens, and service cards.
- **Prisma metadata JSONB Mapping:**
  - `duration`: Sizing guidelines for specific services (in minutes).
  - `stylistSpecialty`: Skill level qualifiers (e.g. Master Stylist).

## 3. Workflow Modifications
- Automatically adjusts stylist schedules when appointments are booked.
- Triggers SMS reminders to reduce appointment no-shows.
