---
id: list
title: Lister les licences
sidebar_label: Lister
---

# Lister les licences

```http
GET /api/reseller/licenses
```

Renvoie les licences des scripts appartenant à votre compte revendeur. Les
licences des scripts d'autres revendeurs sont exclues.

## Requête

```bash
curl https://api.nexalab.fr/api/reseller/licenses \
  -H "X-Reseller-Key: $RESELLER_KEY"
```

Aucun corps de requête ni paramètre de requête n'est nécessaire. Cette route
ne propose ni pagination ni filtres de requête.

## Réponse `200 OK`

```json
{
  "licenses": {
    "LIC-8F3A-B1C0-D4E5": {
      "key": "LIC-8F3A-B1C0-D4E5",
      "scriptId": "nx-garage",
      "maxSlots": 1,
      "note": "Commande #1042",
      "discordId": "987654321098765432",
      "expiresAt": null,
      "revoked": false,
      "createdAt": "2026-07-28T12:00:00.000Z",
      "bindings": []
    }
  }
}
```

`licenses` est un objet indexé par clé de licence, et non un tableau. Chaque
valeur est un [objet licence](./overview.md) ; les enregistrements stockés peuvent
inclure des champs supplémentaires comme les métadonnées de build. La réponse
ne contient pas de champ `ok`.

Si aucune licence ne correspond, la réponse est :

```json
{ "licenses": {} }
```

Les licences révoquées et expirées sont incluses. Vérifiez `revoked` et
`expiresAt` dans votre intégration pour distinguer leur état.

## Erreurs

| Statut | `error` | Cause |
| --- | --- | --- |
| `403` | `forbidden` | Clé revendeur manquante, invalide ou compte désactivé. |
