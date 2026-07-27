# Phase 29B — First Pilot Operator Guide

This guide details step-by-step instructions for the platform operator to configure staging/production credentials without exposing secrets.

---

## 1. Credentials Injection Procedures

### A. Stripe Integration (Sandbox)
1. Register/Login to the Stripe Developer Console.
2. Under "API Keys", copy the Test Publishable Key and Test Secret Key.
3. Inject the secret key into the API container variables as:
   `STRIPE_API_KEY=sk_test_...`
4. Reboot the API service:
   ```bash
   pm2 restart api
   ```
5. **Validation**: Execute a test $1 transaction via the checkout interface. Expect `Stripe payment succeeded` logs.

### B. Twilio MFA Integration (Sandbox)
1. Copy the Twilio account SID and Auth Token from the Twilio Console.
2. Inject them into the API container:
   `TWILIO_SID=AC...`
   `TWILIO_AUTH_TOKEN=...`
3. Reboot the API service.
4. **Validation**: Request an EMR chart access. Expect a mock OTP generated event inside standard output logs.
