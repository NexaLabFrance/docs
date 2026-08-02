---
id: reseller-api-index
title: Reseller API
sidebar_label: Overview
---

# Reseller API

The Reseller API automates license management from your store, Discord bot or
back office. It can create licenses after payment, update subscription details
and suspend access after a chargeback or abuse report.

## What you can automate

| Operation | Endpoint |
| --- | --- |
| [**Create**](./licenses/create.md) a license | `POST /api/reseller/licenses` |
| [**Edit**](./licenses/edit.md) a license | `PATCH /api/reseller/licenses/:key` |
| [**Suspend**](./licenses/suspend.md) or restore a license | `POST /api/reseller/licenses/:key/revoke` |
| [**Delete**](./licenses/delete.md) a license | `DELETE /api/reseller/licenses/:key` |

## Base URL and conventions

All endpoints are relative to:

```text
https://api.nexalab.fr
```

- Requests and responses are JSON (`Content-Type: application/json`).
- Every request carries your reseller key — see [Authentication](./authentication.md).
- Successful responses always include `"ok": true`.
- Failures return a stable machine-readable `error` code plus a human `message`.
  Branch on `error`, display `message`.

## Quick start

Issue a license in one call:

```bash
curl -X POST https://api.nexalab.fr/api/reseller/licenses \
  -H "X-Reseller-Key: $RESELLER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "scriptId": "nx-garage",
        "maxSlots": 1,
        "note": "Order #1042",
        "discordId": "987654321098765432"
      }'
```

```json
{
  "ok": true,
  "license": {
    "key": "LIC-8F3A-B1C0-D4E5",
    "scriptId": "nx-garage",
    "maxSlots": 1,
    "note": "Order #1042",
    "discordId": "987654321098765432",
    "expiresAt": null,
    "revoked": false,
    "createdAt": "2026-07-28T12:00:00.000Z"
  }
}
```

Hand `license.key` to your customer. That's the whole flow.

## A typical integration

```text
payment confirmed     → POST   /api/reseller/licenses            (note = order id)
customer needs +1 srv → PATCH  /api/reseller/licenses/:key       {"maxSlots": 2}
subscription renewed  → PATCH  /api/reseller/licenses/:key       {"expiresAt": "…"}
chargeback / abuse    → POST   /api/reseller/licenses/:key/revoke
dispute resolved      → POST   /api/reseller/licenses/:key/revoke {"revoked": false}
erasure request       → DELETE /api/reseller/licenses/:key
```

Need a key first? Create one from the reseller interface on
[customer.nexalab.fr](https://customer.nexalab.fr) — see
[Authentication](./authentication.md).
