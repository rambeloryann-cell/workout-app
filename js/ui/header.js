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

  const label = saved === 'dark' ? '☀ Clair' : '☾ Sombre';
  const btnDesktop = document.getElementById('themeToggle');
  const btnMobile  = document.getElementById('themeToggleMobile');
  if (btnDesktop) btnDesktop.textContent = label;
  if (btnMobile)  btnMobile.textContent  = label;

  function toggle() {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    const newLabel = next === 'dark' ? '☀ Clair' : '☾ Sombre';
    if (btnDesktop) btnDesktop.textContent = newLabel;
    if (btnMobile)  btnMobile.textContent  = newLabel;
    document.getElementById('metaThemeColor')?.setAttribute('content', next === 'dark' ? '#0e0e12' : '#f2f2f7');
    closeBurger();
  }

  btnDesktop?.addEventListener('click', toggle);
  btnMobile?.addEventListener('click', toggle);
}

function setupBurgerMenu() {
  const burger  = document.getElementById('burgerBtn');
  const menu    = document.getElementById('burgerMenu');
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
  function doExport() {
    Storage.exportJSON();
    showNotif('Données exportées !');
    closeBurger();
  }

  function doImport() {
    document.getElementById('importInput').click();
    closeBurger();
  }

  document.getElementById('btnExport')?.addEventListener('click', doExport);
  document.getElementById('btnExportMobile')?.addEventListener('click', doExport);
  document.getElementById('btnImport')?.addEventListener('click', doImport);
  document.getElementById('btnImportMobile')?.addEventListener('click', doImport);

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
