// ─── EXERCICES PAR MUSCLE ────────────────────────────────────────────────────
// Pour ajouter un exercice : ajouter un objet dans le tableau du muscle concerné.
// Format : { id, nom, focus, repsMin, repsMax }

const EXERCICES = {

  Back: [
    { id: "back_1", nom: "Tractions prise large",       focus: "Grand dorsal largeur" },
    { id: "back_2", nom: "Tractions prise neutre serrée", focus: "Grand dorsal épaisseur" },
    { id: "back_3", nom: "Rowing haltère sur table",    focus: "Grand dorsal épaisseur" },
    { id: "back_4", nom: "Rowing élastique",            focus: "Trapèzes" },
    { id: "back_5", nom: "Superman au sol",             focus: "Lombaires" },
  ],

  Chest: [
    { id: "chest_1", nom: "Pompes classiques",          focus: "Pectoraux milieu" },
    { id: "chest_2", nom: "Pompes inclinées",           focus: "Pectoraux hauts" },
    { id: "chest_3", nom: "Pompes déclinées",           focus: "Pectoraux bas" },
    { id: "chest_4", nom: "Écartés haltères (7,5 kg)",  focus: "Pectoraux étirement" },
    { id: "chest_5", nom: "Pompes diamant",             focus: "Pectoraux internes" },
  ],

  Epaules: [
    { id: "ep_1", nom: "Élévations latérales (7,5 kg)", focus: "Faisceau latéral" },
    { id: "ep_2", nom: "Élévations frontales (7,5 kg)", focus: "Faisceau antérieur" },
    { id: "ep_3", nom: "Oiseau haltères (7,5 kg)",      focus: "Faisceau postérieur" },
    { id: "ep_4", nom: "Arnold press (7,5 kg)",         focus: "Épaules complet" },
    { id: "ep_5", nom: "Tirage menton élastique",       focus: "Trapèzes + épaules" },
  ],

  Biceps: [
    { id: "bi_1", nom: "Curl haltères (7,5 kg)",        focus: "Biceps chef long" },
    { id: "bi_2", nom: "Curl marteau (7,5 kg)",         focus: "Brachial + avant-bras" },
    { id: "bi_3", nom: "Curl concentré (7,5 kg)",       focus: "Biceps pic" },
    { id: "bi_4", nom: "Curl barre elastique",          focus: "Biceps complet" },
  ],

  Triceps: [
    { id: "tri_1", nom: "Dips entre deux chaises",      focus: "Triceps longue portion" },
    { id: "tri_2", nom: "Extensions nuque (7,5 kg)",    focus: "Triceps longue portion" },
    { id: "tri_3", nom: "Kickback haltère (7,5 kg)",    focus: "Triceps portion médiale" },
    { id: "tri_4", nom: "Pompes triceps serrées",       focus: "Triceps portion latérale" },
  ],

  Legs: [
    { id: "leg_1", nom: "Squats au poids du corps",     focus: "Quadriceps + fessiers" },
    { id: "leg_2", nom: "Fentes alternées",             focus: "Quadriceps + fessiers" },
    { id: "leg_3", nom: "Squats sautés",                focus: "Explosivité" },
    { id: "leg_4", nom: "Hip thrust au sol",            focus: "Fessiers" },
    { id: "leg_5", nom: "Mollets debout",               focus: "Mollets" },
  ],

  AvantBras: [
    { id: "av_1", nom: "Curl poignets haltère (7,5 kg)", focus: "Fléchisseurs avant-bras" },
    { id: "av_2", nom: "Reverse curl (7,5 kg)",          focus: "Extenseurs avant-bras" },
    { id: "av_3", nom: "Farmer walk (7,5 kg)",           focus: "Prise en main" },
  ],

};

// Reps par défaut pour tous les exercices
const REPS_DEFAULT = { min: 8, max: 12 };
