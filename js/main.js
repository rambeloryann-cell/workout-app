// ─── MAIN : Initialisation et UI ─────────────────────────────────────────────

let currentJour = null;
let restDuration = 4 * 60; // 4 min par défaut
let activeTimerKey = null;

// ─── INIT ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  renderWeekGrid();
  renderStreak();
  setupThemeToggle();
  setupTabs();
  setupImportExport();
  setupRestInput();
  renderProgression();
});

// ─── THÈME ────────────────────────────────────────────────────────────────────

function setupThemeToggle() {
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  btn.textContent = saved === 'dark' ? '☀ Clair' : '☾ Sombre';

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    btn.textContent = next === 'dark' ? '☀ Clair' : '☾ Sombre';
    document.getElementById('metaThemeColor').setAttribute('content', next === 'dark' ? '#0e0e12' : '#f2f2f7');
  });
}

// ─── TABS ─────────────────────────────────────────────────────────────────────

function setupTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
      if (tab.dataset.tab === 'tab-progression') renderProgression();
    });
  });
}

// ─── STREAK ───────────────────────────────────────────────────────────────────

function renderStreak() {
  const streak = Storage.getStreak();
  const el = document.getElementById('streakDisplay');
  el.textContent = `${streak}`;
  const flame = document.getElementById('flameIcon');
  if (streak >= 7) flame.style.filter = 'hue-rotate(0deg) saturate(2)';
  else if (streak >= 3) flame.style.filter = 'hue-rotate(10deg) saturate(1.5)';
}

// ─── GRILLE SEMAINE ───────────────────────────────────────────────────────────

function renderWeekGrid() {
  const grid = document.getElementById('weekGrid');
  const jours = ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'];
  const sessions = Storage.getSessions();
  const today = new Date().toISOString().split('T')[0];

  grid.innerHTML = jours.map(jour => {
    const data = PROGRAMME[jour];
    const isDispo = data.disponible;
    const isRepos = data.repos;
    const done = sessions.find(s => s.jour === jour && s.date === today && s.complete);

    let cls = 'day-card';
    if (!isDispo && !isRepos) cls += ' locked';
    if (isRepos) cls += ' rest-day';
    if (done) cls += ' done';
    if (isDispo && !isRepos) cls += ' available';

    const icon = isRepos ? '😴' : done ? '✓' : isDispo ? '▶' : '🔒';

    return `
      <div class="${cls}" onclick="selectJour('${jour}')">
        <div class="day-name">${data.label}</div>
        <div class="day-muscles">${data.muscles}</div>
        <div class="day-icon">${icon}</div>
        ${!isDispo && !isRepos ? '<div class="day-soon">Bientôt</div>' : ''}
      </div>
    `;
  }).join('');
}

// ─── SÉLECTIONNER UN JOUR ─────────────────────────────────────────────────────

function selectJour(jour) {
  const data = PROGRAMME[jour];
  if (!data.disponible) return;

  currentJour = jour;
  Tracker.init(jour);

  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector('[data-tab="tab-seance"]').classList.add('active');
  document.getElementById('tab-seance').classList.add('active');

  renderSeance();
}

// ─── TEMPS DE REPOS ───────────────────────────────────────────────────────────

function setupRestInput() {
  const input = document.getElementById('restInput');
  input.value = 4;
  input.addEventListener('change', () => {
    const val = parseInt(input.value);
    if (val >= 1 && val <= 10) restDuration = val * 60;
  });
}

function adjustRest(delta) {
  const input = document.getElementById('restInput');
  const val = Math.min(10, Math.max(1, (parseInt(input.value) || 4) + delta));
  input.value = val;
  restDuration = val * 60;
}

// ─── RENDU SÉANCE ─────────────────────────────────────────────────────────────

