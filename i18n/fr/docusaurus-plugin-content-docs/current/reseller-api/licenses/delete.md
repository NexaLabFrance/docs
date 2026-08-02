---
id: delete
title: Supprimer une licence
sidebar_label: Supprimer
---

# Supprimer une licence

```http
DELETE /api/reseller/licenses/:key
```

Supprime définitivement une licence et tout ce qui lui est associé.

:::danger[Action irréversible]
Il n'y a ni annulation, ni corbeille, ni récupération possible. La clé
disparaît, et aucune nouvelle licence ne pourra jamais être générée avec la même
valeur. Si la décision risque de devoir être annulée,
[suspendez](./suspend.md) plutôt.
:::

## Requête

```bash
curl -X DELETE https://api.nexalab.fr/api/reseller/licenses/NXG-8F3A-B1C0-D4E5 \
  -H "X-Reseller-Key: $RESELLER_KEY"
```

Aucun corps de requête.

## Réponse `200 OK`

```json
{ "ok": true, "key": "NXG-8F3A-B1C0-D4E5" }
```

## Ce qui est supprimé

- La licence et sa clé.
- Ses activations sur serveur.
- Votre note, l'identifiant Discord associé, l'expiration et les paramètres
  d'emplacements.
- Le téléchargement préparé pour le client.

Le client perd immédiatement l'accès et ne peut plus rien télécharger avec cette
clé.

## Quand supprimer

La suppression n'est justifiée que dans un petit nombre de cas :

- Une **demande d'effacement des données** où l'enregistrement lui-même doit
  disparaître.
- Des **licences de test ou en double** créées par erreur, avant qu'elles
  n'atteignent un client.
- Des résiliations de compte **définitives** pour lesquelles vous êtes certain
  qu'aucune réactivation ne sera jamais demandée.

Pour tout le reste — rétrofacturations, litiges, abonnements arrivés à terme,
blocages temporaires — utilisez la [suspension](./suspend.md).

## Avant de supprimer

1. Enregistrez d'abord la clé, la `note` et le `discordId` dans votre propre
   système si vous avez besoin d'une piste d'audit. Ces données ne sont plus
   récupérables via l'API ensuite.
2. Vérifiez qu'il s'agit bien de la bonne clé. La suppression ne demande pas de
   confirmation.
3. Préférez une suspension pendant une période de réflexion, puis supprimez plus
   tard si rien ne change.

## Erreurs

| Statut | `error` | Cause |
| --- | --- | --- |
| `403` | `forbidden` | Clé revendeur manquante, invalide ou compte désactivé. |
| `404` | `not_found` | Licence inconnue, ou qui ne vous appartient pas. |

Une suppression répétée renvoie `404 not_found` — la première a réussi.
