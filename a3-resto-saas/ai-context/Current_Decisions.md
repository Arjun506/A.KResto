# Architecture Decisions Log (ADR)

This document tracks major design and technical decisions made for **AK Business OS**.

## ADR 001: Transition to Business OS Modular Core
- **Status:** Approved
- **Context:** The legacy codebase uses a monolith structure tightly coupled to the Restaurant domain, which prevents reuse for retail, salon, or generic businesses.
- **Decision:** Shift to a generic modular system where all modules (Inventory, Accounting, POS) extend a base capability interface. Industry packs customize this base layer.
- **Consequence:** Eliminates duplication of common features, supports multi-industry scaling, and enables per-tenant toggle capabilities.

## ADR 002: Direct Database Joins Forbidden
- **Status:** Approved
- **Context:** Direct queries across module tables prevent scaling and make database partition/migration extremely risky.
- **Decision:** Capabilities must expose service interfaces or publish events. No joins across module boundary tables are allowed.
- **Consequence:** Strict isolation, allowing clean migrations and modular database structures.
