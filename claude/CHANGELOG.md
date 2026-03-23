# Changelog

## Session 5 — Refonte majeure

- Nouvelle arborescence : js/core, js/data, js/ui
- Création de planning.js : ordre des jours, jours de repos, navigation semaine
- programme.js nettoyé : délègue les jours de repos à planning.js via buildProgramme()
- Menu burger sur mobile (flamme, thème, export, import derrière ≡)
- Séance progressive : les blocs apparaissent un par un
- Bouton "Bloc suivant →" entre chaque bloc
- Bouton save apparaît uniquement à la fin de la séance
- Onglet Réglages : personnalisation des muscles et circuits par jour
- exercices.js séparé pour faciliter l'ajout d'exercices
- Création de CONTEXTE.md : mémoire complète du projet
- Programme mis à jour : lundi Biceps+Triceps, mercredi Chest+Avant-bras, jeudi Back+Épaules, samedi Chest+Legs, dimanche Back+Épaules
- Responsive mobile amélioré
- .gitignore ajouté (.vscode/, .DS_Store, Thumbs.db)

## Session 4

- Responsive mobile complet (breakpoints 520px et 768px)
- Grille semaine 2 colonnes sur mobile, Dimanche pleine largeur
- Meta viewport et theme-color ajoutés
- Barre navigateur colorée selon thème actif

## Session 3

- Spinners custom (▼ ▲) sur poids, reps et temps de repos
- Amélioration contraste dark mode (texte plus lisible)
- Correction color-scheme des inputs pour dark/light mode

## Session 2

- Bouton "Tout cocher + repos" par circuit
- Correction affichage timer selon restDuration réel
- Ajout circuit-header avec label + bouton alignés

## Session 1

- Création du projet
- Arborescence initiale
- Séance Dimanche : Back + Épaules, 3 blocs x 2 circuits
- Timer 4 min modifiable entre chaque circuit
- Sauvegarde progression en JSON (export / import)
- Courbe de progression par exercice (Chart.js)
- Dark mode / Light mode
- Streak 🔥 avec flamme incrémentale
- Grille semaine : Dimanche disponible, autres verrouillés

## Session 6

- Correction bug burger menu mobile : boutons Clair, Exporter, Importer ne répondaient pas
- IDs dupliqués corrigés (themeToggleMobile, btnExportMobile, btnImportMobile)
- burger-menu fermé : pointer-events: none ajouté (empêche interception de clics hors écran)
- desktop-only : pointer-events: none ajouté sur mobile

## Session 7

- Suppression de l'overlay burger (interceptait les clics avant les boutons)
- Burger menu : fermeture via click document en dehors du menu
- Ajout e.stopPropagation() sur tous les boutons du burger
- Remplacement pointer-events par logique document.addEventListener('click')
