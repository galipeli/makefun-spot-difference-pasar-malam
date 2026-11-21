// scenes.js — pelukis scene. Setiap scene digambar dua kali: panel kiri (asli) dan
// panel kanan (varian, dengan semua perbedaan level itu diterapkan). Tidak ada aset
// eksternal: semua bentuk digambar dari kode di atas kanvas 600x540.

'use strict';

function paintSky(ctx, topColor, bottomColor) {
  const sky = ctx.createLinearGradient(0, 0, 0, 540);
  sky.addColorStop(0, topColor);
  sky.addColorStop(1, bottomColor);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 540);
}

function paintGround(ctx, color, y) {
  ctx.fillStyle = color;
  ctx.fillRect(0, y, 600, 540 - y);
}

function paintStar(ctx, x, y, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
    const inner = (Math.PI * 2 * i + Math.PI) / 5 - Math.PI / 2;
    ctx.lineTo(x + Math.cos(inner) * radius * 0.45, y + Math.sin(inner) * radius * 0.45);
  }
  ctx.closePath();
  ctx.fill();
}

function paintMoon(ctx, x, y, radius) {
  ctx.fillStyle = '#ffe9a8';
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(214, 178, 90, 0.7)';
  ctx.beginPath();
  ctx.arc(x - radius * 0.3, y - radius * 0.2, radius * 0.22, 0, Math.PI * 2);
  ctx.arc(x + radius * 0.35, y + radius * 0.3, radius * 0.16, 0, Math.PI * 2);
  ctx.fill();
}

function paintStringLights(ctx, y, colors) {
  ctx.strokeStyle = '#2b2118';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, y - 18);
  ctx.quadraticCurveTo(300, y + 26, 600, y - 18);
  ctx.stroke();
  for (let i = 0; i < 12; i++) {
    const t = i / 11;
    const x = t * 600;
    const sag = y - 18 + Math.sin(t * Math.PI) * 26;
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.arc(x, sag + 8, 6, 0, Math.PI * 2);
    ctx.fill();
  }
}

