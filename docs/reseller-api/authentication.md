---
id: authentication
title: Authentication
sidebar_label: Authentication
sidebar_position: 2
---

# Authentication

Every license endpoint is authenticated with a single header: your **reseller
key**.

```http
POST /api/reseller/licenses HTTP/1.1
Host: api.nexalab.fr
X-Reseller-Key: rsk_9f3ab1c0d4e5...
Content-Type: application/json
```

## Creating an API key

You create and manage your own keys from the customer area:

1. Go to **[customer.nexalab.fr](https://customer.nexalab.fr)**.
2. **Log in** with your account.
3. Open the **reseller interface**.
4. Go to **API Keys**.
5. Click **Create** to generate a new key.

:::warning[Copy your key immediately]
The key is displayed **once**, at creation time, and can never be shown again —
only its fingerprint is stored. If you navigate away without copying it, delete
it and create another. Store it in your secret manager or environment
configuration straight away.
:::

```bash
export RESELLER_KEY="rsk_9f3ab1c0d4e5..."
```

If you don't see the reseller interface after logging in, your account isn't
flagged as a reseller yet — contact NexaLab.

:::danger[Never expose your key in a browser]
`X-Reseller-Key` grants full control over your licenses. Call this API from your
**backend only** — never from front-end JavaScript, a Discord bot running on a
customer's machine, or anything a third party can inspect. If your key is ever
exposed, replace it immediatly.
:::

## Scope

Your key is bound to your reseller account. You can manage licenses for **your
own scripts only**. Any license belonging to someone else responds `404 not_found`
— the API will not confirm whether it exists.

## Authentication failures

| Situation | Status | Response |
| --- | --- | --- |
| Header absent | `403` | `{"error":"forbidden","message":"Missing X-Reseller-Key header"}` |
| Key not recognised | `403` | `{"error":"forbidden","message":"Invalid X-Reseller-Key"}` |
| Account disabled | `403` | `{"error":"forbidden","message":"This reseller account is disabled."}` |
| License isn't yours | `404` | `{"error":"not_found"}` |

A `403` is never worth retrying — fix the key, or check your account status in
the reseller interface. See [Errors](./errors.md) for the full list.

## Rotating your key

You may hold up to **two** keys at once, which makes rotation a clean overlap
rather than a cutover:

1. Create a second key under **API Keys** in the reseller interface.
2. Deploy it to your backend.
3. Confirm traffic has moved over to the new key.
4. Delete the old key from the same page.

Rotate on a schedule, and immediately if a key may have leaked.
