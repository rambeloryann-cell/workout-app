// ─── PROGRESSION ─────────────────────────────────────────────────────────────

function renderProgression() {
  const sessions = Storage.getSessions();

  document.getElementById('statSessions').textContent = sessions.filter(s => !s.repos).length;
  document.getElementById('statStreak').textContent = Storage.getStreak();
  document.getElementById('statTotal').textContent =
    sessions.reduce((acc, s) => acc + (s.series || []).filter(e => e.complete).length, 0);

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

  list.innerHTML = [...sessions].reverse().slice(0, 10).map(s => {
    const done  = (s.series || []).filter(e => e.complete).length;
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

  const exercices = new Set();
  sessions.forEach(s => (s.series || []).forEach(e => { if (e.poids) exercices.add(e.exercice); }));

  const currentVal = select.value;
  select.innerHTML = exercices.size
    ? [...exercices].map(e => `<option value="${e}" ${e === currentVal ? 'selected' : ''}>${e}</option>`).join('')
    : '<option>Aucune donnée</option>';

  const choix = select.value;
  if (!choix || !exercices.size) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }

  const points = [];
  sessions.forEach(s => {
    (s.series || []).forEach(e => {
      if (e.exercice === choix && e.poids)
        points.push({ date: s.date, poids: parseFloat(e.poids), reps: e.reps });
    });
  });
  points.sort((a, b) => a.date.localeCompare(b.date));

  if (window._chart) window._chart.destroy();

  const isDark   = document.documentElement.getAttribute('data-theme') !== 'light';
  const accent   = isDark ? '#c8ff47' : '#2a5200';
  const grid     = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
  const textCol  = isDark ? '#7878a0' : '#606080';

  window._chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: points.map(p => p.date),
      datasets: [{
        data: points.map(p => p.poids),
        borderColor: accent,
        backgroundColor: accent + '22',
        borderWidth: 2,
        pointBackgroundColor: accent,
        pointRadius: 5,
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (c) => `${points[c.dataIndex].poids} kg · ${points[c.dataIndex].reps} reps` } }
      },
      scales: {
        x: { ticks: { color: textCol }, grid: { color: grid } },
        y: { ticks: { color: textCol }, grid: { color: grid } }
      }
    }
  });
}
