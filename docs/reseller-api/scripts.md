---
id: scripts
title: List scripts
sidebar_label: List scripts
---

# List scripts

```http
GET /api/reseller/scripts
```

Returns the scripts owned by your reseller account. Use their IDs as `scriptId`
when [creating a license](./licenses/create.md).

## Request

```bash
curl https://api.nexalab.fr/api/reseller/scripts \
  -H "X-Reseller-Key: $RESELLER_KEY"
```

No request body or query parameters are required.

## Response `200 OK`

The response contains a `scripts` object keyed by script ID. Each value is the
corresponding script record. An account with no scripts receives:

```json
{ "scripts": {} }
```

This endpoint does not include an `ok` field.

## Compatibility alias

```http
GET /api/reseller/license-scripts
```

This is a backwards-compatible alias of `GET /api/reseller/scripts`. It uses the
same authentication and returns the same response shape. Prefer `/scripts` for
new integrations.

## Script management restrictions

Reseller keys can list scripts and manage their licenses. The following script
management routes are blocked for reseller keys:

| Method | Endpoint | Operation |
| --- | --- | --- |
| `POST` | `/api/reseller/scripts` | Create a script. |
| `DELETE` | `/api/reseller/scripts/:scriptId` | Delete a script. |
| `POST` | `/api/reseller/scripts/:scriptId/source` | Upload script source. |
| `POST` | `/api/reseller/scripts/:scriptId/version` | Publish a version. |
| `DELETE` | `/api/reseller/scripts/:scriptId/versions/:version` | Delete a version. |

## Errors

| Status | `error` | Cause |
| --- | --- | --- |
| `403` | `forbidden` | Missing, invalid or disabled reseller key. |

See [Authentication](./authentication.md) for key setup and account scope.
