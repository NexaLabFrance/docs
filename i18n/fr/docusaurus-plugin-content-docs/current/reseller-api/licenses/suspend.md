---
id: suspend
title: Suspendre une licence
sidebar_label: Suspendre
---

# Suspendre une licence

```http
POST /api/reseller/licenses/:key/revoke
```

Suspend une licence, ou réactive une licence suspendue. C'est l'action
réversible — privilégiez-la avant d'envisager la [suppression](./delete.md).

## Paramètres

| Champ | Type | Défaut | Notes |
| --- | --- | --- | --- |
| `revoked` | boolean | `true` | `true` suspend, `false` réactive. |

Envoyer un corps vide `{}` suspend la licence.

## Suspendre

```bash
curl -X POST https://api.nexalab.fr/api/reseller/licenses/NXG-8F3A-B1C0-D4E5/revoke \
  -H "X-Reseller-Key: $RESELLER_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

```json
{ "ok": true, "key": "NXG-8F3A-B1C0-D4E5", "revoked": true }
```

## Réactiver

```bash
curl -X POST https://api.nexalab.fr/api/reseller/licenses/NXG-8F3A-B1C0-D4E5/revoke \
  -H "X-Reseller-Key: $RESELLER_KEY" \
  -H "Content-Type: application/json" \
  -d '{"revoked": false}'
```

```json
{ "ok": true, "key": "NXG-8F3A-B1C0-D4E5", "revoked": false }
```

## Ce que fait la suspension

- La licence cesse d'être utilisable — le script du client ne s'exécute plus.
- Tout le reste est préservé : la clé, votre note, l'identifiant Discord du
  client, la configuration des emplacements et l'expiration.
- La réactivation remet la licence exactement dans l'état où elle était.

:::note[Pas toujours instantané]
La suspension est prise en compte peu après son émission, et non au même
instant. Prévoyez un court délai avant de confirmer à un client que son accès a
été coupé.
:::

## Quand suspendre

| Cas de figure | Action |
| --- | --- |
| Rétrofacturation ou paiement échoué | Suspendre. Réactiver si le paiement aboutit. |
| Litige en cours d'examen | Suspendre le temps de votre analyse. |
| Violation des conditions d'utilisation | Suspendre ; supprimer uniquement si c'est définitif. |
| Abonnement simplement arrivé à terme | Ne rien faire — laissez `expiresAt` s'en charger. |
| Le client demande l'effacement de ses données | [Supprimer](./delete.md) à la place. |

## Erreurs

| Statut | `error` | Cause |
| --- | --- | --- |
| `403` | `forbidden` | Clé revendeur manquante, invalide ou compte désactivé. |
| `404` | `not_found` | Licence inconnue, ou qui ne vous appartient pas. |

L'appel est idempotent — suspendre une licence déjà suspendue est sans
conséquence et renvoie la même réponse.
