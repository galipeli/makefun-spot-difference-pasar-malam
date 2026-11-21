// sounds.js — efek suara kecil via WebAudio (oscillator), tanpa file audio.
// Bunyi dibuat di tempat saat dibutuhkan; bila audio diblokir browser, diam saja.

'use strict';

let audioContext = null;

function getAudioContext() {
  if (!audioContext) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioCtx();
    } catch (e) {
      audioContext = null;
    }
  }
  return audioContext;
}

function playTone(frequency, durationMs, type, volume) {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    if (ctx.state === 'suspended') void ctx.resume();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type || 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.value = volume || 0.08;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + durationMs / 1000);
  } catch (e) {
    // Suara opsional: gagal main tidak boleh mengganggu permainan.
  }
}

function playSound(kind) {
  if (kind === 'find') {
    playTone(880, 120, 'sine', 0.1);
    setTimeout(() => playTone(1318, 160, 'sine', 0.08), 90);
  } else if (kind === 'miss') {
    playTone(160, 180, 'sawtooth', 0.05);
  } else if (kind === 'hint') {
    playTone(659, 200, 'triangle', 0.07);
  } else if (kind === 'win') {
    [523, 659, 784, 1046].forEach((freq, i) => setTimeout(() => playTone(freq, 220, 'sine', 0.09), i * 110));
  } else if (kind === 'lose') {
    [392, 330, 262].forEach((freq, i) => setTimeout(() => playTone(freq, 260, 'triangle', 0.07), i * 160));
  }
}
