// ─── STORAGE : Export / Import JSON ─────────────────────────────────────────

const Storage = {

  // Charger les données depuis le fichier importé (stocké en mémoire)
  _data: { sessions: [], streak: 0, lastSessionDate: null },

  getData() {
    const raw = localStorage.getItem('workoutData');
    if (raw) {
      try { this._data = JSON.parse(raw); } catch(e) {}
    }
    return this._data;
  },

  saveData(data) {
    this._data = data;
    localStorage.setItem('workoutData', JSON.stringify(data));
  },

  // Sauvegarder une session
  saveSession(session) {
    const data = this.getData();
    const today = new Date().toISOString().split('T')[0];

    // Éviter les doublons du même jour
    data.sessions = data.sessions.filter(s => s.date !== today || s.jour !== session.jour);
    data.sessions.push(session);

    // Streak : incrémenter si séance complète (pas un jour de repos)
    if (session.complete && !session.repos) {
      const last = data.lastSessionDate;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split('T')[0];

      if (last === yStr || last === today) {
        data.streak = (data.streak || 0) + 1;
      } else if (last !== today) {
        data.streak = 1;
      }
      data.lastSessionDate = today;
    }

    this.saveData(data);
    return data;
  },

  // Export JSON
  exportJSON() {
    const data = this.getData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workout_progression_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Import JSON
  importJSON(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        this.saveData(data);
        callback(true, data);
      } catch(err) {
        callback(false, null);
      }
    };
    reader.readAsText(file);
  },

  getStreak() {
    return this.getData().streak || 0;
  },

  getSessions() {
    return this.getData().sessions || [];
  }
};
