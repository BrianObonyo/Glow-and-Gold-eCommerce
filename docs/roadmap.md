# Roadmap

## v0.1 — Core (current)
- Product catalog (list, detail, search, categories)
- Auth (email/password)
- Cart
- Checkout (Stripe test mode)
- Order history

## v0.2 — Admin
- Admin dashboard: create/edit/delete products, view orders
- Role-based auth (admin vs customer)

## v0.3 — Discovery
- Reviews and ratings
- Related products
- Full-text search

## v0.4 — Operations
- Inventory tracking with low-stock alerts
- Discount codes / coupons
- Email receipts (order confirmation)

## v1.0 — Production-readiness
- Real payment flow review (PCI considerations, webhook security)
- Background job queue for order processing (avoid blocking the request path)
- Image CDN for product photos
- Caching layer for catalog reads

We're explicitly scoping v0.1–v0.4 for correctness and a clean portfolio
demo, not production traffic. v1.0 is where "would this actually survive
real customers and real money" gets addressed properly.
