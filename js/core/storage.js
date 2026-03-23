// ─── STORAGE ─────────────────────────────────────────────────────────────────

const Storage = {

  getData() {
    try {
      return JSON.parse(localStorage.getItem('workoutData')) || { sessions: [], streak: 0, lastSessionDate: null };
    } catch { return { sessions: [], streak: 0, lastSessionDate: null }; }
  },

  saveData(data) {
    localStorage.setItem('workoutData', JSON.stringify(data));
  },

  saveSession(session) {
    const data = this.getData();
    const today = new Date().toISOString().split('T')[0];
    data.sessions = data.sessions.filter(s => !(s.date === today && s.jour === session.jour));
    data.sessions.push(session);

    if (session.complete && !session.repos) {
      const last = data.lastSessionDate;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split('T')[0];
      if (last === yStr) data.streak = (data.streak || 0) + 1;
      else if (last !== today) data.streak = 1;
      data.lastSessionDate = today;
    }

    this.saveData(data);
    return data;
  },

  getSessions() { return this.getData().sessions || []; },
  getStreak()   { return this.getData().streak || 0; },

  getProgrammeOverrides() {
    try {
      return JSON.parse(localStorage.getItem('programmeOverrides')) || {};
    } catch { return {}; }
  },

  saveProgrammeOverrides(overrides) {
    localStorage.setItem('programmeOverrides', JSON.stringify(overrides));
  },

  exportJSON() {
    const payload = {
      workoutData: this.getData(),
      programmeOverrides: this.getProgrammeOverrides()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workout_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importJSON(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed.workoutData) this.saveData(parsed.workoutData);
        if (parsed.programmeOverrides) this.saveProgrammeOverrides(parsed.programmeOverrides);
        // Support ancien format
        if (parsed.sessions) this.saveData(parsed);
        callback(true);
      } catch { callback(false); }
    };
    reader.readAsText(file);
  }
};