function paintLantern(ctx, x, y, bodyColor) {
  ctx.strokeStyle = '#3a2a1a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 34);
  ctx.lineTo(x, y - 16);
  ctx.stroke();
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(x, y, 16, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 240, 180, 0.85)';
  ctx.beginPath();
  ctx.ellipse(x, y, 9, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#c9a227';
  ctx.fillRect(x - 8, y - 24, 16, 5);
  ctx.fillRect(x - 8, y + 19, 16, 5);
}

// ---------------------------------------------------------------------------
// Level 1 — Gerobak Sate
// ---------------------------------------------------------------------------
function paintGerobakSate(ctx, right) {
  paintSky(ctx, '#1c1445', '#4a2560');
  if (!right) paintStar(ctx, 512, 66, 9, '#fff6c9'); // bintang hilang di panel kanan
  paintStar(ctx, 200, 48, 7, '#fff6c9');
  paintStar(ctx, 420, 90, 6, '#ffe9a8');
  paintStar(ctx, 40, 150, 6, '#fff6c9');
  paintMoon(ctx, 96, 62, right ? 36 : 26);
  paintGround(ctx, '#241a33', 430);

  // Spanduk
  ctx.fillStyle = '#f5e6c8';
  ctx.fillRect(200, 168, 200, 56);
  ctx.fillStyle = '#8c2f39';
  ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(right ? 'SATE AYAN' : 'SATE AYAM', 300, 196);

  // Lampu gantung
  paintStringLights(ctx, 120, ['#ff5a5a', '#ffd166', '#7bd389']);
  paintLantern(ctx, 96, 118, right ? '#37b6a9' : '#e2483d');

  // Gerobak
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(120, 330, 360, 90);
  ctx.fillStyle = '#a06a35';
  ctx.fillRect(120, 330, 360, 14);
  ctx.fillStyle = '#5d3413';
  ctx.fillRect(140, 420, 320, 12);
  // Atap gerobak
  ctx.fillStyle = '#b03a2e';
  ctx.beginPath();
  ctx.moveTo(100, 330);
  ctx.lineTo(300, 268);
  ctx.lineTo(500, 330);
  ctx.closePath();
  ctx.fill();
  // Roda
  ctx.fillStyle = '#2e2018';
  ctx.beginPath();
  ctx.arc(168, 452, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#d9c9a3';
  ctx.lineWidth = 3;
  const spokes = right ? 4 : 6;
  for (let i = 0; i < spokes; i++) {
    const a = (Math.PI * 2 * i) / spokes;
    ctx.beginPath();
    ctx.moveTo(168, 452);
    ctx.lineTo(168 + Math.cos(a) * 26, 452 + Math.sin(a) * 26);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(432, 452, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(432, 452, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#d9c9a3';
  ctx.fill();

  // Tusuk sate di atas panggangan (menancap di bibir gerobak)
  const skewers = right ? 4 : 3;
  for (let i = 0; i < skewers; i++) {
    const x = 260 + i * 34;
    ctx.strokeStyle = '#d9a05b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, 336);
    ctx.lineTo(x, 362);
    ctx.stroke();
    ctx.fillStyle = '#8c5a2b';
    for (let k = 0; k < 3; k++) {
      ctx.beginPath();
      ctx.arc(x, 340 + k * 8, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // Asap panggangan
  if (!right) {
    ctx.fillStyle = 'rgba(230, 230, 240, 0.5)';
    ctx.beginPath();
    ctx.arc(420, 250, 16, 0, Math.PI * 2);
    ctx.arc(434, 232, 12, 0, Math.PI * 2);
    ctx.arc(408, 232, 11, 0, Math.PI * 2);
    ctx.fill();
  }
  // Mangkuk di meja
  ctx.fillStyle = right ? '#2e86ab' : '#e2703a';
  ctx.beginPath();
  ctx.arc(452, 398, 22, 0, Math.PI);
  ctx.fill();
  ctx.fillRect(430, 398, 44, 6);
}

// ---------------------------------------------------------------------------
// Level 2 — Bianglala
// ---------------------------------------------------------------------------
function paintBianglala(ctx, right) {
  paintSky(ctx, '#0f1e4d', '#5b2a6e');
  paintStar(ctx, 90, 70, 7, '#fff6c9');
  paintStar(ctx, 330, 44, 6, '#ffe9a8');
  paintStar(ctx, 560, 130, 7, '#fff6c9');
  paintStar(ctx, 150, 140, 5, '#fff6c9');
  if (right) {
    // Bintang jatuh hanya di panel kanan
    ctx.strokeStyle = '#ffe9a8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(210, 60);
    ctx.lineTo(178, 92);
    ctx.stroke();
    paintStar(ctx, 210, 60, 7, '#ffe9a8');
  }
  // Awan
  ctx.fillStyle = 'rgba(220, 220, 240, 0.55)';
  ctx.beginPath();
  ctx.arc(120, 110, 22, 0, Math.PI * 2);
  ctx.arc(146, 102, 18, 0, Math.PI * 2);
  ctx.arc(96, 102, 15, 0, Math.PI * 2);
  ctx.fill();
  if (right) {
    ctx.beginPath();
    ctx.arc(480, 96, 22, 0, Math.PI * 2);
    ctx.arc(506, 88, 18, 0, Math.PI * 2);
    ctx.arc(456, 88, 15, 0, Math.PI * 2);
    ctx.fill();
  }
  paintGround(ctx, '#1d2b1f', 440);

  // Bianglala: rangka + kabin
  ctx.strokeStyle = '#cfd6e4';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(300, 280, 150, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 4;
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI * 2 * i) / 8;
    ctx.beginPath();
    ctx.moveTo(300, 280);
    ctx.lineTo(300 + Math.cos(a) * 150, 280 + Math.sin(a) * 150);
    ctx.stroke();
  }
  ctx.fillStyle = '#8a93a6';
  ctx.beginPath();
  ctx.arc(300, 280, 14, 0, Math.PI * 2);
  ctx.fill();
  // Penyangga
  ctx.strokeStyle = '#5c6470';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(300, 280);
  ctx.lineTo(240, 470);
  ctx.moveTo(300, 280);
  ctx.lineTo(360, 470);
  ctx.stroke();
  // Kabin
  const cabinColors = ['#e2483d', '#ffd166', '#37b6a9', '#7b61c9', '#ef8354', '#7bd389', '#e2483d', '#ffd166'];
  for (let i = 0; i < 8; i++) {
    if (right && i === 5) continue; // satu kabin hilang di panel kanan
    const a = (Math.PI * 2 * i) / 8 - Math.PI / 2;
    const x = 300 + Math.cos(a) * 150;
    const y = 280 + Math.sin(a) * 150;
    let color = cabinColors[i];
    if (right && i === 0) color = '#37b6a9'; // kabin puncak berubah warna
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  // Lampu di rangka roda
  ctx.fillStyle = right ? '#37b6a9' : '#ffd166';
  ctx.beginPath();
  ctx.arc(396, 232, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.arc(204, 328, 8, 0, Math.PI * 2);
  ctx.arc(300, 130, 8, 0, Math.PI * 2);
  ctx.fill();

  // Tenda kiri
  ctx.fillStyle = '#c94f5e';
  ctx.beginPath();
  ctx.moveTo(60, 470);
  ctx.lineTo(150, 380);
  ctx.lineTo(240, 470);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f5e6c8';
  ctx.beginPath();
  if (right) {
    ctx.moveTo(110, 470);
    ctx.lineTo(150, 380);
    ctx.lineTo(190, 470);
  } else {
    ctx.moveTo(90, 470);
    ctx.lineTo(150, 380);
    ctx.lineTo(150, 470);
  }
  ctx.closePath();
  ctx.fill();
  // Bendera tenda
  if (!right) {
    ctx.strokeStyle = '#3a2a1a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(150, 380);
    ctx.lineTo(150, 352);
    ctx.stroke();
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.moveTo(150, 352);
    ctx.lineTo(178, 360);
    ctx.lineTo(150, 368);
    ctx.closePath();
    ctx.fill();
  }

  // Loket kanan
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(420, 420, 110, 70);
  ctx.fillStyle = '#b03a2e';
  ctx.fillRect(410, 406, 130, 16);
  ctx.fillStyle = right ? '#5d3413' : '#bfe3ff';
  ctx.fillRect(452, 438, 34, 28);
  ctx.fillStyle = '#f5e6c8';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TIKET', 475, 486);

  // Balon
  if (!right) {
    ctx.fillStyle = '#ef8354';
    ctx.beginPath();
    ctx.ellipse(540, 300, 14, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#3a2a1a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(540, 318);
    ctx.lineTo(540, 350);
    ctx.stroke();
  }
  // Lampu gantung di depan
  ctx.strokeStyle = '#2b2118';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(330, 440);
  ctx.lineTo(330, 462);
  ctx.stroke();
  ctx.fillStyle = right ? '#3a3a3a' : '#ffd166';
  ctx.beginPath();
  ctx.arc(330, 470, 8, 0, Math.PI * 2);
  ctx.fill();
}

// ---------------------------------------------------------------------------
// Level 3 — Panggung Dangdut
// ---------------------------------------------------------------------------
function paintPanggungDangdut(ctx, right) {
  paintSky(ctx, '#160b2e', '#3d1048');
  paintStar(ctx, 60, 70, 7, '#fff6c9');
  paintStar(ctx, 180, 50, 6, '#ffe9a8');
  paintStar(ctx, 420, 60, 6, '#fff6c9');
  if (!right) paintStar(ctx, 520, 80, 7, '#fff6c9');
  if (right) {
    // Kembang api hanya di panel kanan
    ctx.strokeStyle = '#ff8fab';
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI * 2 * i) / 8;
      ctx.beginPath();
      ctx.moveTo(540, 160);
      ctx.lineTo(540 + Math.cos(a) * 22, 160 + Math.sin(a) * 22);
      ctx.stroke();
    }
  }
  paintGround(ctx, '#1a1426', 450);

  // Bola disko
  ctx.strokeStyle = '#8a93a6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(300, 40);
  ctx.lineTo(300, 62);
  ctx.stroke();
  ctx.fillStyle = '#cfd6e4';
  ctx.beginPath();
  ctx.arc(300, 92, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8a93a6';
  ctx.beginPath();
  ctx.arc(300, 80, 8, 0, Math.PI * 2);
  ctx.arc(282, 100, 7, 0, Math.PI * 2);
  if (!right) ctx.arc(318, 100, 7, 0, Math.PI * 2);
  ctx.fill();

  // Banner
  ctx.fillStyle = '#ffd166';
  ctx.fillRect(180, 142, 240, 52);
  ctx.fillStyle = '#3d1048';
  ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(right ? 'DANGDOT' : 'DANGDUT', 300, 168);

  // Lampu sorot + sorotan cahaya ke panggung
  ctx.fillStyle = right ? '#3a3a3a' : '#ffe9a8';
  ctx.beginPath();
  ctx.arc(120, 250, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = right ? '#2e86ab' : '#ff5a5a';
  ctx.beginPath();
  ctx.arc(420, 250, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 233, 168, 0.10)';
  ctx.beginPath();
  ctx.moveTo(120, 250);
  ctx.lineTo(230, 330);
  ctx.lineTo(270, 330);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 90, 90, 0.10)';
  ctx.beginPath();
  ctx.moveTo(420, 250);
  ctx.lineTo(330, 330);
  ctx.lineTo(370, 330);
  ctx.closePath();
  ctx.fill();

  // Panggung
  ctx.fillStyle = '#4a2c6d';
  ctx.fillRect(90, 330, 420, 120);
  ctx.fillStyle = '#5b3a82';
  ctx.fillRect(90, 330, 420, 10);

  // Speaker kiri (tumpukan)
  ctx.fillStyle = '#3a3a52';
  ctx.fillRect(70, 380, 52, 44);
  ctx.fillRect(70, 424, 52, 26);
  if (!right) ctx.fillRect(70, 336, 52, 44);
  ctx.fillStyle = '#8a93a6';
  ctx.beginPath();
  ctx.arc(96, 402, 12, 0, Math.PI * 2);
  ctx.arc(96, 437, 8, 0, Math.PI * 2);
  if (!right) ctx.arc(96, 358, 12, 0, Math.PI * 2);
  ctx.fill();

  // Penyanyi + mikrofon
  ctx.fillStyle = '#f2c9a0';
  ctx.beginPath();
  ctx.arc(268, 268, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#e2483d';
  ctx.beginPath();
  ctx.moveTo(252, 284);
  ctx.lineTo(284, 284);
  ctx.lineTo(292, 330);
  ctx.lineTo(244, 330);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#2e2018';
  ctx.lineWidth = 4;
  ctx.save();
  ctx.translate(268, 300);
  if (right) ctx.rotate(0.5);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(14, -14);
  ctx.stroke();
  ctx.fillStyle = '#cfd6e4';
  ctx.beginPath();
  ctx.arc(16, -16, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Gitar di panggung
  if (!right) {
    ctx.fillStyle = '#a06a35';
    ctx.beginPath();
    ctx.ellipse(380, 330, 16, 20, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#5d3413';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(392, 316);
    ctx.lineTo(408, 296);
    ctx.stroke();
  }
  // Pemain keyboard di kanan panggung
  ctx.fillStyle = '#f2c9a0';
  ctx.beginPath();
  ctx.arc(452, 292, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#37b6a9';
  ctx.beginPath();
  ctx.moveTo(438, 306);
  ctx.lineTo(466, 306);
  ctx.lineTo(472, 330);
  ctx.lineTo(432, 330);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#22222e';
  ctx.fillRect(420, 330, 70, 12);
  ctx.fillStyle = '#f5e6c8';
  for (let k = 0; k < 8; k++) ctx.fillRect(424 + k * 8, 332, 4, 8);
  // Kabel menjuntai hanya di panel kanan
  if (right) {
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(480, 330);
    ctx.quadraticCurveTo(492, 370, 480, 400);
    ctx.stroke();
  }

  // Penonton
  const crowd = [
    { x: 120, y: 478, hat: '#37b6a9' },
    { x: 150, y: 470, hat: right ? '#e2483d' : '#ffd166' },
    { x: 210, y: 472, hat: '#7b61c9' },
    { x: 300, y: 478, hat: '#ef8354' },
    { x: 400, y: 470, hat: '#7bd389' },
    { x: 480, y: 478, hat: '#ff8fab' },
  ];
  for (const person of crowd) {
    ctx.fillStyle = '#2c2140';
    ctx.beginPath();
    ctx.arc(person.x, person.y + 26, 18, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#f2c9a0';
    ctx.beginPath();
    ctx.arc(person.x, person.y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = person.hat;
    ctx.beginPath();
    ctx.arc(person.x, person.y - 4, 14, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(person.x - 14, person.y - 6, 28, 5);
  }
  // Tangan penonton terangkat
  ctx.strokeStyle = '#f2c9a0';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(210, 440);
  if (!right) ctx.lineTo(210, 414);
  else ctx.lineTo(210, 440);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(400, 444);
  ctx.lineTo(400, 418);
  ctx.stroke();
}

// Dispatcher: gambar level ke ctx; right = true untuk panel kanan (varian).
function paintScene(ctx, levelIndex, right) {
  ctx.clearRect(0, 0, 600, 540);
  if (levelIndex === 0) paintGerobakSate(ctx, right);
  else if (levelIndex === 1) paintBianglala(ctx, right);
  else paintPanggungDangdut(ctx, right);
}
