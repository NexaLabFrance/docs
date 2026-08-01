---
id: create
title: Créer une licence
sidebar_label: Créer
sidebar_position: 2
---

# Créer une licence

```http
POST /api/reseller/licenses
```

Génère une nouvelle clé de licence pour l'un de vos scripts. C'est l'appel à
brancher sur votre webhook « paiement confirmé ».

## Paramètres

| Champ | Type | Requis | Défaut | Notes |
| --- | --- | --- | --- | --- |
| `scriptId` | string | **oui** | — | Le script à débloquer. Doit vous appartenir. |
| `maxSlots` | number | non | `1` | Serveurs simultanés autorisés. |
| `note` | string | non | `""` | Note interne. Indiquez-y votre numéro de commande. |
| `discordId` | string | non | `null` | L'identifiant Discord de votre client. |
| `expiresAt` | chaîne ISO 8601 | non | `null` | `null` = sans expiration. |
| `prefix` | string | non | `"LIC"` | Préfixe de la clé générée, par ex. `NXG-…`. |

La clé est toujours générée côté serveur — vous ne pouvez pas la fournir.

## Requête

```bash
curl -X POST https://api.nexalab.fr/api/reseller/licenses \
  -H "X-Reseller-Key: $RESELLER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "scriptId": "nx-garage",
        "maxSlots": 2,
        "note": "Commande #1042",
        "discordId": "987654321098765432",
        "expiresAt": "2027-01-01T00:00:00.000Z",
        "prefix": "NXG"
      }'
```

## Réponse `200 OK`

```json
{
  "ok": true,
  "license": {
    "key": "NXG-8F3A-B1C0-D4E5",
    "scriptId": "nx-garage",
    "maxSlots": 2,
    "note": "Commande #1042",
    "discordId": "987654321098765432",
    "expiresAt": "2027-01-01T00:00:00.000Z",
    "revoked": false,
    "createdAt": "2026-07-28T12:00:00.000Z"
  }
}
```

Transmettez `license.key` à votre client.

:::tip[Renseignez toujours `note`]
Enregistrez votre numéro de commande ou de facture dans `note` dès la création.
Lorsqu'une rétrofacturation arrive des semaines plus tard, retrouver le paiement
correspondant à une clé fait la différence entre une suspension en cinq secondes
et une recherche manuelle.
:::

:::note[Cet appel prend un instant]
Créer une licence prépare également le téléchargement du client. Attendez-vous à
ce qu'il soit plus lent que les autres points d'accès — prévoyez un délai
d'attente généreux (30 s) et évitez de le déclencher dans un cycle
requête/réponse serré si vous pouvez le mettre en file d'attente.
:::

## Exemples

**À vie, un seul serveur** — le cas courant :

```json
{ "scriptId": "nx-garage", "note": "Commande #1042" }
```

**Abonnement mensuel :**

```json
{
  "scriptId": "nx-garage",
  "note": "Abo #88 — renouvellement mensuel",
  "discordId": "987654321098765432",
  "expiresAt": "2026-08-28T00:00:00.000Z"
}
```

**Clé personnalisée avec un pack deux serveurs :**

```json
{ "scriptId": "nx-garage", "prefix": "NXG", "maxSlots": 2, "note": "Commande #1103" }
```

## Erreurs

| Statut | `error` | Cause |
| --- | --- | --- |
| `400` | `missing_fields` | `scriptId` n'a pas été fourni. |
| `403` | `forbidden` | Clé revendeur manquante, invalide ou compte désactivé. |
| `404` | `script_not_found` | Script inconnu, ou qui ne vous appartient pas. |

## Idempotence

Il n'existe pas de clé d'idempotence. Une requête réessayée crée une **seconde**
licence. Protégez-vous contre les doubles générations en enregistrant la clé
renvoyée avec votre numéro de commande avant d'accuser réception du webhook de
paiement, et en sautant l'appel si cette commande possède déjà une clé.
