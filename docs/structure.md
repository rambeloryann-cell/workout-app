# Structure du projet

```
workout-app/
├── index.html                 → Structure HTML, onglets, ordre de chargement des scripts
├── style.css                  → Design, thèmes dark/light, animations, spinners, responsive
├── .gitignore                 → Fichiers exclus de Git (.vscode, .DS_Store, Thumbs.db)
├── js/
│   ├── main.js                → Point d'entrée, init, tabs, showNotif
│   ├── core/
│   │   ├── storage.js         → localStorage, export/import JSON, streak, overrides
│   │   ├── timer.js           → Compte à rebours, tick, skip
│   │   └── tracker.js         → État séance en cours (cocher, poids, reps, buildSession)
│   ├── data/
│   │   ├── exercices.js       → Tous les exercices par muscle — ajouter ici
│   │   ├── planning.js        → Ordre des jours, jours de repos, fonctions navigation
│   │   └── programme.js       → Séances (muscles + blocs) + buildProgramme()
│   └── ui/
│       ├── header.js          → Burger menu, thème dark/light, import/export
│       ├── weekGrid.js        → Grille semaine, streak, selectJour()
│       ├── seance.js          → Séance progressive bloc par bloc, timer, save
│       ├── settings.js        → Personnalisation muscles + circuits par jour
│       └── progression.js     → Stats, courbe Chart.js, historique
├── data/
│   └── progression.json       → Exemple de structure de données exportées
└── docs/
    ├── README.md              → Comment lancer et utiliser l'app
    ├── CHANGELOG.md           → Historique des modifications par session
    ├── structure.md           → Ce fichier
    └── CONTEXTE.md            → Mémoire complète du projet (à lire en début de session)
```

## Responsabilités par fichier

### planning.js
Seul fichier qui connaît l'ordre des jours et les jours de repos.
`buildProgramme()` dans programme.js l'appelle pour injecter `repos: true/false`.
Pour changer les jours de repos : modifier `JOURS_REPOS_DEFAULT` ici uniquement.

### programme.js
Contient les séances (muscles assignés + blocs + exercices).
Ne contient plus `repos: true/false` directement, délégué à planning.js.
Pour activer une séance : `disponible: true` + remplir `blocs`.

### exercices.js
Liste complète des exercices par muscle.
Pour ajouter un exercice : ajouter dans le bon tableau, aucun autre fichier à toucher.

### storage.js
Gère deux clés localStorage : `workoutData` (sessions + streak) et `programmeOverrides` (réglages utilisateur).
Export = les deux clés dans un seul fichier JSON.
Import = restore les deux clés + support ancien format.

### seance.js
Affiche les blocs un par un (progressif).
Le bouton "Bloc suivant →" apparaît quand un bloc est terminé.
Le bouton Sauvegarder apparaît uniquement après le dernier bloc.

## Ordre de chargement des scripts (index.html)

```
storage → timer → tracker → exercices → planning → programme
→ header → weekGrid → seance → settings → progression → main
```

## Breakpoints responsive

- 768px : tablette (grille exercices ajustée)
- 520px : mobile (burger menu, grille 2 colonnes, exercise row 2 lignes, save pleine largeur)
