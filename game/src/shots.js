// shots.js — penataan adegan untuk screenshot. Parameter ?shot= di URL memilih
// satu momen permainan yang sudah diatur (level, temuan, sisa waktu) supaya
// screenshot benar-benar render dari kode game, bukan hasil editan.
//   ?shot=cover   Level 1, 4 temuan terlingkari, Sisa: 4, timer 1:38
//   ?shot=level2  Level 2, 5 temuan terlingkari, Sisa: 5
//   ?shot=level3  Level 3, 3 temuan terlingkari, Sisa: 9
//   ?shot=win     Level 1 selesai, layar menang
// Tanpa parameter, game mulai dari menu biasa.

'use strict';

const SHOT_PRESETS = {
  cover: { levelIndex: 0, foundCount: 4, timeLeftSeconds: 98, score: 400, phase: 'playing' },
  level2: { levelIndex: 1, foundCount: 5, timeLeftSeconds: 121, score: 500, phase: 'playing' },
  level3: { levelIndex: 2, foundCount: 3, timeLeftSeconds: 175, score: 300, phase: 'playing' },
  win: { levelIndex: 0, foundCount: 8, timeLeftSeconds: 64, score: 928, phase: 'won' },
};

function applyShotPreset(state) {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  if (!shot || !SHOT_PRESETS[shot]) return false;
  const preset = SHOT_PRESETS[shot];
  const level = levelByIndex(preset.levelIndex);
  state.levelIndex = preset.levelIndex;
  state.found = new Set(level.differences.slice(0, preset.foundCount).map((diff) => diff.id));
  state.score = preset.score;
  state.levelScore = preset.foundCount * 100;
  state.hintsLeft = 3;
  state.timeLeftSeconds = preset.timeLeftSeconds;
  state.timerEndsAt = Date.now() + preset.timeLeftSeconds * 1000;
  state.timerRunning = preset.phase === 'playing';
  state.phase = preset.phase;
  return true;
}
