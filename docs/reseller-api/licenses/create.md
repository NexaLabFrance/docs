---
id: create
title: Create a license
sidebar_label: Create
---

# Create a license

```http
POST /api/reseller/licenses
```

Issues a new license key for one of your scripts. This is the call you wire to
your "payment confirmed" webhook.

## Parameters

| Field | Type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `scriptId` | string | **yes** | — | The script to unlock. Must belong to you. |
| `maxSlots` | number | no | `1` | Concurrent servers allowed. |
| `note` | string | no | `""` | Internal note. Put your order ID here. |
| `discordId` | string | no | `null` | Your customer's Discord ID. |
| `expiresAt` | ISO 8601 string | no | `null` | `null` = never expires. |
| `prefix` | string | no | `"LIC"` | Prefix for the generated key, e.g. `NXG-…`. |

The key itself is always generated server-side — you cannot supply one.
Use [List scripts](../scripts.md) to find the script IDs available to your account.

## Request

```bash
curl -X POST https://api.nexalab.fr/api/reseller/licenses \
  -H "X-Reseller-Key: $RESELLER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "scriptId": "nx-garage",
        "maxSlots": 2,
        "note": "Order #1042",
        "discordId": "987654321098765432",
        "expiresAt": "2027-01-01T00:00:00.000Z",
        "prefix": "NXG"
      }'
```

## Response `200 OK`

```json
{
  "ok": true,
  "license": {
    "key": "NXG-8F3A-B1C0-D4E5",
    "scriptId": "nx-garage",
    "maxSlots": 2,
    "note": "Order #1042",
    "discordId": "987654321098765432",
    "expiresAt": "2027-01-01T00:00:00.000Z",
    "revoked": false,
    "createdAt": "2026-07-28T12:00:00.000Z"
  }
}
```

Deliver `license.key` to your customer.

:::tip[Always fill in `note`]
Store your order or invoice ID in `note` at creation time. When a chargeback
arrives weeks later, matching the payment back to a license key is the difference
between a five-second suspension and a manual hunt.
:::

:::note[This call takes a moment]
Creating a license also prepares the customer's download. Expect it to be slower
than the other endpoints — allow a generous timeout (30s) and don't fire it
inside a tight request/response cycle if you can queue it instead.
:::

## Examples

**Lifetime, single server** — the common case:

```json
{ "scriptId": "nx-garage", "note": "Order #1042" }
```

**Monthly subscription:**

```json
{
  "scriptId": "nx-garage",
  "note": "Sub #88 — renews monthly",
  "discordId": "987654321098765432",
  "expiresAt": "2026-08-28T00:00:00.000Z"
}
```

**Branded key with a two-server package:**

```json
{ "scriptId": "nx-garage", "prefix": "NXG", "maxSlots": 2, "note": "Order #1103" }
```

## Errors

| Status | `error` | Cause |
| --- | --- | --- |
| `400` | `missing_fields` | `scriptId` was not provided. |
| `403` | `forbidden` | Missing, invalid or disabled reseller key. |
| `404` | `script_not_found` | Unknown script, or it does not belong to you. |
| `503` | `build_failed` | The license package could not be generated. |
| `503` | `obfuscation_failed` | Obfuscation failed while generating the package. |
| `503` | `encrypted_packaging_unavailable` | Encrypted packaging is unavailable. |

The license is saved only after its package is generated successfully. For
package-generation failures, check the script and contact NexaLab support.

## Idempotency

There is no idempotency key. A retried request creates a **second** license.
Guard against double-issuing by recording the returned key against your order ID
before acknowledging the payment webhook, and skipping the call if that order
already has a key.
