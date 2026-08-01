---
id: overview
title: L'objet licence
sidebar_label: L'objet licence
sidebar_position: 1
---

# L'objet licence

Chaque opération de cette section renvoie un objet licence. Voici à quoi il
ressemble et ce que chaque champ signifie pour vous.

```json
{
  "key": "LIC-8F3A-B1C0-D4E5",
  "scriptId": "nx-garage",
  "maxSlots": 2,
  "note": "Commande #1042 — nx-store.tebex.io",
  "discordId": "987654321098765432",
  "expiresAt": "2027-01-01T00:00:00.000Z",
  "revoked": false,
  "createdAt": "2026-07-28T12:00:00.000Z",
  "updatedAt": "2026-07-28T12:31:09.774Z"
}
```

| Champ | Type | Signification |
| --- | --- | --- |
| `key` | string | La clé de licence à remettre à votre client. Format `PREFIX-XXXX-XXXX-XXXX`. Générée pour vous — jamais choisie. |
| `scriptId` | string | Le script que cette licence débloque. Doit être l'un des vôtres. |
| `maxSlots` | number | Nombre de serveurs pouvant utiliser cette licence simultanément. |
| `note` | string | Note interne libre. Idéale pour votre numéro de commande. Invisible pour le client. |
| `discordId` | string \| null | L'identifiant Discord de votre client. Informatif, pour vos propres registres et le support. |
| `expiresAt` | ISO 8601 \| null | Date à laquelle la licence cesse de fonctionner. `null` signifie sans expiration. |
| `revoked` | boolean | `true` tant que la licence est suspendue. |
| `createdAt` | ISO 8601 | Horodatage de création. |
| `updatedAt` | ISO 8601 | Horodatage de dernière modification. Présent une fois la licence modifiée. |

## Emplacements (slots)

`maxSlots` correspond au nombre de serveurs distincts pouvant exécuter le script
avec cette licence simultanément.

- Un client avec `maxSlots: 1` peut utiliser la licence sur un serveur.
- Vous vendez un pack deux serveurs ? Générez la licence avec `maxSlots: 2`.
- Un client qui change d'hébergeur ne consomme pas définitivement un
  emplacement — un emplacement inutilisé est libéré automatiquement après une
  période d'inactivité, donc la plupart des migrations ne demandent aucune
  action de votre part.

Si un client vous contacte parce qu'il n'arrive pas à activer sa licence sur un
nouveau serveur, la solution habituelle consiste à augmenter `maxSlots` de un —
voir [Modifier](./edit.md).

## Expiration

`expiresAt` permet la vente par abonnement :

- **Achat à vie** — laissez `expiresAt` à `null`.
- **Mensuel/annuel** — fixez-le à la fin de la période payée et repoussez-le à
  chaque renouvellement avec un `PATCH`.

Une licence expirée cesse de fonctionner d'elle-même. Inutile de révoquer ou de
supprimer quoi que ce soit lorsqu'un abonnement prend fin ; il suffit de ne plus
prolonger `expiresAt`.

## Suspendue ou supprimée

Ces deux actions sont très différentes et le bon choix a son importance :

| | Suspendre (révoquer) | Supprimer |
| --- | --- | --- |
| Réversible | **Oui** | **Non** |
| Enregistrement conservé | Oui — note, client, historique | Non |
| La même clé peut être réactivée | Oui | Jamais |
| À utiliser pour | Rétrofacturations, litiges, blocages temporaires, abus | Demandes d'effacement, nettoyage de données de test |

**En cas de doute, suspendez.** La suppression est irréversible et la clé ne
pourra jamais être recréée à l'identique.
