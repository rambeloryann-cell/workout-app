// ─── GRILLE SEMAINE ───────────────────────────────────────────────────────────

function renderWeekGrid() {
  const grid = document.getElementById('weekGrid');
  const jours = ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'];
  const sessions = Storage.getSessions();
  const today = new Date().toISOString().split('T')[0];
  const programme = buildProgramme();

  grid.innerHTML = jours.map(jour => {
    const data = programme[jour];
    const isDispo = data.disponible;
    const isRepos = data.repos;
    const done = sessions.find(s => s.jour === jour && s.date === today && s.complete);
    const musclesLabel = isRepos ? 'Repos' : data.muscles.join(' + ');

    let cls = 'day-card';
    if (!isDispo && !isRepos) cls += ' locked';
    if (isRepos) cls += ' rest-day';
    if (done) cls += ' done';
    if (isDispo && !isRepos) cls += ' available';

    const icon = isRepos ? '😴' : done ? '✓' : isDispo ? '▶' : '🔒';

    return `
      <div class="${cls}" onclick="selectJour('${jour}')">
        <div class="day-name">${data.label}</div>
        <div class="day-muscles">${musclesLabel}</div>
        <div class="day-icon">${icon}</div>
        ${!isDispo && !isRepos ? '<div class="day-soon">Bientôt</div>' : ''}
      </div>
    `;
  }).join('');
}

function renderStreak() {
  const streak = Storage.getStreak();
  document.getElementById('streakDisplay').textContent = streak;
  const flame = document.getElementById('flameIcon');
  if (streak >= 7) flame.style.filter = 'hue-rotate(0deg) saturate(2)';
  else if (streak >= 3) flame.style.filter = 'hue-rotate(10deg) saturate(1.5)';
  else flame.style.filter = '';
}

function selectJour(jour) {
  const programme = buildProgramme();
  const data = programme[jour];
  if (!data.disponible) return;
  openSeance(jour, programme);
}
