# Industry Pack #5: Healthcare

## 1. Overview
The Healthcare Pack tailors systems for medical clinic appointments, patient profiles, and medical records.

## 2. Core Configurations & Overrides
- **Business Type:** `HEALTHCARE`
- **Visual Extensions:** Patient registration portals, visit history timelines, and prescription forms.
- **Prisma metadata JSONB Mapping:**
  - `licensing`: Doctor certification registry numbers.
  - `insuranceAcceptance`: List of accepted provider networks.

## 3. Workflow Modifications
- Enforces strict patient data privacy layers.
- Automatically generates prescriptions and insurance documents at check-out.
