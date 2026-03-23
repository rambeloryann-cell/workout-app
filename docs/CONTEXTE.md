# CONTEXTE DU PROJET — Workout Tracker

Ce fichier est la mémoire complète du projet.
Copie-colle son contenu en début de nouvelle session pour reprendre exactement là où on s'est arrêtés.

---

## Profil utilisateur

- Niveau : intermédiaire (2 ans de musculation, reprise après pause)
- Objectif : prise de masse
- Matériel : barre de traction murale, 2 haltères 7,5 kg, élastiques, chaise, table
- Récupération : 1,6 à 2,2g de protéines/kg/jour, 7-9h de sommeil, +200 à +400 kcal/jour

---

## Programme musculaire validé

| Jour       | Séance                  | Statut      |
|------------|-------------------------|-------------|
| Lundi      | Biceps + Triceps        | À faire     |
| Mardi      | Repos                   | Repos       |
| Mercredi   | Chest + Avant-bras      | À faire     |
| Jeudi      | Back + Épaules          | À faire     |
| Vendredi   | Repos                   | Repos       |
| Samedi     | Chest + Legs            | À faire     |
| Dimanche   | Back + Épaules          | Disponible  |

- 3 blocs x 2 circuits par séance (modifiable dans Réglages)
- 8 à 12 reps par exercice
- 4 min de repos entre chaque circuit (modifiable)

---

## Règles musculaires strictes

- Pas de muscles interdépendants ensemble (chest + triceps interdit, back + biceps interdit)
- Biceps avant Back : ok / Back puis Biceps le lendemain : interdit
- Triceps avant Chest : ok / Chest puis Triceps le lendemain : interdit
- Chest et Épaules : espacer d'au moins 1 jour

---

## Architecture du projet

```
workout-app/
├── index.html
├── style.css
├── .gitignore
├── js/
│   ├── main.js
│   ├── core/
│   │   ├── storage.js
│   │   ├── timer.js
│   │   └── tracker.js
│   ├── data/
│   │   ├── exercices.js       → ajouter exercices ici
│   │   ├── planning.js        → jours de repos ici
│   │   └── programme.js       → activer séances ici
│   └── ui/
│       ├── header.js
│       ├── weekGrid.js
│       ├── seance.js
│       ├── settings.js
│       └── progression.js
├── data/
│   └── progression.json
└── docs/
    ├── README.md
    ├── CHANGELOG.md
    ├── structure.md
    └── CONTEXTE.md
```

---

## Fonctionnalités implémentées

- Grille semaine avec jours disponibles / verrouillés / repos
- Séance progressive : blocs apparaissent un par un avec animation
- Bouton "Bloc suivant →" entre chaque bloc
- Bouton "Tout cocher + repos" par circuit
- Bouton Sauvegarder apparaît uniquement à la fin
- Spinners custom ▼ ▲ pour poids, reps et temps de repos
- Timer de repos configurable (défaut 4 min)
- Sauvegarde localStorage + export/import JSON
- Streak 🔥 incrémental
- Dark mode / Light mode
- Menu burger ≡ sur mobile (thème, export, import)
- Onglet Réglages : changer muscles et circuits par jour
- Courbe de progression par exercice (Chart.js)
- Historique des 10 dernières séances
- Responsive mobile (520px) et tablette (768px)
- .gitignore avec .vscode/ exclu

---

## Prochaines étapes

- Ajouter les séances : lundi, mercredi, jeudi, samedi
- Publier sur GitHub Pages
- Tester sur vrai téléphone Android

---

## Décisions techniques

- Stockage : localStorage uniquement (pas de backend)
- Export JSON : contient sessions + overrides programme en un seul fichier
- Pas de framework, HTML/CSS/JS vanilla
- Chart.js 4.4.0 via CDN jsdelivr
- planning.js est la seule source de vérité pour les jours de repos
- programme.js ne définit plus repos directement, délégué à planning.js via buildProgramme()
- exercices.js : ajouter un exercice = toucher uniquement ce fichier
- programme.js : activer une séance = toucher uniquement ce fichier

---

## Historique des sessions

- Session 1 : création, séance dimanche, timer, JSON, streak, dark/light
- Session 2 : bouton "Tout cocher + repos", timer corrigé
- Session 3 : spinners custom, contraste dark mode
- Session 4 : responsive mobile complet
- Session 5 : refonte majeure, nouvelle arborescence, planning.js, burger menu, séance progressive, réglages, CONTEXTE.md
