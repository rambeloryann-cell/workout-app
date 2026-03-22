# Workout Tracker

Application de suivi d'entraînement personnalisée. Fonctionne en local, sans serveur.

## Lancer l'app

1. Télécharge tous les fichiers en gardant la structure de dossiers
2. Ouvre `index.html` dans ton navigateur (Chrome ou Edge recommandé)

## Utilisation

- Onglet Programme : clique sur un jour disponible pour ouvrir la séance
- Onglet Séance : saisis le poids et les reps avec les spinners ▼ ▲, coche les exercices un par un ou clique "Tout cocher + repos" pour lancer le timer directement
- Onglet Progression : consulte tes stats, la courbe de progression par exercice, et l'historique

## Temps de repos

Par défaut à 4 min. Modifiable avec les boutons ▲ ▼ dans la séance avant de commencer.

## Sauvegarde

Les données sont stockées dans le localStorage du navigateur.
Utilise le bouton Exporter pour sauvegarder un fichier JSON sur ton PC.
Utilise le bouton Importer pour restaurer tes données depuis un fichier JSON.

Les données sont liées au navigateur. Si tu changes de navigateur, exporte d'abord depuis l'ancien et importe dans le nouveau.

## Ajouter une séance

Ouvre `js/programme.js` et passe `disponible: true` pour le jour voulu. Remplis les blocs et exercices en suivant le modèle du dimanche.

## Structure

Voir `docs/structure.md`

## Historique des modifications

Voir `docs/CHANGELOG.md`
