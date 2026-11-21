// differences.js — daftar perbedaan tiap level: apa yang berubah di panel kanan,
// di mana letaknya, dan seberapa besar area kliknya. Satu-satunya sumber kebenaran
// soal "apa yang berbeda"; render.js dan scenes.js hanya membacanya.

'use strict';

// Satu perbedaan: id unik per level, posisi (x, y) dalam ruang gambar 600x540,
// radius klik, dan label yang dipakai layar akhir + hint.
function makeDifference(id, x, y, radius, label) {
  return { id, x, y, radius, label };
}

// Level 1 — Gerobak Sate (8 perbedaan, pemanasan)
const LEVEL_1_DIFFERENCES = [
  makeDifference('lampion-warna', 96, 118, 26, 'Lampion kiri berubah warna'),
  makeDifference('bintang-hilang', 512, 66, 18, 'Satu bintang hilang di langit'),
  makeDifference('tusuk-tambah', 300, 330, 24, 'Satu tusuk sate bertambah'),
  makeDifference('huruf-spanduk', 300, 196, 26, 'Huruf di spanduk berubah'),
  makeDifference('roda-jari', 168, 452, 24, 'Jari-jari roda berkurang'),
  makeDifference('asap-hilang', 420, 250, 26, 'Kepul asap menghilang'),
  makeDifference('mangkuk-warna', 452, 398, 24, 'Warna mangkuk berubah'),
  makeDifference('bulan-besar', 96, 62, 30, 'Bulan jadi lebih besar'),
];

// Level 2 — Bianglala (10 perbedaan, sedang)
const LEVEL_2_DIFFERENCES = [
  makeDifference('kabin-warna', 300, 128, 26, 'Kabin puncak berubah warna'),
  makeDifference('bendera-hilang', 92, 210, 22, 'Bendera tenda hilang'),
  makeDifference('awan-tambah', 480, 96, 28, 'Satu awan bertambah'),
  makeDifference('lampu-roda', 396, 232, 22, 'Lampu roda berubah warna'),
  makeDifference('garis-tenda', 150, 420, 26, 'Garis tenda berubah arah'),
  makeDifference('jendela-loket', 468, 452, 24, 'Jendela loket tertutup'),
  makeDifference('balon-hilang', 540, 300, 22, 'Satu balon hilang'),
  makeDifference('bintang-jatuh', 210, 60, 24, 'Bintang jatuh muncul'),
  makeDifference('kabin-hilang', 204, 300, 24, 'Satu kabin hilang'),
  makeDifference('lampu-gantung', 330, 470, 22, 'Lampu gantung padam'),
];

// Level 3 — Panggung Dangdut (12 perbedaan, sulit)
const LEVEL_3_DIFFERENCES = [
  makeDifference('bola-disko', 300, 92, 28, 'Bola disko kehilangan satu sisi'),
  makeDifference('speaker-hilang', 96, 420, 26, 'Satu speaker hilang'),
  makeDifference('tulisan-banner', 300, 168, 26, 'Tulisan banner berubah'),
  makeDifference('lampu-panggung', 420, 250, 24, 'Lampu panggung berubah warna'),
  makeDifference('topi-penonton', 150, 470, 24, 'Topi penonton berubah warna'),
  makeDifference('gitar-hilang', 380, 330, 24, 'Gitar di panggung hilang'),
  makeDifference('kabel-tambah', 480, 400, 24, 'Satu kabel menjuntai'),
  makeDifference('bintang-latar', 520, 80, 20, 'Satu bintang latar hilang'),
  makeDifference('mikrofon-miring', 268, 300, 24, 'Mikrofon jadi miring'),
  makeDifference('tangan-penonton', 210, 440, 24, 'Satu tangan penonton hilang'),
  makeDifference('lampu-sorot', 120, 250, 24, 'Lampu sorot padam'),
  makeDifference('kembang-api', 540, 160, 26, 'Kembang api bertambah'),
];

// Kumpulan level: nama, waktu (detik), dan daftar perbedaannya.
const LEVELS = [
  { index: 0, name: 'Gerobak Sate', timeLimitSeconds: 150, differences: LEVEL_1_DIFFERENCES },
  { index: 1, name: 'Bianglala', timeLimitSeconds: 180, differences: LEVEL_2_DIFFERENCES },
  { index: 2, name: 'Panggung Dangdut', timeLimitSeconds: 210, differences: LEVEL_3_DIFFERENCES },
];

function levelByIndex(index) {
  return LEVELS[index] || LEVELS[0];
}

function totalDifferences() {
  return LEVELS.reduce((sum, level) => sum + level.differences.length, 0);
}