function renderSeance() {
  if (!currentJour) return;
  const jour = PROGRAMME[currentJour];
  const container = document.getElementById('seanceContainer');

  document.getElementById('emptySeance').style.display = 'none';
  document.getElementById('seanceContent').style.display = 'block';

  document.getElementById('seanceTitre').innerHTML =
    `<span>${jour.label.toUpperCase()}</span>`;
  document.getElementById('seanceMuscles').textContent = jour.muscles;

  container.innerHTML = jour.blocs.map(bloc => renderBloc(bloc)).join('');

  attachExerciceListeners();
}

function renderBloc(bloc) {
  let circuitsHTML = '';
  for (let c = 1; c <= bloc.circuits; c++) {
    circuitsHTML += renderCircuit(bloc, c);
  }

  return `
    <div class="bloc" id="bloc-${bloc.id}">
      <div class="bloc-header">
        <div>
          <div class="bloc-titre">${bloc.titre}</div>
          <div class="bloc-focus">${bloc.focus}</div>
        </div>
        <div class="bloc-badge" id="badge-${bloc.id}">0 / ${bloc.circuits * bloc.exercices.length}</div>
      </div>
      ${circuitsHTML}
    </div>
  `;
}


function renderCircuit(bloc, circuitNum) {
  const rows = bloc.exercices.map((ex, i) => {
    const key = `${bloc.id}_c${circuitNum}_${ex.id}`;
    return `
      <div class="exercise-row" id="row-${key}">
        <div class="ex-num">${i + 1}</div>
        <div class="ex-muscle">${ex.muscle}</div>
        <div class="ex-name">${ex.nom}</div>
        <div class="ex-spinner">
          <button class="ex-spin-btn" onclick="adjustInput('${key}','poids',-0.5)">▼</button>
          <input class="ex-input" type="number" placeholder="kg" min="0" step="0.5"
            id="input-${key}-poids" data-key="${key}" data-field="poids" />
          <button class="ex-spin-btn" onclick="adjustInput('${key}','poids',0.5)">▲</button>
        </div>
        <div class="ex-spinner">
          <button class="ex-spin-btn" onclick="adjustInput('${key}','reps',-1)">▼</button>
          <input class="ex-input" type="number" placeholder="${ex.repsMin}-${ex.repsMax}" min="0"
            id="input-${key}-reps" data-key="${key}" data-field="reps" />
          <button class="ex-spin-btn" onclick="adjustInput('${key}','reps',1)">▲</button>
        </div>
        <button class="ex-check" id="check-${key}" data-key="${key}" onclick="toggleCheck('${key}', '${bloc.id}', ${circuitNum})">
        </button>
      </div>
    `;
  }).join('');

  const timerKey = `${bloc.id}_c${circuitNum}`;
  const mins = String(Math.floor(restDuration / 60)).padStart(2, '0');

  return `
    <div class="circuit" id="circuit-${timerKey}">
      <div class="circuit-header">
        <div class="circuit-label">Circuit ${circuitNum}</div>
        <button class="btn-circuit-done" onclick="completeCircuit('${bloc.id}', ${circuitNum})">
          Tout cocher + repos
        </button>
      </div>
      ${rows}
      <div class="timer-bar" id="timer-${timerKey}">
        <div class="timer-display" id="timerDisplay-${timerKey}">${mins}:00</div>
        <div style="flex:1">
          <div class="timer-label">Repos — prochain circuit dans</div>
          <div class="timer-progress">
            <div class="timer-fill" id="timerFill-${timerKey}" style="width:100%"></div>
          </div>
        </div>
        <button class="btn-skip" onclick="Timer.skip()">Passer</button>
      </div>
    </div>
  `;
}


// ─── LISTENERS INPUTS ────────────────────────────────────────────────────────

function attachExerciceListeners() {
  document.querySelectorAll('.ex-input').forEach(input => {
    input.addEventListener('input', () => {
      const key = input.dataset.key;
      const field = input.dataset.field;
      if (field === 'poids') Tracker.setPoids(key, input.value);
      if (field === 'reps') Tracker.setReps(key, input.value);
    });
  });
}

