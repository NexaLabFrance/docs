---
id: edit
title: Modifier une licence
sidebar_label: Modifier
---

# Modifier une licence

```http
PATCH /api/reseller/licenses/:key
```

Met à jour une licence existante. Envoyez au moins l'un des deux champs
modifiables.

## Paramètres

| Champ | Type | Notes |
| --- | --- | --- |
| `maxSlots` | number | Serveurs simultanés autorisés. Doit être supérieur ou égal à zéro. |
| `expiresAt` | chaîne ISO 8601 \| `null` | Nouvelle expiration. `null` la supprime (sans expiration). |

:::note[Ce que vous pouvez modifier]
`maxSlots` et `expiresAt` sont les champs modifiables. `note` et `discordId`
sont figés après la création — renseignez-les correctement dans l'appel de
[création](./create.md).
:::

## Requête

```bash
curl -X PATCH https://api.nexalab.fr/api/reseller/licenses/NXG-8F3A-B1C0-D4E5 \
  -H "X-Reseller-Key: $RESELLER_KEY" \
  -H "Content-Type: application/json" \
  -d '{"maxSlots": 3, "expiresAt": null}'
```

## Réponse `200 OK`

```json
{
  "ok": true,
  "license": {
    "key": "NXG-8F3A-B1C0-D4E5",
    "scriptId": "nx-garage",
    "maxSlots": 3,
    "expiresAt": null,
    "revoked": false,
    "updatedAt": "2026-07-28T12:31:09.774Z"
  }
}
```

## Opérations courantes

**Renouveler un abonnement** — repoussez la date d'expiration :

```bash
curl -X PATCH https://api.nexalab.fr/api/reseller/licenses/NXG-8F3A-B1C0-D4E5 \
  -H "X-Reseller-Key: $RESELLER_KEY" -H "Content-Type: application/json" \
  -d '{"expiresAt": "2026-09-28T00:00:00.000Z"}'
```

**Passer à une licence à vie :**

```json
{ "expiresAt": null }
```

**Vendre un emplacement serveur supplémentaire :**

```json
{ "maxSlots": 2 }
```

**Débloquer un client qui n'arrive pas à activer sa licence sur un nouveau
serveur** — augmenter le nombre d'emplacements de un est la solution la plus
rapide :

```json
{ "maxSlots": 3 }
```

## Réduire `maxSlots`

Abaisser la limite n'expulse **personne**. Les serveurs utilisant déjà la
licence continuent de fonctionner ; aucun nouveau serveur ne peut s'activer tant
que suffisamment d'emplacements ne se sont pas libérés. Si vous rétrogradez un
client, attendez-vous à ce que le changement prenne effet progressivement plutôt
qu'instantanément.

## Erreurs

| Statut | `error` | Cause |
| --- | --- | --- |
| `400` | `no_fields` | Ni `maxSlots` ni `expiresAt` n'a été fourni. |
| `400` | `invalid_field` | `maxSlots` est négatif ou n'est pas un nombre. |
| `403` | `forbidden` | Clé revendeur manquante, invalide ou compte désactivé. |
| `404` | `not_found` | Licence inconnue, ou qui ne vous appartient pas. |

`PATCH` peut être réessayé sans risque — appliquer deux fois les mêmes valeurs
n'a aucun effet supplémentaire.
