# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Sangam Kirana Store (`artifacts/sangam-kirana`)
- Full e-commerce website for a kirana/grocery retail store
- **Frontend**: React + Vite, Tailwind CSS, Wouter router, React Query
- **Theme**: Deep saffron (#a05c2c) and emerald green palette, cream background
- **Pages**:
  - `/` — Homepage with hero, categories, featured products, about section
  - `/shop` — Product grid with search and category filters
  - `/cart` — Shopping cart with quantity management
  - `/checkout` — Checkout with sample payment gateway (card/UPI/COD)
  - `/order-success` — Order confirmation
  - `/admin` — Admin panel (password: `admin123`) to manage products and view orders
- **Features**: Product popup modal with Add to Cart + Buy Now, cart context, smooth scrolling, scroll-reveal animations

### API Server (`artifacts/api-server`)
- Express 5 backend serving `/api`
- Routes: `/api/products`, `/api/categories`, `/api/orders`, `/api/store/summary`
- DB schema: `products`, `categories`, `orders` tables

## Database Schema

- `products` — id, name, description, price, original_price, category, image_url, stock, unit, featured, created_at
- `categories` — id, name, slug, icon
- `orders` — id, customer_name, customer_email, customer_phone, address, items (jsonb), total, status, payment_method, created_at

## Admin Access
- URL: `/admin`
- Password: `admin123`