function adjustInput(key, field, delta) {
  const input = document.getElementById(`input-${key}-${field}`);
  if (!input) return;
  const step = field === 'poids' ? 0.5 : 1;
  const current = parseFloat(input.value) || 0;
  const next = Math.max(0, Math.round((current + delta) / step) * step);
  input.value = next === 0 ? '' : next;
  if (field === 'poids') Tracker.setPoids(key, input.value);
  if (field === 'reps') Tracker.setReps(key, input.value);
}

// ─── COCHER UNE SÉRIE ────────────────────────────────────────────────────────

function toggleCheck(key, blocId, circuitNum) {
  const state = Tracker.get(key);
  const newVal = !state.checked;
  Tracker.setChecked(key, newVal);

  const btn = document.getElementById(`check-${key}`);
  const row = document.getElementById(`row-${key}`);
  btn.classList.toggle('checked', newVal);
  btn.textContent = newVal ? '✓' : '';
  row.classList.toggle('completed', newVal);

  updateBlocBadge(blocId);

  const exercices = PROGRAMME[currentJour].blocs.find(b => b.id === blocId).exercices;
  const circuitComplete = Tracker.isCircuitComplete(blocId, circuitNum, exercices);
  const timerKey = `${blocId}_c${circuitNum}`;

  if (circuitComplete && !Timer.isRunning()) {
    startRestTimer(timerKey);
  }
}

// Tout cocher d'un coup + lancer le timer
function completeCircuit(blocId, circuitNum) {
  const bloc = PROGRAMME[currentJour].blocs.find(b => b.id === blocId);
  const timerKey = `${blocId}_c${circuitNum}`;

  bloc.exercices.forEach(ex => {
    const key = `${blocId}_c${circuitNum}_${ex.id}`;
    Tracker.setChecked(key, true);
    const btn = document.getElementById(`check-${key}`);
    const row = document.getElementById(`row-${key}`);
    if (btn) { btn.classList.add('checked'); btn.textContent = '✓'; }
    if (row) row.classList.add('completed');
  });

  updateBlocBadge(blocId);

  if (!Timer.isRunning()) {
    startRestTimer(timerKey);
  }
}

function updateBlocBadge(blocId) {
  const bloc = PROGRAMME[currentJour].blocs.find(b => b.id === blocId);
  const total = bloc.circuits * bloc.exercices.length;
  let done = 0;

  for (let c = 1; c <= bloc.circuits; c++) {
    bloc.exercices.forEach(ex => {
      const key = `${blocId}_c${c}_${ex.id}`;
      if (Tracker.get(key).checked) done++;
    });
  }

  const badge = document.getElementById(`badge-${blocId}`);
  badge.textContent = `${done} / ${total}`;
  if (done === total) badge.classList.add('done');
  else badge.classList.remove('done');
}

// ─── TIMER REPOS ─────────────────────────────────────────────────────────────

function startRestTimer(timerKey) {
  activeTimerKey = timerKey;
  const timerBar = document.getElementById(`timer-${timerKey}`);
  const display = document.getElementById(`timerDisplay-${timerKey}`);
  const fill = document.getElementById(`timerFill-${timerKey}`);

  timerBar.classList.add('visible');

  Timer.start(
    restDuration,
    (remaining, total) => {
      display.textContent = Timer.formatTime(remaining);
      fill.style.width = `${(remaining / total) * 100}%`;
      if (remaining <= 10) display.classList.add('urgent');
      else display.classList.remove('urgent');
    },
    () => {
      timerBar.classList.remove('visible');
      display.classList.remove('urgent');
      showNotif('Repos terminé ! Reprends le circuit.');
      activeTimerKey = null;
    }
  );
}

// ─── SAUVEGARDER ─────────────────────────────────────────────────────────────

function saveSeance() {
  if (!currentJour) return;
  const session = Tracker.buildSession(currentJour, restDuration);
  const data = Storage.saveSession(session);
  renderStreak();
  renderWeekGrid();
  renderProgression();
  showNotif('Séance sauvegardée !');
}

// ─── PROGRESSION ─────────────────────────────────────────────────────────────

