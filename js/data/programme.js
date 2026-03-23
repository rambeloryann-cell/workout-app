// ─── PROGRAMME PAR DÉFAUT ────────────────────────────────────────────────────
// Contient uniquement les séances (muscles + blocs).
// Les jours de repos sont définis dans planning.js (JOURS_REPOS_DEFAULT).
// Pour activer une séance : passer disponible: true et remplir les blocs.

const PROGRAMME_DEFAULT = {
  lundi: {
    label: "Lundi",
    disponible: false,
    muscles: ["Biceps", "Triceps"],
    blocs: []
  },
  mardi: {
    label: "Mardi",
    disponible: false,
    muscles: [],
    blocs: []
  },
  mercredi: {
    label: "Mercredi",
    disponible: false,
    muscles: ["Chest", "AvantBras"],
    blocs: []
  },
  jeudi: {
    label: "Jeudi",
    disponible: false,
    muscles: ["Back", "Epaules"],
    blocs: []
  },
  vendredi: {
    label: "Vendredi",
    disponible: false,
    muscles: [],
    blocs: []
  },
  samedi: {
    label: "Samedi",
    disponible: false,
    muscles: ["Chest", "Legs"],
    blocs: []
  },
  dimanche: {
    label: "Dimanche",
    disponible: true,
    muscles: ["Back", "Epaules"],
    blocs: [
      {
        id: "b1",
        titre: "BLOC 1",
        focus: "Grand dorsal largeur · Épaules latéral",
        circuits: 2,
        exercices: [
          { muscle: "Back",    exId: "back_1" },
          { muscle: "Epaules", exId: "ep_1"   }
        ]
      },
      {
        id: "b2",
        titre: "BLOC 2",
        focus: "Grand dorsal épaisseur · Épaules antérieur",
        circuits: 2,
        exercices: [
          { muscle: "Back",    exId: "back_3" },
          { muscle: "Epaules", exId: "ep_2"   }
        ]
      },
      {
        id: "b3",
        titre: "BLOC 3",
        focus: "Grand dorsal épaisseur · Épaules postérieur",
        circuits: 2,
        exercices: [
          { muscle: "Back",    exId: "back_2" },
          { muscle: "Epaules", exId: "ep_3"   }
        ]
      }
    ]
  }
};

// Résoudre un exercice depuis son ID
function resolveExercice(exId, muscle) {
  const list = EXERCICES[muscle] || [];
  return list.find(e => e.id === exId) || null;
}

// Construire le programme actif (défaut + overrides utilisateur + repos depuis planning.js)
function buildProgramme() {
  const overrides = Storage.getProgrammeOverrides();
  const programme = JSON.parse(JSON.stringify(PROGRAMME_DEFAULT));

  // Injecter les jours de repos depuis planning.js
  JOURS_ORDRE.forEach(jour => {
    programme[jour].repos = isReposDefault(jour);
  });

  // Appliquer les overrides utilisateur
  Object.keys(overrides).forEach(jour => {
    if (programme[jour]) {
      if (overrides[jour].muscles) programme[jour].muscles = overrides[jour].muscles;
      if (overrides[jour].circuits !== undefined) {
        programme[jour].blocs.forEach(b => b.circuits = overrides[jour].circuits);
      }
    }
  });

  return programme;
}

