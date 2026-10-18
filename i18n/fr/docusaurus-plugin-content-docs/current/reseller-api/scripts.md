---
id: scripts
title: Lister les scripts
sidebar_label: Lister les scripts
---

# Lister les scripts

```http
GET /api/reseller/scripts
```

Renvoie les scripts appartenant à votre compte revendeur. Utilisez leurs
identifiants comme `scriptId` lors de la [création d'une licence](./licenses/create.md).

## Requête

```bash
curl https://api.nexalab.fr/api/reseller/scripts \
  -H "X-Reseller-Key: $RESELLER_KEY"
```

Aucun corps de requête ni paramètre de requête n'est nécessaire.

## Réponse `200 OK`

La réponse contient un objet `scripts` indexé par identifiant de script. Chaque
valeur est l'enregistrement du script correspondant. Un compte sans script reçoit :

```json
{ "scripts": {} }
```

Ce point d'accès ne renvoie pas de champ `ok`.

## Alias de compatibilité

```http
GET /api/reseller/license-scripts
```

Cet alias de `GET /api/reseller/scripts` est conservé pour les intégrations
existantes. Il utilise la même authentification et renvoie le même format de
réponse. Privilégiez `/scripts` pour les nouvelles intégrations.

## Restrictions de gestion des scripts

Les clés revendeur permettent de lister les scripts et de gérer leurs licences.
Les routes de gestion des scripts suivantes sont bloquées pour ces clés :

| Méthode | Point d'accès | Opération |
| --- | --- | --- |
| `POST` | `/api/reseller/scripts` | Créer un script. |
| `DELETE` | `/api/reseller/scripts/:scriptId` | Supprimer un script. |
| `POST` | `/api/reseller/scripts/:scriptId/source` | Envoyer les sources d'un script. |
| `POST` | `/api/reseller/scripts/:scriptId/version` | Publier une version. |
| `DELETE` | `/api/reseller/scripts/:scriptId/versions/:version` | Supprimer une version. |

## Erreurs

| Statut | `error` | Cause |
| --- | --- | --- |
| `403` | `forbidden` | Clé revendeur manquante, invalide ou compte désactivé. |

Consultez [Authentification](./authentication.md) pour configurer une clé et
comprendre la portée de votre compte.
