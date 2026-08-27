---
id: errors
title: Erreurs
sidebar_label: Erreurs
---

# Erreurs

## Format des réponses

Les échecs renvoient du JSON avec un code `error` stable et un `message` lisible :

```json
{
  "error": "invalid_field",
  "message": "maxSlots must be a non-negative number"
}
```

Testez toujours `error`. Considérez `message` comme un texte d'affichage — sa
formulation peut changer.

## Codes de statut

| Statut | Signification |
| --- | --- |
| `200 OK` | L'opération a réussi. |
| `400 Bad Request` | Un élément du corps de votre requête est manquant ou invalide. |
| `403 Forbidden` | Votre clé revendeur est manquante, invalide, ou votre compte est désactivé. |
| `404 Not Found` | La licence ou le script n'existe pas — **ou ne vous appartient pas**. |
| `500 Internal Server Error` | Une erreur est survenue côté serveur. |

## Codes d'erreur

| `error` | Statut | Signification | Solution |
| --- | --- | --- | --- |
| `forbidden` | 403 | Clé manquante, invalide, ou compte désactivé. | Vérifiez l'en-tête `X-Reseller-Key`. Vérifiez la clé dans **API Keys**, ou contactez NexaLab si le compte est désactivé. |
| `not_found` | 404 | Licence inconnue, ou qui ne vous appartient pas. | Vérifiez la clé. Recherchez des espaces parasites ou un changement de casse. |
| `script_not_found` | 404 | Script inconnu, ou qui ne vous appartient pas. | Vérifiez que le `scriptId` correspond exactement à l'un de vos scripts. |
| `missing_fields` | 400 | Un champ requis est absent. | Fournissez `scriptId` lors de la création. |
| `invalid_field` | 400 | Un champ a un type ou une valeur invalide. | `maxSlots` doit être un nombre positif ou nul. |
| `no_fields` | 400 | Un `PATCH` ne contenait aucun champ modifiable. | Envoyez `maxSlots`, `expiresAt`, ou les deux. |
| `build_failed` | 500 | Le serveur n'a pas pu terminer l'opération. | Réessayez une fois avec un délai progressif. |
| `internal_error` | 500 | Erreur serveur inattendue. | Réessayez une fois avec un délai progressif. |

:::note[Le 404 est délibéré pour les licences qui ne sont pas les vôtres]
L'API répond `404` plutôt que `403` lorsqu'une licence appartient à un autre
revendeur, afin de ne jamais confirmer l'existence d'une clé. Si vous êtes
certain qu'une clé est valide et obtenez malgré tout un `404`, vérifiez qu'elle
appartient bien à l'un de *vos* scripts.
:::

## Politique de réessai

| Statut | Réessayer ? |
| --- | --- |
| `400` | Non — la requête est incorrecte. Corrigez-la. |
| `403` | Non — l'identifiant est incorrect. |
| `404` | Non — la ressource n'existe pas. |
| `500` | Oui, une fois, avec un délai progressif. |
| Délai d'attente réseau | Voir ci-dessous. |

**Les délais d'attente lors d'une création sont le seul cas délicat.** Un
`POST /api/reseller/licenses` qui expire peut malgré tout avoir abouti. Ne
réessayez pas aveuglément — vous généreriez deux clés pour une seule commande.
Enregistrez la correspondance commande/clé dès sa réception, et vérifiez avant
de réessayer.

Les opérations de suspension, modification et suppression peuvent toutes être
réessayées sans risque : les répéter produit le même état final.

## Dépannage

| Symptôme | Cause probable |
| --- | --- |
| `403 forbidden` sur toutes les requêtes | Clé non transmise, faute de frappe, ou saut de ligne parasite dans votre variable d'environnement. |
| `403` après un fonctionnement normal | Votre clé a été remplacée, ou votre compte désactivé. |
| `404 not_found` sur une clé tout juste créée | Mauvais environnement, ou clé copiée avec des espaces autour. |
| `404 script_not_found` | Le `scriptId` est mal orthographié ou le script ne vous appartient pas. |
| `400 no_fields` lors d'une modification | Vous n'avez envoyé que des champs non modifiables comme `note`. |
| Client encore actif juste après une suspension | Normal — la suspension met un court instant à s'appliquer. |
| Deux licences pour une seule commande | Une création réessayée. Ajoutez une déduplication par numéro de commande. |

## Recommandation de journalisation

Journalisez le code `error`, le statut HTTP et la clé de licence pour chaque
appel en échec. Lorsqu'un client signale un problème, ce trio suffit
généralement à identifier la cause sans rien reproduire.
