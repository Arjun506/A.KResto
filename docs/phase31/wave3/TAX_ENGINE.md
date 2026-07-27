# Phase 31 Wave 3 — Tax Engine

---

## Multi-Tax Component Architecture

- **Tax Modes**: Supports tax-inclusive and tax-exclusive catalog configurations.
- **Tax Breakdown**: Calculates itemized tax rates (e.g., CGST + SGST or VAT) based on tenant location and item tax classification.
- **Rounding Rules**: Financial rounding applied deterministically using `Math.round(amount * 100) / 100`.
