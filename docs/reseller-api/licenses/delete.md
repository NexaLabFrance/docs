---
id: delete
title: Delete a license
sidebar_label: Delete
---

# Delete a license

```http
DELETE /api/reseller/licenses/:key
```

Permanently removes a license and everything associated with it.

:::danger[This cannot be undone]
There is no undo, no recycle bin and no recovery. The key is gone, and a new
license can never be issued with the same value. If there is any chance you'll
need to reverse the decision, [suspend](./suspend.md) instead.
:::

## Request

```bash
curl -X DELETE https://api.nexalab.fr/api/reseller/licenses/NXG-8F3A-B1C0-D4E5 \
  -H "X-Reseller-Key: $RESELLER_KEY"
```

No request body.

## Response `200 OK`

```json
{ "ok": true, "key": "NXG-8F3A-B1C0-D4E5" }
```

## What is removed

- The license and its key.
- Its server activations.
- Your note, the linked Discord ID, the expiry and slot settings.
- The customer's prepared download.

The customer immediately loses access and cannot download anything with that key
again.

## When to delete

Deletion is the right call in a small number of cases:

- A **data erasure request** where the record itself must go.
- **Test or duplicate licenses** created by mistake, before they reach a customer.
- **Permanent** account terminations where you are certain no restoration will
  ever be requested.

For everything else — chargebacks, disputes, lapsed subscriptions, temporary
blocks — use [suspend](./suspend.md).

## Before you delete

1. Record the key, `note` and `discordId` in your own system first if you need an
   audit trail. They are not recoverable from the API afterwards.
2. Confirm the key is the right one. Deletion does not ask twice.
3. Prefer suspending for a cooling-off period, then deleting later if nothing
   changes.

## Errors

| Status | `error` | Cause |
| --- | --- | --- |
| `403` | `forbidden` | Missing, invalid or disabled reseller key. |
| `404` | `not_found` | Unknown license, or it does not belong to you. |

A repeated delete returns `404 not_found` — the first one succeeded.
