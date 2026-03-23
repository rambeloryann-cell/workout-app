// ─── SÉANCE PROGRESSIVE ──────────────────────────────────────────────────────

let currentJour = null;
let currentProgramme = null;
let currentBlocIndex = 0;
let restDuration = 4 * 60;

function openSeance(jour, programme) {
  currentJour = jour;
  currentProgramme = programme;
  currentBlocIndex = 0;

  const data = programme[jour];
  Tracker.init(data.blocs);

  // Basculer vers l'onglet séance
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector('[data-tab="tab-seance"]').classList.add('active');
  document.getElementById('tab-seance').classList.add('active');

  renderSeanceShell();
  revealBloc(0);
}

function renderSeanceShell() {
  const data = currentProgramme[currentJour];
  document.getElementById('emptySeance').style.display = 'none';
  document.getElementById('seanceContent').style.display = 'block';
  document.getElementById('seanceTitre').textContent = data.label.toUpperCase();
  document.getElementById('seanceMuscles').textContent = data.muscles.join(' + ');

  const restInput = document.getElementById('restInput');
  restInput.value = restDuration / 60;

  // Vider le container
  const container = document.getElementById('seanceContainer');
  container.innerHTML = '';

  // Créer les blocs masqués
  data.blocs.forEach((bloc, i) => {
    const el = document.createElement('div');
    el.id = `bloc-wrapper-${i}`;
    el.className = 'bloc-wrapper hidden';
    el.innerHTML = renderBlocHTML(bloc, i);
    container.appendChild(el);
  });

  // Bouton save caché au début
  document.getElementById('saveSection').style.display = 'none';
}

