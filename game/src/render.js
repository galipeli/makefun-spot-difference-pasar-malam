// render.js — menggambar kedua panel ke kanvas, plus semua tanda di atasnya:
// lingkaran hijau pada perbedaan yang sudah ditemukan, denyut hint, dan
// silang merah sesaat untuk klik yang salah. Tidak menyimpan state permainan.

'use strict';

// Warna dan gaya tanda temuan.
const MARK_COLOR = '#39d353';
const MARK_GLOW = 'rgba(57, 211, 83, 0.35)';
const HINT_COLOR = '#ffd166';
const MISS_COLOR = '#ff4d4d';

function drawFoundMarker(ctx, diff) {
  ctx.save();
  ctx.strokeStyle = MARK_COLOR;
  ctx.lineWidth = 4;
  ctx.shadowColor = MARK_GLOW;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, diff.radius + 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;
  // Centang kecil di tengah lingkaran.
  ctx.strokeStyle = MARK_COLOR;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(diff.x - 8, diff.y);
  ctx.lineTo(diff.x - 2, diff.y + 7);
  ctx.lineTo(diff.x + 9, diff.y - 7);
  ctx.stroke();
  ctx.restore();
}

function drawHintPulse(ctx, diff, phase) {
  const pulse = 1 + 0.25 * Math.sin(phase * 6);
  ctx.save();
  ctx.strokeStyle = HINT_COLOR;
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, (diff.radius + 10) * pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawMissCross(ctx, x, y, ageMs) {
  const alpha = Math.max(0, 1 - ageMs / 700);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = MISS_COLOR;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 12, y - 12);
  ctx.lineTo(x + 12, y + 12);
  ctx.moveTo(x + 12, y - 12);
  ctx.lineTo(x - 12, y + 12);
  ctx.stroke();
  ctx.restore();
}

function drawPanelLabel(ctx, text, x) {
  ctx.save();
  ctx.fillStyle = 'rgba(10, 8, 20, 0.65)';
  ctx.fillRect(x, 0, 76, 30);
  ctx.fillStyle = '#f5e6c8';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + 38, 15);
  ctx.restore();
}

// Gambar ulang kedua panel dari state saat ini. Dipanggil tiap frame animasi
// (untuk denyut hint) dan tiap kali state berubah.
function renderPanels(state) {
  const left = state.canvases.left;
  const right = state.canvases.right;
  const level = levelByIndex(state.levelIndex);
  paintScene(left.getContext('2d'), state.levelIndex, false);
  paintScene(right.getContext('2d'), state.levelIndex, true);

  const leftCtx = left.getContext('2d');
  const rightCtx = right.getContext('2d');
  for (const diff of level.differences) {
    if (state.found.has(diff.id)) {
      drawFoundMarker(leftCtx, diff);
      drawFoundMarker(rightCtx, diff);
    }
  }
  if (state.hintDiff && state.hintUntil > Date.now()) {
    drawHintPulse(leftCtx, state.hintDiff, Date.now() / 1000);
    drawHintPulse(rightCtx, state.hintDiff, Date.now() / 1000);
  }
  if (state.miss && Date.now() - state.miss.at < 700) {
    const target = state.miss.panel === 'right' ? rightCtx : leftCtx;
    drawMissCross(target, state.miss.x, state.miss.y, Date.now() - state.miss.at);
  }
  drawPanelLabel(leftCtx, 'KIRI', 0);
  drawPanelLabel(rightCtx, 'KANAN', 0);
}

// Overlay layar menang / kalah / jeda di atas kedua panel.
function renderOverlay(state) {
  const overlay = document.getElementById('overlay');
  const overlayTitle = document.getElementById('overlay-title');
  const overlayText = document.getElementById('overlay-text');
  const overlayButton = document.getElementById('overlay-button');
  if (state.phase === 'playing') {
    overlay.classList.add('hidden');
    return;
  }
  overlay.classList.remove('hidden');
  if (state.phase === 'won') {
    const level = levelByIndex(state.levelIndex);
    overlayTitle.textContent = 'Level Selesai!';
    overlayText.textContent =
      'Kamu menemukan semua ' + level.differences.length + ' perbedaan di ' +
      level.name + '. Skor level: ' + state.levelScore + '.';
    overlayButton.textContent = state.levelIndex < 2 ? 'Lanjut ke Level ' + (state.levelIndex + 2) : 'Main Lagi dari Level 1';
  } else if (state.phase === 'lost') {
    overlayTitle.textContent = 'Waktu Habis!';
    const remaining = remainingCount(state);
    overlayText.textContent =
      'Masih ada ' + remaining + ' perbedaan yang belum ditemukan. Coba lagi, bos — kali ini pasti ketemu.';
    overlayButton.textContent = 'Coba Lagi';
  } else if (state.phase === 'menu') {
    overlayTitle.textContent = 'Pasar Malam';
    overlayText.textContent =
      'Cari perbedaan di antara dua gambar pasar malam. Klik perbedaan di panel kiri atau kanan. Total 30 perbedaan di 3 level.';
    overlayButton.textContent = 'Mulai Main';
  }
}

function remainingCount(state) {
  const level = levelByIndex(state.levelIndex);
  return level.differences.length - state.found.size;
}
