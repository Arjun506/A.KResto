# Universal Payment & Settlement Foundation (`payment-foundation`)

The **Universal Payment & Settlement Foundation** provides PCI-ready gateway abstraction, split payment processing, customer digital wallets, gift cards, credit line accounts, payment retries, merchant settlements, disputes, and score-based fraud check tools for AK OS 2035.

---

## 🏛️ Bounded Contexts

1. **Intents (`/payment-intents`)**: Create/execute split payment intents with automatic retry and expiration.
2. **Token Vault (`/payment-tokens`)**: Mock token storage vault supporting rotation policies.
3. **Subscription Billing (`/billing-schedules`)**: Scheduling and automatic cycle billing.
4. **Disputes (`/payment-disputes`)**: Chargeback registry tracking evidence documents.
5. **Health Monitor (`/gateway-health`)**: Collect gateway availability, latencies, and metrics.
6. **Registry (`/payments`)**: Payment transaction registration, currencies, amounts.
7. **Payment Methods (`/payment-methods`)**: ISO method codes (`CREDIT_CARD`, `DEBIT_CARD`, `CASH`, `BANK_TRANSFER`, `DIGITAL_WALLET`, `GIFT_CARD`, `STORE_CREDIT`, `INSTALLMENT`, `BUY_NOW_PAY_LATER`).
8. **Providers (`/payment-providers`)**: Registered merchant gateway accounts.
9. **Authorization Engine (`/payments/:id/authorize`)**: Hold funds on credit instruments.
10. **Capture Engine (`/payments/:id/capture`)**: Full or partial captures.
11. **Settlement Engine (`/payment-settlements`)**: Payout summaries and batch states.
12. **Refund Engine (`/payments/:id/refund`)**: Full or partial refunds.
13. **Void Engine (`/payments/:id/void`)**: Authorization holds releases.
14. **Wallet Foundation (`/wallets`)**: Digital ledger credit & debits.
15. **Gift Cards (`/gift-cards`)**: Verification, activations, balances.
16. **Split Payments (`/payments/:id/splits`)**: Multi-tender checks.
17. **Fraud Risk (`/payments/:id/fraud-check`)**: Rule checking score engine.