function revealBloc(index) {
  currentBlocIndex = index;
  const wrapper = document.getElementById(`bloc-wrapper-${index}`);
  if (!wrapper) return;

  wrapper.classList.remove('hidden');
  wrapper.classList.add('reveal');

  // Scroll vers le bloc
  setTimeout(() => wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
}

function renderBlocHTML(bloc, blocIndex) {
  let circuitsHTML = '';
  for (let c = 1; c <= bloc.circuits; c++) {
    circuitsHTML += renderCircuitHTML(bloc, c);
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
      <div class="bloc-next" id="next-${bloc.id}" style="display:none">
        <button class="btn-next-bloc" onclick="onNextBloc(${blocIndex})">
          Bloc suivant →
        </button>
      </div>
    </div>
  `;
}

function renderCircuitHTML(bloc, circuitNum) {
  const rows = bloc.exercices.map((ex, i) => {
    const exData = resolveExercice(ex.exId, ex.muscle);
    if (!exData) return '';
    const key = `${bloc.id}_c${circuitNum}_${ex.exId}`;

    return `
      <div class="exercise-row" id="row-${key}">
        <div class="ex-num">${i + 1}</div>
        <div class="ex-muscle">${ex.muscle}</div>
        <div class="ex-name">
          <div class="ex-nom">${exData.nom}</div>
          <div class="ex-focus">${exData.focus}</div>
        </div>
        <div class="ex-spinner">
          <button class="ex-spin-btn" onclick="adjustInput('${key}','poids',-0.5)">▼</button>
          <input class="ex-input" type="number" placeholder="kg" min="0" step="0.5"
            id="input-${key}-poids" data-key="${key}" data-field="poids" />
          <button class="ex-spin-btn" onclick="adjustInput('${key}','poids',0.5)">▲</button>
        </div>
        <div class="ex-spinner">
          <button class="ex-spin-btn" onclick="adjustInput('${key}','reps',-1)">▼</button>
          <input class="ex-input" type="number" placeholder="${REPS_DEFAULT.min}-${REPS_DEFAULT.max}" min="0"
            id="input-${key}-reps" data-key="${key}" data-field="reps" />
          <button class="ex-spin-btn" onclick="adjustInput('${key}','reps',1)">▲</button>
        </div>
        <button class="ex-check" id="check-${key}" onclick="toggleCheck('${key}','${bloc.id}',${circuitNum})"></button>
      </div>
    `;
  }).join('');

  const timerKey = `${bloc.id}_c${circuitNum}`;
  const mins = String(Math.floor(restDuration / 60)).padStart(2, '0');

  return `
    <div class="circuit" id="circuit-${timerKey}">
      <div class="circuit-header">
        <div class="circuit-label">Circuit ${circuitNum}</div>
        <button class="btn-circuit-done" onclick="completeCircuit('${bloc.id}',${circuitNum})">
          Tout cocher + repos
        </button>
      </div>
      ${rows}
      <div class="timer-bar" id="timer-${timerKey}">
        <div class="timer-display" id="timerDisplay-${timerKey}">${mins}:00</div>
        <div class="timer-info">
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

// ─── INTERACTIONS ─────────────────────────────────────────────────────────────

function toggleCheck(key, blocId, circuitNum) {
  const newVal = !Tracker.get(key).checked;
  Tracker.setChecked(key, newVal);

  const btn = document.getElementById(`check-${key}`);
  const row = document.getElementById(`row-${key}`);
  if (btn) { btn.classList.toggle('checked', newVal); btn.textContent = newVal ? '✓' : ''; }
  if (row) row.classList.toggle('completed', newVal);

  updateBlocBadge(blocId);
  checkBlocComplete(blocId, circuitNum);
}

function completeCircuit(blocId, circuitNum) {
  const blocs = currentProgramme[currentJour].blocs;
  const bloc = blocs.find(b => b.id === blocId);
  const timerKey = `${blocId}_c${circuitNum}`;

  bloc.exercices.forEach(ex => {
    const key = `${blocId}_c${circuitNum}_${ex.exId}`;
    Tracker.setChecked(key, true);
    const btn = document.getElementById(`check-${key}`);
    const row = document.getElementById(`row-${key}`);
    if (btn) { btn.classList.add('checked'); btn.textContent = '✓'; }
    if (row) row.classList.add('completed');
  });

  updateBlocBadge(blocId);
  checkBlocComplete(blocId, circuitNum);

  if (!Timer.isRunning()) startRestTimer(timerKey, blocId, circuitNum);
}

function checkBlocComplete(blocId, circuitNum) {
  const blocs = currentProgramme[currentJour].blocs;
  const bloc = blocs.find(b => b.id === blocId);
  const blocIndex = blocs.indexOf(bloc);

  if (Tracker.isBlocComplete(blocId, bloc.circuits, bloc.exercices)) {
    document.getElementById(`bloc-${blocId}`)?.classList.add('done');

    const hasNext = blocIndex + 1 < blocs.length;
    if (hasNext) {
      document.getElementById(`next-${blocId}`).style.display = 'flex';
    } else {
      // Dernière bloc : afficher le bouton save
      document.getElementById('saveSection').style.display = 'flex';
      showNotif('Séance terminée ! Sauvegarde ta progression.');
    }
  }
}

function onNextBloc(currentIndex) {
  const nextIndex = currentIndex + 1;
  const blocs = currentProgramme[currentJour].blocs;
  if (nextIndex < blocs.length) {
    revealBloc(nextIndex);
    document.getElementById(`next-${blocs[currentIndex].id}`).style.display = 'none';
  }
}

function updateBlocBadge(blocId) {
  const blocs = currentProgramme[currentJour].blocs;
  const bloc = blocs.find(b => b.id === blocId);
  const total = bloc.circuits * bloc.exercices.length;
  let done = 0;
  for (let c = 1; c <= bloc.circuits; c++) {
    bloc.exercices.forEach(ex => {
      if (Tracker.get(`${blocId}_c${c}_${ex.exId}`).checked) done++;
    });
  }
  const badge = document.getElementById(`badge-${blocId}`);
  if (badge) {
    badge.textContent = `${done} / ${total}`;
    badge.classList.toggle('done', done === total);
  }
}

// ─── INPUTS ──────────────────────────────────────────────────────────────────

function adjustInput(key, field, delta) {
  const input = document.getElementById(`input-${key}-${field}`);
  if (!input) return;
  const step = field === 'poids' ? 0.5 : 1;
  const current = parseFloat(input.value) || 0;
  const next = Math.max(0, Math.round((current + delta) / step) * step);
  input.value = next === 0 ? '' : next;
  if (field === 'poids') Tracker.setPoids(key, input.value);
  if (field === 'reps')  Tracker.setReps(key, input.value);
}

function setupRestInput() {
  const input = document.getElementById('restInput');
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

// ─── TIMER ───────────────────────────────────────────────────────────────────

function startRestTimer(timerKey, blocId, circuitNum) {
  const timerBar = document.getElementById(`timer-${timerKey}`);
  const display  = document.getElementById(`timerDisplay-${timerKey}`);
  const fill     = document.getElementById(`timerFill-${timerKey}`);
  if (!timerBar) return;

  timerBar.classList.add('visible');

  Timer.start(
    restDuration,
    (remaining, total) => {
      display.textContent = Timer.formatTime(remaining);
      fill.style.width = `${(remaining / total) * 100}%`;
      display.classList.toggle('urgent', remaining <= 10);
    },
    () => {
      timerBar.classList.remove('visible');
      display.classList.remove('urgent');
      showNotif('Repos terminé ! Reprends.');
    }
  );
}

// ─── SAVE ────────────────────────────────────────────────────────────────────

function saveSeance() {
  if (!currentJour) return;
  const data = currentProgramme[currentJour];
  const session = Tracker.buildSession(currentJour, data.label, data.muscles, data.blocs, restDuration);
  Storage.saveSession(session);
  renderStreak();
  renderWeekGrid();
  showNotif('Séance sauvegardée !');
}

function resetSeance() {
  if (!currentJour) return;
  openSeance(currentJour, currentProgramme);
}
