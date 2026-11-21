// main.ts — entrypoint program/v1 kompetisi best-spot-the-difference-game-20261121-0451.
// Menyalin game/ dan screenshots/ dari repositori ke direktori output, lalu menulis
// /output/dossier.json persis seperti yang ditulis buildDossier dari vendor/makefun-game.ts.
// Node 22, standard library saja, tanpa network. Di luar grader, MAKEFUN_OUTPUT_DIR
// menggantikan /output. Program ini deterministik: dua run menulis byte yang sama,
// jadi ringkasan di stdout pun sama di setiap run.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const REPO_ROOT = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR || '/output';

function copyTreeIntoOutput() {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  for (const name of ['game', 'screenshots']) {
    const source = join(REPO_ROOT, name);
    const target = join(OUTPUT_DIR, name);
    if (!existsSync(source)) {
      throw new Error('missing directory in repository: ' + name);
    }
    rmSync(target, { recursive: true, force: true });
    cpSync(source, target, { recursive: true });
  }
}

function countFiles(dir) {
  let files = 0;
  let bytes = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = countFiles(path);
      files += sub.files;
      bytes += sub.bytes;
    } else {
      files += 1;
      bytes += statSync(path).size;
    }
  }
  return { files, bytes };
}

function writeDossier() {
  const dossier = buildDossier(OUTPUT_DIR, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
  });
  writeFileSync(join(OUTPUT_DIR, 'dossier.json'), dossier);
  return dossier.length;
}

copyTreeIntoOutput();
const dossierBytes = writeDossier();
const game = countFiles(join(OUTPUT_DIR, 'game'));
const shots = countFiles(join(OUTPUT_DIR, 'screenshots'));
console.log(
  'Pasar Malam handed in: game/' + game.files + ' files (' + game.bytes + ' bytes), ' +
  'screenshots/' + shots.files + ' files (' + shots.bytes + ' bytes), ' +
  'dossier.json ' + dossierBytes + ' bytes.',
);
