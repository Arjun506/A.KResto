# Healthcare Industry Pack Architecture

The module utilizes the decoupled extension structure specified in the platform standards.

```
                  ┌──────────────────────┐
                  │  Business Console   │
                  └──────────┬───────────┘
                             │ REST
  ┌──────────────────────────▼──────────────────────────┐
  │               Healthcare Industry Pack              │
  ├─────────────────────────────────────────────────────┤
  │   Facilities, Patients, Appts, EMR, Labs, Claims    │
  └──────────┬───────────────────────────────┬──────────┘
             │                               │
  ┌──────────▼──────────┐         ┌──────────▼──────────┐
  │   Core Foundations  │         │     AI Platform     │
  └─────────────────────┘         └─────────────────────┘
```

## Relational Decoupling
Extensions map patients, appointments, clinical histories, and laboratory orders using isolated tables:
- `hc_facilities`, `hc_departments`, `hc_rooms`, `hc_beds`, `hc_patient_profiles`, `hc_appointments`, `hc_emrs`, `hc_prescriptions`, `hc_lab_orders`, `hc_insurance_claims`.
- CRM loyalty coordinates reward points updates.
- Checkout operations initiate copay invoice payments directly inside the Payment Foundation model.
