// ─── PLANNING ────────────────────────────────────────────────────────────────
// Gère l'ordre des jours, les jours de repos, et la logique de navigation
// dans la semaine. Indépendant des exercices et des blocs.

const JOURS_ORDRE = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

const JOURS_REPOS_DEFAULT = ['mardi', 'vendredi'];

// Retourne true si le jour est un jour de repos par défaut
function isReposDefault(jour) {
  return JOURS_REPOS_DEFAULT.includes(jour);
}

// Retourne le prochain jour d'entraînement après un jour donné
function getNextJourDispo(jourActuel, programme) {
  const idx = JOURS_ORDRE.indexOf(jourActuel);
  for (let i = 1; i <= 7; i++) {
    const next = JOURS_ORDRE[(idx + i) % 7];
    if (programme[next]?.disponible) return next;
  }
  return null;
}

// Retourne le jour actuel de la semaine (en clé lowercase)
function getJourAujourdhui() {
  const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  return jours[new Date().getDay()];
}

// Retourne true si deux jours sont consécutifs (pas de repos entre eux)
function sontConsecutifs(jour1, jour2) {
  const i1 = JOURS_ORDRE.indexOf(jour1);
  const i2 = JOURS_ORDRE.indexOf(jour2);
  return Math.abs(i1 - i2) === 1 || (i1 === 0 && i2 === 6) || (i1 === 6 && i2 === 0);
}

// Retourne le nombre de jours de repos entre deux séances
function joursEntreSeances(jour1, jour2) {
  const i1 = JOURS_ORDRE.indexOf(jour1);
  const i2 = JOURS_ORDRE.indexOf(jour2);
  const diff = (i2 - i1 + 7) % 7;
  return diff - 1;
}
