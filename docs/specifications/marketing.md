# Specification: Marketing Module

## 1. Overview
The Marketing Module manages promotional campaigns, discount coupons, and customer email alerts.

## 2. Technical Specifications
- **Table Mapping:** `campaigns`, `coupons`, `promotions` (new).
- **Core Interfaces:**
  - `createCampaign(data: CreateCampaignDto): Promise<Campaign>`
  - `generateCoupon(settings: CouponSettingsDto): Promise<Coupon>`
  - `validateCoupon(code: string, cartTotal: number): Promise<Discount>`

## 3. Endpoints & API Contract
- `POST /api/v1/marketing/campaigns` - Launches an email or promotion campaign.
- `POST /api/v1/marketing/coupons` - Generates dynamic discount codes.
- `POST /api/v1/marketing/coupons/validate` - Checks and applies discounts to cart totals.
