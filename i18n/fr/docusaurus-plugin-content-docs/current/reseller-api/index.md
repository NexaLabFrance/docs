---
id: reseller-api-index
title: API Revendeur
sidebar_label: Vue d'ensemble
---

# API Revendeur

L'API Revendeur automatise la gestion des licences depuis votre boutique, votre
bot Discord ou votre back-office. Elle permet de créer une licence après un
paiement, de modifier les informations d'abonnement et de suspendre l'accès
après une rétrofacturation ou un signalement d'abus.

## Ce que vous pouvez automatiser

| Opération | Point d'accès |
| --- | --- |
| [**Créer**](./licenses/create.md) une licence | `POST /api/reseller/licenses` |
| [**Modifier**](./licenses/edit.md) une licence | `PATCH /api/reseller/licenses/:key` |
| [**Suspendre**](./licenses/suspend.md) ou réactiver une licence | `POST /api/reseller/licenses/:key/revoke` |
| [**Supprimer**](./licenses/delete.md) une licence | `DELETE /api/reseller/licenses/:key` |

## URL de base et conventions

Tous les points d'accès sont relatifs à :

```text
https://api.nexalab.fr
```

- Les requêtes et réponses sont en JSON (`Content-Type: application/json`).
- Chaque requête transporte votre clé revendeur — voir [Authentification](./authentication.md).
- Les réponses en succès contiennent toujours `"ok": true`.
- Les échecs renvoient un code `error` stable et exploitable par machine, ainsi
  qu'un `message` lisible. Testez `error`, affichez `message`.

## Démarrage rapide

Générez une licence en un seul appel :

```bash
curl -X POST https://api.nexalab.fr/api/reseller/licenses \
  -H "X-Reseller-Key: $RESELLER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "scriptId": "nx-garage",
        "maxSlots": 1,
        "note": "Commande #1042",
        "discordId": "987654321098765432"
      }'
```

```json
{
  "ok": true,
  "license": {
    "key": "LIC-8F3A-B1C0-D4E5",
    "scriptId": "nx-garage",
    "maxSlots": 1,
    "note": "Commande #1042",
    "discordId": "987654321098765432",
    "expiresAt": null,
    "revoked": false,
    "createdAt": "2026-07-28T12:00:00.000Z"
  }
}
```

Transmettez `license.key` à votre client. C'est tout le processus.

## Une intégration type

```text
paiement confirmé      → POST   /api/reseller/licenses            (note = n° commande)
client veut +1 serveur → PATCH  /api/reseller/licenses/:key       {"maxSlots": 2}
abonnement renouvelé   → PATCH  /api/reseller/licenses/:key       {"expiresAt": "…"}
rétrofacturation/abus  → POST   /api/reseller/licenses/:key/revoke
litige résolu          → POST   /api/reseller/licenses/:key/revoke {"revoked": false}
demande d'effacement   → DELETE /api/reseller/licenses/:key
```

Pas encore de clé ? Créez-en une depuis l'interface revendeur sur
[customer.nexalab.fr](https://customer.nexalab.fr) — voir
[Authentification](./authentication.md).
