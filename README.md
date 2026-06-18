# GEEX Frontend

Next.js storefront for GEEX, an English-first electronics accessories shop.

The storefront uses Medusa for products, carts, checkout, customer accounts, and order data. Visual direction is GEEX technology minimalism: cool white surfaces, near-black typography, orbit blue accents, the GEEX logo system, and real desk setup / electronics imagery.

## Local Development

```bash
npm install
npm run dev
```

Default local URL:

```text
http://localhost:3030
```

Required environment variables:

```text
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9030
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=...
NEXT_PUBLIC_MEDUSA_SALES_CHANNEL_ID=...
NEXT_PUBLIC_BASE_URL=http://localhost:3030
NEXT_PUBLIC_SUPPORT_EMAIL=support@example.com
NEXT_PUBLIC_SOCIAL_LINKS=
```

## Verification

```bash
npm run lint
npm run build
```
