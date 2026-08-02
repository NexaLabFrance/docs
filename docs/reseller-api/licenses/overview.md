---
id: overview
title: The license object
sidebar_label: The license object
---

# The license object

Every operation in this section returns a license object. This is what it looks
like and what each field means for you.

```json
{
  "key": "LIC-8F3A-B1C0-D4E5",
  "scriptId": "nx-garage",
  "maxSlots": 2,
  "note": "Order #1042 — nx-store.tebex.io",
  "discordId": "987654321098765432",
  "expiresAt": "2027-01-01T00:00:00.000Z",
  "revoked": false,
  "createdAt": "2026-07-28T12:00:00.000Z",
  "updatedAt": "2026-07-28T12:31:09.774Z"
}
```

| Field | Type | Meaning |
| --- | --- | --- |
| `key` | string | The license key you give your customer. Format `PREFIX-XXXX-XXXX-XXXX`. Generated for you — never chosen. |
| `scriptId` | string | The script this license unlocks. Must be one of yours. |
| `maxSlots` | number | How many servers may use this license at the same time. |
| `note` | string | Free-form internal note. Ideal for your order ID. Not visible to the customer. |
| `discordId` | string \| null | Your customer's Discord ID. Informational, for your own records and support. |
| `expiresAt` | ISO 8601 \| null | When the license stops working. `null` means it never expires. |
| `revoked` | boolean | `true` while the license is suspended. |
| `createdAt` | ISO 8601 | Issue timestamp. |
| `updatedAt` | ISO 8601 | Last modification timestamp. Present once the license has been edited. |

## Slots

`maxSlots` is the number of distinct servers that may run the script on this
license concurrently.

- A customer with `maxSlots: 1` can use the license on one server.
- Selling a two-server package? Issue with `maxSlots: 2`.
- A customer moving to a new host does not permanently burn a slot — an unused
  slot is released automatically after a period of inactivity, so most migrations
  need no action from you.

If a customer contacts you because they can't activate on a new server, the usual
fix is to raise `maxSlots` by one — see [Editing](./edit.md).

## Expiry

`expiresAt` drives subscription-style selling:

- **Lifetime purchase** — leave `expiresAt` as `null`.
- **Monthly/annual** — set it to the end of the paid period and push it forward
  on each renewal with a `PATCH`.

An expired license stops working on its own. You don't need to revoke or delete
anything when a subscription lapses; just stop extending `expiresAt`.

## Suspended vs deleted

These are very different actions and choosing correctly matters:

| | Suspend (revoke) | Delete |
| --- | --- | --- |
| Reversible | **Yes** | **No** |
| Record kept | Yes — note, customer, history | No |
| Same key can be restored | Yes | Never |
| Use for | Chargebacks, disputes, temporary blocks, abuse | Erasure requests, cleaning up test data |

**When in doubt, suspend.** Deletion cannot be undone and the key can never be
re-created with the same value.
