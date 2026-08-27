---
id: errors
title: Errors
sidebar_label: Errors
---

# Errors

## Response shape

Failures return JSON with a stable `error` code and a human-readable `message`:

```json
{
  "error": "invalid_field",
  "message": "maxSlots must be a non-negative number"
}
```

Always branch on `error`. Treat `message` as display text — wording may change.

## Status codes

| Status | Meaning |
| --- | --- |
| `200 OK` | The operation succeeded. |
| `400 Bad Request` | Something in your request body is missing or invalid. |
| `403 Forbidden` | Your reseller key is missing, invalid, or your account is disabled. |
| `404 Not Found` | The license or script does not exist — **or does not belong to you**. |
| `500 Internal Server Error` | Something went wrong on the server. |

## Error codes

| `error` | Status | Meaning | Fix |
| --- | --- | --- | --- |
| `forbidden` | 403 | Key missing, invalid, or account disabled. | Check the `X-Reseller-Key` header. Verify the key under **API Keys**, or contact NexaLab if the account is disabled. |
| `not_found` | 404 | Unknown license, or not yours. | Verify the key. Check for stray whitespace or case changes. |
| `script_not_found` | 404 | Unknown script, or not yours. | Verify the `scriptId` matches one of your scripts exactly. |
| `missing_fields` | 400 | A required field is absent. | Supply `scriptId` when creating. |
| `invalid_field` | 400 | A field has the wrong type or an invalid value. | `maxSlots` must be a non-negative number. |
| `no_fields` | 400 | A `PATCH` contained no editable field. | Send `maxSlots`, `expiresAt`, or both. |
| `build_failed` | 500 | The server could not complete the operation. | Retry once with backoff. |
| `internal_error` | 500 | Unexpected server error. | Retry once with backoff. |

:::note[404 is deliberate for licenses that aren't yours]
The API answers `404` rather than `403` when a license belongs to another
reseller, so it never confirms whether a key exists. If you're certain a key is
valid and still get `404`, check it belongs to one of *your* scripts.
:::

## Retry policy

| Status | Retry? |
| --- | --- |
| `400` | No — the request is wrong. Fix it. |
| `403` | No — the credential is wrong. |
| `404` | No — the resource isn't there. |
| `500` | Yes, once, with backoff. |
| Network timeout | See below. |

**Timeouts on create are the one case to be careful with.** A timed-out
`POST /api/reseller/licenses` may still have succeeded. Don't blindly retry —
you'll issue two keys for one order. Record the order-to-key mapping as soon as
you receive it, and reconcile before retrying.

Suspend, edit and delete are all safe to retry: repeating them produces the same
end state.

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| `403 forbidden` on every request | Key not being sent, a typo, or a trailing newline in your environment variable. |
| `403` after working fine | Your key was rotated out, or your account was disabled. |
| `404 not_found` on a key you just created | Wrong environment, or the key was copied with surrounding whitespace. |
| `404 script_not_found` | The `scriptId` is misspelled or the script isn't yours. |
| `400 no_fields` on an edit | You sent only non-editable fields such as `note`. |
| Customer still active right after suspension | Normal — suspension takes a short moment to apply. |
| Two licenses for one order | A retried create. Add order-ID deduplication. |

## Logging recommendation

Log the `error` code, the HTTP status and the license key for every failed call.
When a customer reports a problem, that trio is usually enough to identify the
cause without reproducing anything.
