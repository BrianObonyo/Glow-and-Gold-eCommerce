# Glow & Gold

A full-stack makeup and fine jewelry storefront by Brian Otieno Obonyo, with a product catalog, cart, Stripe checkout, order tracking, and a separate REST API.

## Highlights

- **Storefront**: sticky hide-on-scroll header, scroll-reveal sections, shine hovers, mobile drawer, skeleton loading, toast feedback, reduced-motion support ([motion spec](docs/ANIMATIONS.md))
- **Catalog**: categories, search, product detail with related items
- **Cart and checkout**: server-side cart, prices always re-read from the database, Stripe Elements payment (test mode)
- **Orders**: Stripe webhook with signature verification marks orders paid, decrements stock, clears the cart (idempotent)
- **Auth**: email/password with JWT, rate-limited, timing-safe login
- **Security**: Helmet, strict CSP, Zod validation on every input, and server-side pricing

## Architecture

```
brian-ecommerce/
├── backend/     REST API: Fastify, Prisma, PostgreSQL, Stripe
└── frontend/    React (Vite) SPA
```

See [docs/architecture.md](docs/architecture.md).

## Stack

- **Backend**: TypeScript, Fastify, Prisma, PostgreSQL, Stripe, Zod, Vitest; deploys to Vercel
- **Frontend**: TypeScript, React 18, Vite, React Router, Stripe Elements

## Getting started

```bash
git clone https://github.com/BrianObonyo/brian-ecommerce.git
cd brian-ecommerce

# Backend
cd backend
cp .env.example .env          # add Stripe TEST keys and a JWT_SECRET
docker compose up -d          # Postgres
npm install
npm run db:migrate
npm run db:seed               # demo makeup + jewelry products
npm run dev                   # http://localhost:4000

# Frontend (new terminal)
cd ../frontend
cp .env.example .env          # add your pk_test_ key
npm install
npm run dev                   # http://localhost:5173
```

## Restarting locally (PowerShell)

Before starting, make sure Docker Desktop is running and both `backend/.env` and `frontend/.env` exist. The backend needs a working `DATABASE_URL` and `JWT_SECRET`. Stripe checkout also requires test keys in both env files.

Open two PowerShell terminals from the project root.

**Terminal 1 — database and API**

```powershell
Set-Location .\backend
docker compose up -d
npm run dev
```

**Terminal 2 — storefront**

```powershell
Set-Location .\frontend
npm run dev
```

Open http://localhost:5173. Check that PostgreSQL is running with `docker compose ps` from `backend` and that the API is healthy at http://localhost:4000/health. Run `npm install` in each package only for first-time setup or after dependencies change; run `npm run db:migrate` and `npm run db:seed` in `backend` when initializing a new database.

Test payments: card `4242 4242 4242 4242`, any future date, any CVC. To receive webhooks locally:
`stripe listen --forward-to localhost:4000/checkout/webhook`

## Documentation

- [Replacing the placeholder images](docs/IMAGES.md)
- [Scroll and animation behaviour](docs/ANIMATIONS.md)
- [Architecture](docs/architecture.md) and [roadmap](docs/roadmap.md)

## Contributing

Contributions welcome, see [CONTRIBUTING.md](CONTRIBUTING.md). Issues tagged `good-first-issue` are scoped for a first PR.

## License

All rights reserved. This repository is public for portfolio viewing only. See [LICENSE](LICENSE) for reuse terms.
