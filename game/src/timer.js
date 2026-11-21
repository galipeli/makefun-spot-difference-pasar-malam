// timer.js — hitung mundur tiap level. Satu-satunya tempat yang tahu soal waktu:
// kapan level mulai, berapa detik tersisa, dan kapan waktu habis.

'use strict';

function startTimer(state) {
  const level = levelByIndex(state.levelIndex);
  state.timeLeftSeconds = level.timeLimitSeconds;
  state.timerEndsAt = Date.now() + level.timeLimitSeconds * 1000;
  state.timerRunning = true;
}

function stopTimer(state) {
  state.timerRunning = false;
  state.timerEndsAt = 0;
}

function tickTimer(state) {
  if (!state.timerRunning) return state.timeLeftSeconds;
  const left = Math.max(0, Math.ceil((state.timerEndsAt - Date.now()) / 1000));
  state.timeLeftSeconds = left;
  if (left <= 0) {
    state.timerRunning = false;
    if (state.phase === 'playing') {
      state.phase = 'lost';
      renderOverlay(state);
      playSound('lose');
    }
  }
  return left;
}

// Kurangi waktu sebagai hukuman klik salah (tidak boleh di bawah 0).
function penalizeTime(state, seconds) {
  if (!state.timerRunning) return;
  state.timerEndsAt -= seconds * 1000;
  state.timeLeftSeconds = Math.max(0, Math.ceil((state.timerEndsAt - Date.now()) / 1000));
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes + ':' + String(seconds).padStart(2, '0');
}
