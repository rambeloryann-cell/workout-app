// ─── TRACKER ─────────────────────────────────────────────────────────────────

const Tracker = {
  _state: {},

  init(blocs) {
    this._state = {};
    blocs.forEach(bloc => {
      for (let c = 1; c <= bloc.circuits; c++) {
        bloc.exercices.forEach(ex => {
          const key = `${bloc.id}_c${c}_${ex.exId}`;
          this._state[key] = { checked: false, poids: '', reps: '' };
        });
      }
    });
  },

  setChecked(key, val) { if (this._state[key]) this._state[key].checked = val; },
  setPoids(key, val)   { if (this._state[key]) this._state[key].poids = val; },
  setReps(key, val)    { if (this._state[key]) this._state[key].reps = val; },
  get(key)             { return this._state[key] || {}; },

  isCircuitComplete(blocId, circuitNum, exercices) {
    return exercices.every(ex => this._state[`${blocId}_c${circuitNum}_${ex.exId}`]?.checked);
  },

  isBlocComplete(blocId, circuits, exercices) {
    for (let c = 1; c <= circuits; c++) {
      if (!this.isCircuitComplete(blocId, c, exercices)) return false;
    }
    return true;
  },

  isSeanceComplete(blocs) {
    return blocs.every(b => this.isBlocComplete(b.id, b.circuits, b.exercices));
  },

  buildSession(jourKey, jourLabel, muscles, blocs, restDuration) {
    const today = new Date().toISOString().split('T')[0];
    const series = [];

    blocs.forEach(bloc => {
      for (let c = 1; c <= bloc.circuits; c++) {
        bloc.exercices.forEach(ex => {
          const key = `${bloc.id}_c${c}_${ex.exId}`;
          const entry = this._state[key];
          const exData = resolveExercice(ex.exId, ex.muscle);
          series.push({
            bloc: bloc.titre,
            circuit: c,
            exercice: exData?.nom || ex.exId,
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
      label: jourLabel,
      muscles: muscles.join(' + '),
      repos: false,
      restDuration,
      complete: this.isSeanceComplete(blocs),
      series
    };
  }
};
