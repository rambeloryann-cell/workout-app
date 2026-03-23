// ─── SETTINGS : Personnalisation du programme ────────────────────────────────

function renderSettings() {
  const container = document.getElementById('settingsContainer');
  const jours = ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'];
  const programme = buildProgramme();
  const overrides = Storage.getProgrammeOverrides();

  const musclesDispos = Object.keys(EXERCICES);

  container.innerHTML = jours.map(jour => {
    const data = programme[jour];
    if (data.repos) return `
      <div class="setting-card rest">
        <div class="setting-day">${data.label}</div>
        <div class="setting-rest-label">Jour de repos</div>
      </div>
    `;

    const circuits = overrides[jour]?.circuits ?? (data.blocs[0]?.circuits || 2);

    const muscleCheckboxes = musclesDispos.map(m => {
      const checked = data.muscles.includes(m) ? 'checked' : '';
      return `
        <label class="muscle-toggle ${checked ? 'active' : ''}">
          <input type="checkbox" ${checked} data-jour="${jour}" data-muscle="${m}" onchange="onMuscleToggle(this)" />
          ${m}
        </label>
      `;
    }).join('');

    return `
      <div class="setting-card" id="setting-${jour}">
        <div class="setting-day">${data.label}</div>
        <div class="setting-muscles">${muscleCheckboxes}</div>
        <div class="setting-circuits">
          <span class="setting-label">Circuits par bloc</span>
          <div class="circuits-spinner">
            <button class="ex-spin-btn" onclick="adjustCircuits('${jour}',-1)">▼</button>
            <span class="circuits-val" id="circuits-${jour}">${circuits}</span>
            <button class="ex-spin-btn" onclick="adjustCircuits('${jour}',1)">▲</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function onMuscleToggle(checkbox) {
  const jour = checkbox.dataset.jour;
  const muscle = checkbox.dataset.muscle;
  const overrides = Storage.getProgrammeOverrides();

  if (!overrides[jour]) overrides[jour] = {};
  const programme = buildProgramme();
  const current = overrides[jour].muscles || [...programme[jour].muscles];

  if (checkbox.checked) {
    if (!current.includes(muscle)) current.push(muscle);
  } else {
    const idx = current.indexOf(muscle);
    if (idx > -1) current.splice(idx, 1);
  }

  overrides[jour].muscles = current;
  Storage.saveProgrammeOverrides(overrides);

  checkbox.closest('label').classList.toggle('active', checkbox.checked);
  renderWeekGrid();
  showNotif('Programme mis à jour.');
}

function adjustCircuits(jour, delta) {
  const overrides = Storage.getProgrammeOverrides();
  if (!overrides[jour]) overrides[jour] = {};
  const programme = buildProgramme();
  const current = overrides[jour].circuits ?? (programme[jour].blocs[0]?.circuits || 2);
  const next = Math.min(5, Math.max(1, current + delta));
  overrides[jour].circuits = next;
  Storage.saveProgrammeOverrides(overrides);
  document.getElementById(`circuits-${jour}`).textContent = next;
  showNotif('Circuits mis à jour.');
}
