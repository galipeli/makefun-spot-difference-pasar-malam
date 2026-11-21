// hud.js — memperbarui semua angka dan teks di kepala halaman: counter sisa,
// timer, skor, sisa hint, dan nama level. Satu-satunya tempat yang menyentuh DOM HUD.

'use strict';

function updateHud(state) {
  const level = levelByIndex(state.levelIndex);
  document.getElementById('hud-level').textContent = 'Level ' + (state.levelIndex + 1) + ' · ' + level.name;
  document.getElementById('hud-remaining').textContent = 'Sisa: ' + remainingCount(state);
  document.getElementById('hud-timer').textContent = formatTime(state.timeLeftSeconds);
  document.getElementById('hud-score').textContent = 'Skor: ' + state.score;
  document.getElementById('hud-hints').textContent = 'Hint: ' + state.hintsLeft;
  const timerEl = document.getElementById('hud-timer');
  timerEl.classList.toggle('urgent', state.timeLeftSeconds <= 30 && state.phase === 'playing');
  document.getElementById('hint-button').disabled = state.hintsLeft <= 0 || state.phase !== 'playing';
}

function flashMessage(state, text) {
  const el = document.getElementById('message');
  el.textContent = text;
  el.classList.remove('flash');
  void el.offsetWidth; // restart animasi
  el.classList.add('flash');
}
