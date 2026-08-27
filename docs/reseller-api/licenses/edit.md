---
id: edit
title: Edit a license
sidebar_label: Edit
---

# Edit a license

```http
PATCH /api/reseller/licenses/:key
```

Updates an existing license. Send at least one of the two editable fields.

## Parameters

| Field | Type | Notes |
| --- | --- | --- |
| `maxSlots` | number | Concurrent servers allowed. Must be zero or greater. |
| `expiresAt` | ISO 8601 string \| `null` | New expiry. `null` clears it (never expires). |

:::note[What you can change]
`maxSlots` and `expiresAt` are the editable fields. `note` and `discordId` are
fixed after creation — set them correctly in the [create](./create.md) call.
:::

## Request

```bash
curl -X PATCH https://api.nexalab.fr/api/reseller/licenses/NXG-8F3A-B1C0-D4E5 \
  -H "X-Reseller-Key: $RESELLER_KEY" \
  -H "Content-Type: application/json" \
  -d '{"maxSlots": 3, "expiresAt": null}'
```

## Response `200 OK`

```json
{
  "ok": true,
  "license": {
    "key": "NXG-8F3A-B1C0-D4E5",
    "scriptId": "nx-garage",
    "maxSlots": 3,
    "expiresAt": null,
    "revoked": false,
    "updatedAt": "2026-07-28T12:31:09.774Z"
  }
}
```

## Common operations

**Renew a subscription** — push the expiry forward:

```bash
curl -X PATCH https://api.nexalab.fr/api/reseller/licenses/NXG-8F3A-B1C0-D4E5 \
  -H "X-Reseller-Key: $RESELLER_KEY" -H "Content-Type: application/json" \
  -d '{"expiresAt": "2026-09-28T00:00:00.000Z"}'
```

**Upgrade to a lifetime license:**

```json
{ "expiresAt": null }
```

**Sell an extra server slot:**

```json
{ "maxSlots": 2 }
```

**Unblock a customer who can't activate on a new server** — raising the slot count
by one is the fastest resolution:

```json
{ "maxSlots": 3 }
```

## Reducing `maxSlots`

Lowering the limit does **not** kick anyone off. Servers already using the license
keep working; no new server can activate until enough slots free up naturally. If
you downgrade a customer, expect the change to take effect gradually rather than
instantly.

## Errors

| Status | `error` | Cause |
| --- | --- | --- |
| `400` | `no_fields` | Neither `maxSlots` nor `expiresAt` was supplied. |
| `400` | `invalid_field` | `maxSlots` is negative or not a number. |
| `403` | `forbidden` | Missing, invalid or disabled reseller key. |
| `404` | `not_found` | Unknown license, or it does not belong to you. |

`PATCH` is safe to retry — applying the same values twice has no additional
effect.
