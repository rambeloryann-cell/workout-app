# Workout Tracker

Application de suivi d'entraînement personnalisée. Fonctionne en local, sans serveur.

## Lancer l'app

1. Télécharge tous les fichiers en gardant la structure de dossiers
2. Ouvre `index.html` dans ton navigateur (Chrome ou Edge)

## Utilisation

- Onglet Programme : clique sur un jour disponible pour lancer la séance
- Onglet Séance : les blocs apparaissent un par un, coche les exercices, puis clique "Bloc suivant →"
- Onglet Progression : stats, courbe de progression par exercice, historique
- Onglet Réglages : change les muscles de chaque jour et le nombre de circuits

## Temps de repos

Par défaut 4 min. Modifiable avec les boutons ▲ ▼ en haut de la séance.

## Sauvegarde

Les données sont dans le localStorage du navigateur.
Exporte régulièrement via le bouton Exporter (ou menu ≡ sur mobile).
Le fichier JSON contient les sessions ET les réglages du programme.
Pour restaurer, clique Importer et sélectionne ton fichier JSON.

## Ajouter un exercice à un muscle

Ouvre `js/data/exercices.js` et ajoute un objet dans le tableau du muscle :
```js
{ id: "back_6", nom: "Tirage buste penché", focus: "Grand dorsal" }
```

## Ajouter une séance

Ouvre `js/data/programme.js` :
1. Passe `disponible: true` pour le jour voulu
2. Remplis les blocs en référençant les IDs de `exercices.js`

## Changer les jours de repos

Ouvre `js/data/planning.js` et modifie `JOURS_REPOS_DEFAULT`.

## Structure complète

Voir `docs/structure.md`

## Mémoire du projet

Voir `docs/CONTEXTE.md`

## Historique des modifications

Voir `docs/CHANGELOG.md`
