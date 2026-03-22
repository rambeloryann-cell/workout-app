// ─── PROGRAMME COMPLET ───────────────────────────────────────────────────────
// Pour ajouter une séance : copier un bloc "disponible" et remplir les données.
// Mettre disponible: false pour désactiver une séance.

const PROGRAMME = {
  lundi: {
    label: "Lundi",
    muscles: "Chest + Biceps",
    disponible: false,
    blocs: []
  },
  mardi: {
    label: "Mardi",
    muscles: "Repos",
    disponible: false,
    repos: true,
    blocs: []
  },
  mercredi: {
    label: "Mercredi",
    muscles: "Back + Triceps",
    disponible: false,
    blocs: []
  },
  jeudi: {
    label: "Jeudi",
    muscles: "Épaules + Legs",
    disponible: false,
    blocs: []
  },
  vendredi: {
    label: "Vendredi",
    muscles: "Repos",
    disponible: false,
    repos: true,
    blocs: []
  },
  samedi: {
    label: "Samedi",
    muscles: "Chest + Biceps",
    disponible: false,
    blocs: []
  },
  dimanche: {
    label: "Dimanche",
    muscles: "Back + Triceps + Épaules",
    disponible: true,
    blocs: [
      {
        id: "b1",
        titre: "BLOC 1",
        focus: "Grand dorsal largeur · Triceps longue portion · Épaules latéral",
        circuits: 2,
        exercices: [
          { id: "b1e1", muscle: "Back",     nom: "Tractions prise large",          repsMin: 8, repsMax: 12 },
          { id: "b1e2", muscle: "Triceps",  nom: "Dips entre deux chaises",         repsMin: 8, repsMax: 12 },
          { id: "b1e3", muscle: "Épaules",  nom: "Élévations latérales (7,5 kg)",  repsMin: 8, repsMax: 12 }
        ]
      },
      {
        id: "b2",
        titre: "BLOC 2",
        focus: "Grand dorsal épaisseur · Triceps portion latérale · Épaules antérieur",
        circuits: 2,
        exercices: [
          { id: "b2e1", muscle: "Back",     nom: "Rowing haltère sur table",        repsMin: 8, repsMax: 12 },
          { id: "b2e2", muscle: "Triceps",  nom: "Extensions nuque haltère (7,5 kg)", repsMin: 8, repsMax: 12 },
          { id: "b2e3", muscle: "Épaules",  nom: "Élévations frontales (7,5 kg)",  repsMin: 8, repsMax: 12 }
        ]
      },
      {
        id: "b3",
        titre: "BLOC 3",
        focus: "Trapèzes · Triceps portion médiale · Épaules postérieur",
        circuits: 2,
        exercices: [
          { id: "b3e1", muscle: "Back",     nom: "Tractions prise neutre serrée",  repsMin: 8, repsMax: 12 },
          { id: "b3e2", muscle: "Triceps",  nom: "Kickback haltère (7,5 kg)",      repsMin: 8, repsMax: 12 },
          { id: "b3e3", muscle: "Épaules",  nom: "Oiseau haltères (7,5 kg)",       repsMin: 8, repsMax: 12 }
        ]
      }
    ]
  }
};
