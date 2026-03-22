# Structure du projet

```
workout-app/
├── index.html              → Structure HTML, onglets, meta viewport et theme-color
├── style.css               → Design, thèmes dark/light, animations, spinners custom, responsive
├── js/
│   ├── programme.js        → Données des séances (blocs, exercices, dispo)
│   ├── storage.js          → Export / import JSON, streak, historique
│   ├── timer.js            → Logique du timer de repos
│   ├── tracker.js          → État de la séance en cours (cocher, poids, reps)
│   └── main.js             → Initialisation, rendu UI, interactions, adjustInput, adjustRest
├── data/
│   └── progression.json    → Exemple de structure de données exportées
└── docs/
    ├── README.md           → Comment lancer et utiliser l'app
    ├── CHANGELOG.md        → Historique des modifications
    └── structure.md        → Ce fichier
```

## Rôle de chaque fichier JS

### programme.js
Contient toutes les données du programme. Pour ajouter une séance, passe `disponible: true` sur le jour concerné et remplis les blocs. Aucun autre fichier à toucher.

### storage.js
Gère la persistance. Les données sont en localStorage. Export = téléchargement JSON. Import = rechargement depuis fichier. Les données sont propres à chaque navigateur et ne se synchronisent pas automatiquement.

### timer.js
Module isolé. Gère le compte à rebours, le tick, le skip. Appelé par main.js uniquement.

### tracker.js
Maintient l'état de la séance en cours : quels exercices sont cochés, poids et reps saisis. Construit l'objet session pour la sauvegarde.

### main.js
Point d'entrée. Orchestre le rendu HTML, les événements, et fait communiquer les autres modules.
Contient `adjustInput()` pour les spinners custom poids/reps et `adjustRest()` pour le temps de repos.

## Breakpoints responsive

- 768px : tablette, grille exercices ajustée
- 480px : mobile, grille semaine 2 colonnes, exercices en 2 lignes, boutons pleine largeur

## Structure d'une session sauvegardée

```json
{
  "date": "2026-03-22",
  "jour": "dimanche",
  "label": "Dimanche",
  "muscles": "Back + Triceps + Épaules",
  "repos": false,
  "restDuration": 240,
  "complete": true,
  "series": [
    {
      "bloc": "BLOC 1",
      "circuit": 1,
      "exercice": "Tractions prise large",
      "muscle": "Back",
      "poids": "0",
      "reps": "10",
      "complete": true
    }
  ]
}
```
