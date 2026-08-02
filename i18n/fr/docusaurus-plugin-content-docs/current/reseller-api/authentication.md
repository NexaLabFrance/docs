---
id: authentication
title: Authentification
sidebar_label: Authentification
---

# Authentification

Chaque point d'accès de licence est authentifié par un seul en-tête : votre
**clé revendeur**.

```http
POST /api/reseller/licenses HTTP/1.1
Host: api.nexalab.fr
X-Reseller-Key: rsk_9f3ab1c0d4e5...
Content-Type: application/json
```

## Créer une clé API

Vous créez et gérez vos clés depuis l'espace client :

1. Rendez-vous sur **[customer.nexalab.fr](https://customer.nexalab.fr)**.
2. **Connectez-vous** à votre compte.
3. Ouvrez l'**interface revendeur**.
4. Allez dans **API Keys**.
5. Cliquez sur **Create** pour générer une nouvelle clé.

:::warning[Copiez votre clé immédiatement]
La clé n'est affichée **qu'une seule fois**, à sa création, et ne pourra jamais
être réaffichée — seule son empreinte est conservée. Si vous quittez la page
sans l'avoir copiée, supprimez-la et créez-en une autre. Enregistrez-la sans
attendre dans votre gestionnaire de secrets ou votre configuration
d'environnement.
:::

```bash
export RESELLER_KEY="rsk_9f3ab1c0d4e5..."
```

Si l'interface revendeur n'apparaît pas après connexion, votre compte n'est pas
encore identifié comme revendeur — contactez NexaLab.

:::danger[N'exposez jamais votre clé dans un navigateur]
`X-Reseller-Key` donne un contrôle total sur vos licences. Appelez cette API
**depuis votre backend uniquement** — jamais depuis du JavaScript côté client,
un bot Discord hébergé sur la machine d'un client, ou tout élément qu'un tiers
peut inspecter. Si votre clé est exposée, remplacez la immédiatement
:::

## Portée

Votre clé est liée à votre compte revendeur. Vous ne pouvez gérer que les
licences de **vos propres scripts**. Toute licence appartenant à quelqu'un
d'autre renvoie `404 not_found` — l'API ne confirmera pas son existence.

## Échecs d'authentification

| Situation | Statut | Réponse |
| --- | --- | --- |
| En-tête absent | `403` | `{"error":"forbidden","message":"Missing X-Reseller-Key header"}` |
| Clé non reconnue | `403` | `{"error":"forbidden","message":"Invalid X-Reseller-Key"}` |
| Compte désactivé | `403` | `{"error":"forbidden","message":"This reseller account is disabled."}` |
| La licence n'est pas la vôtre | `404` | `{"error":"not_found"}` |

Un `403` ne vaut jamais la peine d'être réessayé — corrigez la clé, ou vérifiez
l'état de votre compte dans l'interface revendeur. Voir
[Erreurs](./errors.md) pour la liste complète.

## Renouveler votre clé

Vous pouvez détenir jusqu'à **deux** clés simultanément, ce qui permet un
renouvellement en recouvrement plutôt qu'une bascule brutale :

1. Créez une seconde clé dans **API Keys** de l'interface revendeur.
2. Déployez-la sur votre backend.
3. Vérifiez que le trafic a bien basculé vers la nouvelle clé.
4. Supprimez l'ancienne clé depuis cette même page.

Renouvelez régulièrement, et immédiatement si une clé a pu fuiter.
