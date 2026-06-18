# GEEX Frontend Cart & Checkout Guide

This document outlines the Medusa cart and checkout integration used by the GEEX storefront.

## Environment

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9030
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
```

## Cart API

Base URL:

```text
http://localhost:9030/store
```

### Get Cart

`GET /carts/:id`

Example cart item:

```json
{
  "title": "GEEX A75 Mechanical Keyboard",
  "quantity": 1,
  "unit_price": 8999,
  "currency_code": "usd"
}
```

### Create Cart

`POST /carts`

Use a GEEX sales channel and region returned by the Store API.

### Add Line Item

`POST /carts/:id/line-items`

Body:

```json
{
  "variant_id": "variant_...",
  "quantity": 1
}
```

## Notes

- Keep product handles in the GEEX catalog namespace where possible.
- Do not expose secret backend keys to the browser.
- Checkout and payment provider behavior comes from the Medusa backend.
