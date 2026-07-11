# AK Business OS – Consumer Platform (Version 2)

---

## 1. Scope & Core Assumptions
- **Single Customer Identity** – One global account (email/phone) that works across the mobile app, web site, and all vertical services.
- **Unified Backend** – All UI channels consume the same versioned consumer APIs (`/consumer/v1/...`).
- **Modular Vertical Services** – Food, hotels, grocery, pharmacy, services, salons, repairs are exposed as plug‑in modules on the Core Platform. The Consumer Platform only needs to know the generic contract (catalog, booking, payment).

---

## 2. Navigation Structure
```
Home
 ├─ Search (persistent top bar)
 ├─ Discover
 │   ├─ Map View
 │   └─ Category Tiles
 ├─ Orders & Bookings
 │   ├─ Current
 │   └─ History
 ├─ Wallet & Rewards
 ├─ Offers
 ├─ Support
 └─ Profile
```
- **Bottom Tab Bar** (mobile) mirrors the top navigation on the web.
- **Floating Action Button** – Quick access to “Search Near Me”.
- **Global Hamburger** – Opens user settings, language, and consent management.

---

## 3. Page Blueprint
| Page | Core UI Elements | Primary Actions |
|------|------------------|-----------------|
| **Home** | Hero carousel (AI‑curated), quick‑access categories, “Nearby for you” map snapshot. | Tap carousel, start search, open category. |
| **Search Results** | Search bar, filter bar, list/grid toggle, map overlay with pins. | Refine filters, sort, add item to cart/booking. |
| **Business Detail** | Media carousel, description, service catalog (menu, room types, product list), reviews, offers badge, **Add to Favorites**. | Select options, add to cart/booking, write review, claim offer. |
| **Cart / Booking** | Item list with modifiers, schedule picker (date/time), promo‑code field, wallet balance preview. | Edit quantity, change time slot, apply coupon, proceed to checkout. |
| **Checkout** | Payment method selector (card, Apple/Google Pay, wallet), order summary, consent toggle, **Place Order** button. | Save payment, enable “Pay Later”, confirm order. |
| **Tracking** | Progress bar (Received → Preparing → En‑route → Delivered), live map with driver pin, contact driver button. | Refresh, report issue, view ETA. |
| **Wallet** | Balance, top‑up button, transaction list, linked cards. | Add funds, view statement, redeem points. |
| **Rewards** | Points total, tier badge, list of redeemable rewards, progress toward next tier. | Redeem now, share reward. |
| **Offers** | Swipeable coupon carousel, filter by type, expiration timer. | Tap to apply, view terms, share. |
| **Support** | AI Assistant chat bubble, FAQ accordion, “Create Ticket” form, live chat escalation. | Ask question, upload screenshot, check ticket status. |
| **Profile** | Personal details, preferences (dietary, language), security (2FA), notification settings. | Edit profile, manage devices, view loyalty card. |

---

## 4. Search Experience
1. **Unified Search Endpoint** (`/search`) – accepts free‑text, location, optional filters.
2. **Type‑Ahead + Autocomplete** – suggests business names, categories, popular queries.
3. **AI‑Ranked Results** – combines relevance, distance, past interaction, and real‑time inventory/availability.
4. **Faceted Filters** – Category, price range, rating, open‑now, dietary tags, insurance coverage (medicines).
5. **Geo‑Boost** – distance weighting using Haversine; optionally weighted by travel‑time via map provider.
6. **Voice Search** – Mobile app captures voice, transcribes via AI Platform, then runs the same search flow.

---

## 5. Business Discovery & Maps
- **Interactive Vector Map** – shows pins coloured by vertical (food‑red, hotel‑blue, pharmacy‑green, services‑purple).
- **Clustered Pins** – aggregated counts at low zoom; expanding reveals individual businesses.
- **Hotspot Highlights** – AI surfaces “Trending Near You” based on recent orders and active promotions.
- **Map Filters** – toggle by category, open‑now, offers‑only.
- **Directions** – one‑tap launch to native navigation for pickup locations.

---

## 6. Categories & Favorites
- **Hierarchical Category Tree** – top‑level verticals → sub‑categories (e.g., Food → Restaurants → Sushi).
- **Dynamic Re‑ordering** – most‑used categories float to the top per user.
- **Favorites Panel** – starred businesses appear in a dedicated section on Home and in the side drawer; can be re‑ordered.
- **Quick‑Reorder** – from a favorite, a single tap pre‑fills the last order/booking configuration.

