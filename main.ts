// main.ts — hand-in program: copies the game + screenshots and builds the dossier.
import { buildDossier } from './vendor/makefun-game.ts';
import { existsSync, cpSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const gameDir = join(repoRoot, 'game');
const shotsDir = join(repoRoot, 'screenshots');

if (!existsSync(join(gameDir, 'index.html'))) {
  console.error('FATAL: game/index.html is missing — nothing to hand in.');
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
cpSync(gameDir, join(outputDir, 'game'), { recursive: true, force: true });
cpSync(shotsDir, join(outputDir, 'screenshots'), { recursive: true, force: true });

const dossier = await buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});

writeFileSync(join(outputDir, 'dossier.json'), dossier);
console.log(`dossier.json written: ${dossier.length} bytes (output: ${outputDir})`);
