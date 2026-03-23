// ─── HEADER & BURGER MENU ────────────────────────────────────────────────────

function setupHeader() {
  setupThemeToggle();
  setupBurgerMenu();
  setupImportExport();
}

function setupThemeToggle() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  document.getElementById('metaThemeColor')?.setAttribute('content', saved === 'dark' ? '#0e0e12' : '#f2f2f7');

  function setLabel(theme) {
    const label = theme === 'dark' ? '☀ Clair' : '☾ Sombre';
    ['themeToggle','themeToggleMobile'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = label;
    });
  }

  setLabel(saved);

  ['themeToggle','themeToggleMobile'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      setLabel(next);
      document.getElementById('metaThemeColor')?.setAttribute('content', next === 'dark' ? '#0e0e12' : '#f2f2f7');
      closeBurger();
    });
  });
}

function setupBurgerMenu() {
  const burger  = document.getElementById('burgerBtn');
  const overlay = document.getElementById('burgerOverlay');

  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleBurger();
  });

  // Fermer en cliquant en dehors du menu
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('burgerMenu');
    const btn  = document.getElementById('burgerBtn');
    if (menu?.classList.contains('open') && !menu.contains(e.target) && e.target !== btn) {
      closeBurger();
    }
  });
}

function toggleBurger() {
  const menu   = document.getElementById('burgerMenu');
  const burger = document.getElementById('burgerBtn');
  const overlay = document.getElementById('burgerOverlay');
  const isOpen = menu.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  overlay.classList.toggle('visible', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
}

function closeBurger() {
  document.getElementById('burgerMenu')?.classList.remove('open');
  document.getElementById('burgerBtn')?.classList.remove('open');
  document.getElementById('burgerOverlay')?.classList.remove('visible');
  document.body.classList.remove('menu-open');
}

function setupImportExport() {
  ['btnExport','btnExportMobile'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', (e) => {
      e.stopPropagation();
      closeBurger();
      Storage.exportJSON();
      showNotif('Données exportées !');
    });
  });

  ['btnImport','btnImportMobile'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', (e) => {
      e.stopPropagation();
      closeBurger();
      document.getElementById('importInput').click();
    });
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
        showNotif("Erreur lors de l'import.");
      }
    });
  });
}
