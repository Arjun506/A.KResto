# Universal Payment & Settlement Foundation Architecture

```mermaid
graph TD
    Intents[Payment Intent Engine] -->|Register| Registry[Payment Transactions Registry]
    Registry -->|Authorize| Auth[Authorization Engine]
    Auth -->|Capture| Cap[Capture Engine]
    Cap -->|Refund| Ref[Refund Engine]
    Cap -->|Settle Payout| Settlement[Settlement Engine]
    
    Registry -->|Gateway Abstraction| Adapters[Gateway Adapters Factory]
    Adapters -->|Track Latency| Health[Gateway Health Monitoring]
    
    Registry -->|Validate| Fraud[Fraud & Risk Engine]
    Registry -->|Multi-Tender Splits| Splits[Split Payments Engine]
    
    Wallets[Digital Wallet balances] -->|Tender Type| Splits
    GiftCards[Gift Cards balances] -->|Tender Type| Splits
```

## Bounded Boundaries
- **Decoupled Gateway Abstraction**: All physical payment processors conform to `IPaymentGatewayAdapter` interface. No Stripe or Adyen specific logic leaks into the core engine.
- **PCI Readiness**: No actual credit card numbers are ever stored in the database. Cards are transformed into vault tokens (`payment_tokens`) with expiry and rotation hooks.
- **Workflow & Event Integration**: Custom operations dispatch NestJS domain events via `EventBusService`.
- **Multi-Tenant Protection**: Handled via `TenantGuard`.
