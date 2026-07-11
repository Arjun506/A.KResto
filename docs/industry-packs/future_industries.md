# Industry Pack Configurations: Future Industries

## 1. Overview
This document outlines the guidelines for adding future industry configurations to the **AK Business OS** ecosystem.

## 2. Onboarding Requirements

- **Type Registry:** Add the new industry identifier code to the generic `BUSINESS_TYPE` enum.
- **Visual Overrides:** Create layout configuration schemas inside `libs/industry-packs/<name>/assets/ui.json`.
- **Database Overrides:** Map new industry attributes directly to the core JSONB `metadata` fields.
- **Workflow Overrides:** Define event listeners to intercept and extend base checkout, booking, or stock actions.