---

## 7. History & Recommendations
- **Order / Booking History** – chronological list with status icons, “Repeat” button, receipt download.
- **AI‑Powered Recommendations** –
  - *Similar to what you liked* (based on past items).
  - *What’s popular now* (real‑time trend).
  - *Time‑of‑day suggestions* (coffee in the morning, dinner at night).
- **Cross‑Vertical Upsell** – e.g., after a grocery order, suggest a pharmacy delivery for related medicines.
- **Feedback Capture** – post‑transaction rating, delivery time, and sentiment feed back into the recommendation engine.

---

## 8. Loyalty, Wallet & Rewards
- **Points Engine** – configurable earn rate per spend (e.g., 1 pt per $1 for food, 2 pt per $1 for hotels). Points stored in the **Wallet** service.
- **Tier System** – Bronze → Silver → Gold; each tier unlocks higher discount caps, priority support, and exclusive offers.
- **Redemption** – Points can be applied at checkout (partial or full) or exchanged for partner coupons.
- **Gamified Badges** – milestones such as “First Hotel Booking”, “100 Orders”, displayed on the Profile page.
- **Referral Program** – Unique referral link; both parties receive a points bonus after the first successful order.

---

## 9. Payments & Wallet Integration
- **Unified Payment Layer** – supports card, Apple/Google Pay, bank transfer, and wallet balance.
- **One‑Click Checkout** – saved payment method and delivery address auto‑populate for returning users.
- **Split Payments** – combine wallet points with a card for a single transaction.
- **PCI‑DSS Compliance** – tokenization handled by the Core Payment Service; front‑end never sees raw card data.
- **Refund & Dispute Flow** – initiated from Order History, routed through Finance for settlement.

---

## 10. Support & AI Assistant
- **Conversational AI Assistant** – persistent chat icon; can:
  - Answer FAQs, locate nearby services, check order status.
  - Proactively push “Your pizza is ready, would you like to track it?”
  - Escalate to a human agent when confidence < 80 %.
- **Live Chat** – queue with support agents; transcript stored in Support module.
- **Self‑Help Knowledge Base** – searchable articles; contextual tips appear inline (e.g., “Tip: add a delivery note”).
- **Ticket System** – users create tickets; status updates push via push notifications.

---

## 11. Future Expansion Roadmap
| Phase | New Verticals / Features | Highlights |
|-------|--------------------------|-----------|
| **Phase 1 – MVP** | Food, Hotels, Grocery, Basic Search & Map. | Core ordering, wallet, loyalty. |
| **Phase 2 – Health & Personal Services** | Medicines (prescription upload), Salons, Repairs, General Services. | Pharmacy compliance, appointment slots, technician tracking. |
| **Phase 3 – AI‑Deepening** | Predictive ETA, dynamic pricing, personalized AI‑generated offers, voice‑only ordering. |
| **Phase 4 – Partner Ecosystem** | Third‑party APIs (insurance verification for medicines, loyalty partners, external logistics). |
| **Phase 5 – Community & Social** | User‑generated lists, shared carts, social reviews, influencer‑driven promotions. |

---

## 12. Technical Touchpoints (Design‑Level Overview)
- **API Gateway** – All UI actions route through versioned consumer APIs (`/consumer/v1/...`).
- **Event Bus** – Emits domain events (`search.initiated`, `order.placed`, `review.submitted`) consumed by AI, Loyalty, Analytics.
- **Data Lake** – Stores immutable logs of interactions for model training and analytics.
- **Feature Flag Service** – Enables phased roll‑out of new verticals or UI experiments.
- **Compliance Layer** – GDPR consent manager, HIPAA for medical purchases, PCI‑DSS for payments.

---

## 13. Summary
The Consumer Platform provides a **single‑account, omnichannel experience** that lets users discover and transact with any business on AK Business OS.  By leveraging a modular Core Platform, AI‑driven personalization, and a rich engagement suite (wallet, rewards, AI Assistant, support), the platform can start with core food‑ordering and scale to a full‑service marketplace covering hospitality, health, retail, and on‑demand services.

---

*Document generated on 2026‑07‑02.*
