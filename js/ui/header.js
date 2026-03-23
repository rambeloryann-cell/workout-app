// ─── HEADER & BURGER MENU ────────────────────────────────────────────────────

function setupHeader() {
  setupThemeToggle();
  setupBurgerMenu();
  setupImportExport();
}

function setupThemeToggle() {
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  btn.textContent = saved === 'dark' ? '☀ Clair' : '☾ Sombre';
  document.getElementById('metaThemeColor')?.setAttribute('content', saved === 'dark' ? '#0e0e12' : '#f2f2f7');

  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    btn.textContent = next === 'dark' ? '☀ Clair' : '☾ Sombre';
    document.getElementById('metaThemeColor')?.setAttribute('content', next === 'dark' ? '#0e0e12' : '#f2f2f7');
    closeBurger();
  });
}

function setupBurgerMenu() {
  const burger = document.getElementById('burgerBtn');
  const menu = document.getElementById('burgerMenu');
  const overlay = document.getElementById('burgerOverlay');

  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
    overlay.classList.toggle('visible', open);
    document.body.classList.toggle('menu-open', open);
  });

  overlay.addEventListener('click', closeBurger);
}

function closeBurger() {
  document.getElementById('burgerMenu')?.classList.remove('open');
  document.getElementById('burgerBtn')?.classList.remove('open');
  document.getElementById('burgerOverlay')?.classList.remove('visible');
  document.body.classList.remove('menu-open');
}

function setupImportExport() {
  document.getElementById('btnExport').addEventListener('click', () => {
    Storage.exportJSON();
    showNotif('Données exportées !');
    closeBurger();
  });

  document.getElementById('btnImport').addEventListener('click', () => {
    document.getElementById('importInput').click();
    closeBurger();
  });

  document.getElementById('importInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Storage.importJSON(file, (ok) => {
      if (ok) {
        renderWeekGrid();
        renderStreak();
        showNotif('Données importées !');
      } else {
        showNotif('Erreur lors de l\'import.');
      }
    });
  });
}
