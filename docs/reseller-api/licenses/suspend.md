---
id: suspend
title: Suspend a license
sidebar_label: Suspend
---

# Suspend a license

```http
POST /api/reseller/licenses/:key/revoke
```

Suspends a license, or restores a suspended one. This is the reversible action —
reach for it before you reach for [delete](./delete.md).

## Parameters

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `revoked` | boolean | `true` | `true` suspends, `false` restores. |

Sending an empty body `{}` suspends the license.

## Suspend

```bash
curl -X POST https://api.nexalab.fr/api/reseller/licenses/NXG-8F3A-B1C0-D4E5/revoke \
  -H "X-Reseller-Key: $RESELLER_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

```json
{ "ok": true, "key": "NXG-8F3A-B1C0-D4E5", "revoked": true }
```

## Restore

```bash
curl -X POST https://api.nexalab.fr/api/reseller/licenses/NXG-8F3A-B1C0-D4E5/revoke \
  -H "X-Reseller-Key: $RESELLER_KEY" \
  -H "Content-Type: application/json" \
  -d '{"revoked": false}'
```

```json
{ "ok": true, "key": "NXG-8F3A-B1C0-D4E5", "revoked": false }
```

## What suspension does

- The license stops being usable — the customer's script no longer runs.
- Everything else is preserved: the key, your note, the customer's Discord ID,
  the slot configuration and the expiry.
- Restoring returns the license to exactly the state it was in.

:::note[Not always instant]
Suspension is picked up shortly after you issue it rather than at the same
instant, so allow a short delay before confirming to a customer that access has
been cut.
:::

## When to suspend

| Scenario | Action |
| --- | --- |
| Chargeback or failed payment | Suspend. Restore if the payment clears. |
| Dispute under investigation | Suspend while you look into it. |
| Terms-of-service violation | Suspend; delete only if permanent. |
| Subscription simply lapsed | Do nothing — let `expiresAt` handle it. |
| Customer requests data erasure | [Delete](./delete.md) instead. |

## Errors

| Status | `error` | Cause |
| --- | --- | --- |
| `403` | `forbidden` | Missing, invalid or disabled reseller key. |
| `404` | `not_found` | Unknown license, or it does not belong to you. |

The call is idempotent — suspending an already-suspended license is harmless and
returns the same response.
