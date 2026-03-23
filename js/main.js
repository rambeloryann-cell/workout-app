// ─── MAIN : Point d'entrée ────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  setupHeader();
  setupTabs();
  setupRestInput();
  renderWeekGrid();
  renderStreak();
  renderProgression();
});

function setupTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
      if (tab.dataset.tab === 'tab-progression') renderProgression();
      if (tab.dataset.tab === 'tab-settings')    renderSettings();
    });
  });
}

function showNotif(msg) {
  const el = document.getElementById('notif');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}