function renderProgression() {
  const sessions = Storage.getSessions();
  const statEl = document.getElementById('statSessions');
  const statStreak = document.getElementById('statStreak');
  const statTotal = document.getElementById('statTotal');

  statEl.textContent = sessions.filter(s => !s.repos).length;
  statStreak.textContent = Storage.getStreak();
  statTotal.textContent = sessions.reduce((acc, s) =>
    acc + (s.series || []).filter(e => e.complete).length, 0);

  renderHistorique(sessions);
  renderChart(sessions);
}

function renderHistorique(sessions) {
  const list = document.getElementById('historyList');
  if (!sessions.length) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-title">Aucune séance encore</div>
        <div>Lance ta première séance pour voir l'historique ici.</div>
      </div>`;
    return;
  }

  const sorted = [...sessions].reverse().slice(0, 10);
  list.innerHTML = sorted.map(s => {
    const done = (s.series || []).filter(e => e.complete).length;
    const total = (s.series || []).length;
    return `
      <div class="history-item">
        <div>
          <div class="history-date">${s.date} — ${s.label}</div>
          <div class="history-details">${s.muscles} · ${done}/${total} séries</div>
        </div>
        <div class="history-badge ${s.complete ? 'done' : ''}">${s.complete ? '✓ Complet' : 'Partiel'}</div>
      </div>
    `;
  }).join('');
}

function renderChart(sessions) {
  const select = document.getElementById('chartExercice');
  const canvas = document.getElementById('progressChart');
  const ctx = canvas.getContext('2d');

  // Construire la liste des exercices disponibles
  const exercices = new Set();
  sessions.forEach(s => (s.series || []).forEach(e => {
    if (e.poids) exercices.add(e.exercice);
  }));

  // Remplir le select
  const currentVal = select.value;
  select.innerHTML = exercices.size
    ? [...exercices].map(e => `<option value="${e}" ${e === currentVal ? 'selected' : ''}>${e}</option>`).join('')
    : '<option>Aucune donnée</option>';

  const choix = select.value;
  if (!choix || !exercices.size) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  const points = [];
  sessions.forEach(s => {
    (s.series || []).forEach(e => {
      if (e.exercice === choix && e.poids) {
        points.push({ date: s.date, poids: parseFloat(e.poids), reps: e.reps });
      }
    });
  });

  points.sort((a, b) => a.date.localeCompare(b.date));

  if (window._chart) window._chart.destroy();

  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const accentColor = isDark ? '#e8ff47' : '#1a1a2e';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
  const textColor = isDark ? '#6b6b80' : '#606080';

  window._chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: points.map(p => p.date),
      datasets: [{
        label: 'Poids (kg)',
        data: points.map(p => p.poids),
        borderColor: accentColor,
        backgroundColor: accentColor + '22',
        borderWidth: 2,
        pointBackgroundColor: accentColor,
        pointRadius: 5,
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const p = points[ctx.dataIndex];
              return `${p.poids} kg · ${p.reps} reps`;
            }
          }
        }
      },
      scales: {
        x: { ticks: { color: textColor }, grid: { color: gridColor } },
        y: { ticks: { color: textColor }, grid: { color: gridColor } }
      }
    }
  });
}

// ─── IMPORT / EXPORT ─────────────────────────────────────────────────────────

function setupImportExport() {
  document.getElementById('btnExport').addEventListener('click', () => {
    Storage.exportJSON();
    showNotif('Données exportées !');
  });

  document.getElementById('btnImport').addEventListener('click', () => {
    document.getElementById('importInput').click();
  });

  document.getElementById('importInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Storage.importJSON(file, (ok) => {
      if (ok) {
        renderStreak();
        renderWeekGrid();
        renderProgression();
        showNotif('Données importées !');
      } else {
        showNotif('Erreur lors de l\'import.');
      }
    });
  });
}

// ─── NOTIFICATION ─────────────────────────────────────────────────────────────

function showNotif(msg) {
  const el = document.getElementById('notif');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}
