// ─── TRACKER : État de la séance en cours ────────────────────────────────────

const Tracker = {
  _state: {},

  init(jourKey) {
    const blocs = PROGRAMME[jourKey].blocs;
    this._state = {};

    blocs.forEach(bloc => {
      for (let c = 1; c <= bloc.circuits; c++) {
        bloc.exercices.forEach(ex => {
          const key = `${bloc.id}_c${c}_${ex.id}`;
          this._state[key] = { checked: false, poids: '', reps: '' };
        });
      }
    });
  },

  setChecked(key, val) {
    if (this._state[key]) this._state[key].checked = val;
  },

  setPoids(key, val) {
    if (this._state[key]) this._state[key].poids = val;
  },

  setReps(key, val) {
    if (this._state[key]) this._state[key].reps = val;
  },

  get(key) {
    return this._state[key] || {};
  },

  // Vérifie si un circuit complet est coché
  isCircuitComplete(blocId, circuitNum, exercices) {
    return exercices.every(ex => {
      const key = `${blocId}_c${circuitNum}_${ex.id}`;
      return this._state[key]?.checked;
    });
  },

  // Vérifie si toute la séance est complète
  isSeanceComplete(jourKey) {
    return Object.values(this._state).every(v => v.checked);
  },

  // Construire l'objet session pour la sauvegarde
  buildSession(jourKey, restDuration) {
    const jour = PROGRAMME[jourKey];
    const today = new Date().toISOString().split('T')[0];
    const series = [];

    jour.blocs.forEach(bloc => {
      for (let c = 1; c <= bloc.circuits; c++) {
        bloc.exercices.forEach(ex => {
          const key = `${bloc.id}_c${c}_${ex.id}`;
          const entry = this._state[key];
          series.push({
            bloc: bloc.titre,
            circuit: c,
            exercice: ex.nom,
            muscle: ex.muscle,
            poids: entry?.poids || '',
            reps: entry?.reps || '',
            complete: entry?.checked || false
          });
        });
      }
    });

    return {
      date: today,
      jour: jourKey,
      label: jour.label,
      muscles: jour.muscles,
      repos: jour.repos || false,
      restDuration,
      complete: this.isSeanceComplete(jourKey),
      series
    };
  }
};
