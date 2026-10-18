---
id: list
title: List licenses
sidebar_label: List
---

# List licenses

```http
GET /api/reseller/licenses
```

Returns licenses for scripts owned by your reseller account. Licenses for other
resellers' scripts are excluded.

## Request

```bash
curl https://api.nexalab.fr/api/reseller/licenses \
  -H "X-Reseller-Key: $RESELLER_KEY"
```

No request body or query parameters are required. This route does not implement
pagination or request filters.

## Response `200 OK`

```json
{
  "licenses": {
    "LIC-8F3A-B1C0-D4E5": {
      "key": "LIC-8F3A-B1C0-D4E5",
      "scriptId": "nx-garage",
      "maxSlots": 1,
      "note": "Order #1042",
      "discordId": "987654321098765432",
      "expiresAt": null,
      "revoked": false,
      "createdAt": "2026-07-28T12:00:00.000Z",
      "bindings": []
    }
  }
}
```

`licenses` is an object keyed by license key, not an array. Each value is a
[license object](./overview.md); stored records can include additional fields
such as build metadata. The response does not include an `ok` field.

If no licenses match, the response is:

```json
{ "licenses": {} }
```

Revoked and expired licenses are included. Check `revoked` and `expiresAt` in
your integration when you need to distinguish their status.

## Errors

| Status | `error` | Cause |
| --- | --- | --- |
| `403` | `forbidden` | Missing, invalid or disabled reseller key. |
