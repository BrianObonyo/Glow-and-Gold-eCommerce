# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Storefront redesign for makeup and jewelry: home page (hero, collections, bestsellers, offer, features), shop with category and search filters, product detail with related items, bag, login.
- Scroll and animation system: sticky hide/show header, scroll reveal, back-to-top, shine hover, card action slide-in, mobile drawer (see docs/ANIMATIONS.md).
- Stripe Elements payment form, order-complete page, toast feedback, loading skeletons.
- Placeholder SVG artwork plus generator script; docs for images and deployment.
- Vercel deployment for API and storefront (`backend/vercel.json`, `frontend/vercel.json`); Netlify config kept as an alternative.
- Security hardening: Helmet, rate limiting, strict CSP, JWT secret enforcement, timing-safe login, bounded inputs, stock checks on cart.
- Visual refresh: Bodoni Moda + Hanken Grotesk, garnet/pearl/gold palette, new hero.

### Changed
- The home page "Gifts that sparkle" offer now uses `frontend/public/images/hero/sparkle.jfif`; the original SVG remains available as placeholder artwork.
- Replaced native `bcrypt` with `bcryptjs` (works on serverless), one shared Prisma client, JWT expiry 7d -> 24h.
- Stripe webhook now verifies the signature against the raw body and is idempotent.
- API returns 400 for validation errors and 409 for duplicate emails instead of 500.
- `FRONTEND_ORIGIN` accepts a comma-separated list.
- Seed data is now makeup and jewelry, and no longer duplicates on re-run (`SEED_RESET=1` to wipe).

### Added
- Initial scaffold: backend (Fastify + Prisma + PostgreSQL) and frontend
  (React + Vite), product catalog, cart, auth, checkout groundwork.
