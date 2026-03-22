// ─── TIMER ───────────────────────────────────────────────────────────────────

const Timer = {
  _interval: null,
  _remaining: 0,
  _total: 0,
  _onTick: null,
  _onEnd: null,

  start(seconds, onTick, onEnd) {
    this.stop();
    this._remaining = seconds;
    this._total = seconds;
    this._onTick = onTick;
    this._onEnd = onEnd;

    this._tick();
    this._interval = setInterval(() => this._tick(), 1000);
  },

  _tick() {
    if (this._onTick) this._onTick(this._remaining, this._total);
    if (this._remaining <= 0) {
      this.stop();
      if (this._onEnd) this._onEnd();
      return;
    }
    this._remaining--;
  },

  stop() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  },

  skip() {
    this.stop();
    if (this._onEnd) this._onEnd();
  },

  isRunning() {
    return this._interval !== null;
  },

  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }
};
