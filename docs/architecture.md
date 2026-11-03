# Architecture

## Overview

```
┌──────────────┐        REST (JSON)        ┌───────────────┐
│   Frontend   │◄─────────────────────────►│    Backend     │
│ React + Vite │                            │  Fastify API   │
└──────────────┘                            └───────┬────────┘
                                                      │
                                       ┌──────────────┼──────────────┐
                                       ▼                             ▼
                                ┌─────────────┐              ┌─────────────┐
                                │ PostgreSQL  │              │   Stripe    │
                                │ (catalog,   │              │ (test mode  │
                                │  orders)    │              │  checkout)  │
                                └─────────────┘              └─────────────┘
```

## Why two separate apps

- **Backend and frontend are independently deployable.** The API has no
  knowledge of how it's consumed — it could serve a mobile app or another
  client without changes.
- **Clear ownership boundary.** Data validation, auth, and business rules
  live in the backend; presentation and UX state live in the frontend.
  Useful both for actual development and for demonstrating separation of
  concerns in a portfolio.

## Data model (initial)

- `users (id, email, password_hash, created_at)`
- `products (id, name, description, price_cents, image_url, category, stock, created_at)`
- `carts (id, user_id, created_at)`
- `cart_items (cart_id, product_id, quantity)`
- `orders (id, user_id, status, total_cents, stripe_payment_intent_id, created_at)`
- `order_items (order_id, product_id, quantity, price_cents_at_purchase)`

## Request flow: checkout

1. Frontend sends the current cart to `POST /checkout`.
2. Backend validates stock and prices (never trusts client-supplied prices),
   creates a Stripe PaymentIntent in test mode, and returns a client secret.
3. Frontend confirms payment with Stripe's client SDK.
4. On Stripe webhook confirmation, backend marks the order `paid` and
   decrements stock.

## Scaling notes

Out of scope for the initial build — this is a reference implementation
sized for a portfolio and small real usage, not a high-traffic store. See
[roadmap.md](roadmap.md) for what would change at real scale (caching layer,
search service, CDN for product images, background job queue for order
processing).

## Frontend structure

```
frontend/src/
  components/   Header, Footer, ProductCard, Section (scroll reveal), BackToTop, Icon
  context/      StoreContext: auth token, cart state, toast
  hooks/        useHeaderScroll, useScrollReveal
  pages/        Home, ProductList, ProductDetail, Cart, Checkout, OrderComplete, Login
  lib/          api client, formatting
  config.ts     store name, categories (rebrand here)
```

Motion patterns are specified in [ANIMATIONS.md](ANIMATIONS.md). Hosting is covered in [DEPLOYMENT.md](DEPLOYMENT.md).
