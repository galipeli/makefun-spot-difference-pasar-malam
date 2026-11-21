// main.js — titik masuk game. Membangun state awal, memasang input, menjalankan
// loop animasi (timer + render ulang untuk denyut hint), dan membuka menu.

'use strict';

function createGameState() {
  return {
    levelIndex: 0,
    phase: 'menu',
    found: new Set(),
    hintsLeft: 3,
    score: 0,
    levelScore: 0,
    timeLeftSeconds: 150,
    timerEndsAt: 0,
    timerRunning: false,
    hintDiff: null,
    hintUntil: 0,
    miss: null,
    canvases: {
      left: document.getElementById('panel-left'),
      right: document.getElementById('panel-right'),
    },
  };
}

function startGameLoop(state) {
  function frame() {
    if (state.phase === 'playing') {
      tickTimer(state);
      updateHud(state);
    }
    renderPanels(state);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function bootSpotDifferenceGame() {
  const state = createGameState();
  window.__spotDifferenceState = state; // dipakai play-test otomatis
  bindInput(state);
  const staged = applyShotPreset(state);
  if (!staged) {
    state.phase = 'menu';
  }
  renderPanels(state);
  renderOverlay(state);
  updateHud(state);
  if (state.phase === 'menu') {
    flashMessage(state, 'Pilih level, lalu klik perbedaan di panel kiri atau kanan.');
  } else if (state.phase === 'playing') {
    flashMessage(state, 'Level ' + (state.levelIndex + 1) + ': cari ' + remainingCount(state) + ' perbedaan lagi!');
  }
  startGameLoop(state);
}

document.addEventListener('DOMContentLoaded', bootSpotDifferenceGame);
