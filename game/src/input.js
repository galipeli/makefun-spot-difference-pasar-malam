// input.js — semua masukan pemain: klik mouse di kedua panel dan tombol keyboard.
// Klik dihitung benar bila jatuh dalam radius sebuah perbedaan yang belum ditemukan;
// klik di mana saja selain itu adalah miss (silang merah + potongan waktu).

'use strict';

const MISS_TIME_PENALTY_SECONDS = 3;
const FIND_POINTS = 100;
const HINT_POINTS_COST = 15;

function canvasPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

function nearestUnfoundDifference(state, x, y) {
  const level = levelByIndex(state.levelIndex);
  for (const diff of level.differences) {
    if (state.found.has(diff.id)) continue;
    const dx = x - diff.x;
    const dy = y - diff.y;
    if (Math.sqrt(dx * dx + dy * dy) <= diff.radius + 10) return diff;
  }
  return null;
}

function handlePanelClick(state, panel, event) {
  if (state.phase !== 'playing') return;
  const canvas = panel === 'right' ? state.canvases.right : state.canvases.left;
  const point = canvasPoint(canvas, event);
  const diff = nearestUnfoundDifference(state, point.x, point.y);
  if (diff) {
    state.found.add(diff.id);
    state.score += FIND_POINTS;
    state.levelScore += FIND_POINTS;
    state.hintDiff = null;
    playSound('find');
    flashMessage(state, 'Ketemu! ' + diff.label + ' (+' + FIND_POINTS + ')');
    renderPanels(state);
    updateHud(state);
    if (remainingCount(state) === 0) {
      state.phase = 'won';
      stopTimer(state);
      const bonus = state.timeLeftSeconds * 2;
      state.score += bonus;
      state.levelScore += bonus;
      playSound('win');
      flashMessage(state, 'Semua ketemu! Bonus waktu +' + bonus);
      updateHud(state);
      renderOverlay(state);
    }
  } else {
    state.miss = { panel, x: point.x, y: point.y, at: Date.now() };
    penalizeTime(state, MISS_TIME_PENALTY_SECONDS);
    playSound('miss');
    flashMessage(state, 'Bukan di situ — waktu −' + MISS_TIME_PENALTY_SECONDS + ' detik');
    renderPanels(state);
    updateHud(state);
  }
}

function useHint(state) {
  if (state.phase !== 'playing' || state.hintsLeft <= 0) return;
  const level = levelByIndex(state.levelIndex);
  const unfound = level.differences.filter((diff) => !state.found.has(diff.id));
  if (unfound.length === 0) return;
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - HINT_POINTS_COST);
  state.hintDiff = unfound[Math.floor(Math.random() * unfound.length)];
  state.hintUntil = Date.now() + 2500;
  playSound('hint');
  flashMessage(state, 'Hint: cari di sekitar lingkaran kuning (−' + HINT_POINTS_COST + ' poin)');
  updateHud(state);
}

function restartLevel(state) {
  const level = levelByIndex(state.levelIndex);
  state.found = new Set();
  state.hintDiff = null;
  state.miss = null;
  state.hintsLeft = 3;
  state.levelScore = 0;
  state.phase = 'playing';
  startTimer(state);
  renderPanels(state);
  renderOverlay(state);
  updateHud(state);
  flashMessage(state, level.name + ': cari ' + level.differences.length + ' perbedaan!');
}

function selectLevel(state, index) {
  state.levelIndex = index;
  state.score = 0;
  restartLevel(state);
}

function bindInput(state) {
  state.canvases.left.addEventListener('click', (event) => handlePanelClick(state, 'left', event));
  state.canvases.right.addEventListener('click', (event) => handlePanelClick(state, 'right', event));
  document.getElementById('hint-button').addEventListener('click', () => useHint(state));
  document.getElementById('restart-button').addEventListener('click', () => restartLevel(state));
  document.querySelectorAll('[data-level]').forEach((button) => {
    button.addEventListener('click', () => selectLevel(state, Number(button.dataset.level)));
  });
  document.getElementById('overlay-button').addEventListener('click', () => {
    if (state.phase === 'won') {
      selectLevel(state, (state.levelIndex + 1) % 3);
    } else if (state.phase === 'lost') {
      restartLevel(state);
    } else {
      state.phase = 'playing';
      startTimer(state);
      renderOverlay(state);
      updateHud(state);
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'h' || event.key === 'H') useHint(state);
    else if (event.key === 'r' || event.key === 'R') restartLevel(state);
    else if (event.key === '1') selectLevel(state, 0);
    else if (event.key === '2') selectLevel(state, 1);
    else if (event.key === '3') selectLevel(state, 2);
  });
}
