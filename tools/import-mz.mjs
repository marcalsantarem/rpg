// Copia os gráficos usados do RPG Maker MZ para assets/mz/.
// Uso: npm run import-mz -- "C:\caminho\RPG Maker MZ"
// (os arquivos do MZ só podem ser usados com licença do RPG Maker; mantenha o repositório privado)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = process.argv[2] || 'C:\\Users\\marca\\Downloads\\RPG Maker MZ\\RPG Maker MZ';
const src = fs.existsSync(path.join(arg, 'newdata')) ? path.join(arg, 'newdata') : arg;
const img = path.join(src, 'img');
if (!fs.existsSync(img)) {
  console.error(`Pasta do MZ não encontrada: ${img}`);
  process.exit(1);
}
const out = path.join(root, 'assets', 'mz');
const notSF = (f) => !/SF_/.test(f);

const PLAN = {
  tilesets: (f) => notSF(f) && /^(Outside|Inside|Dungeon)_/.test(f),
  characters: notSF,
  sv_actors: notSF,
  enemies: notSF,
  faces: notSF,
  system: (f) => ['Window.png', 'IconSet.png', 'Shadow1.png', 'Balloon.png', 'States.png', 'Weapons1.png', 'Weapons2.png', 'Weapons3.png'].includes(f),
  titles1: (f) => ['Night.png', 'Town1.png', 'Gate.png', 'Sword.png', 'Bigtree.png', 'Mountain.png'].includes(f),
  battlebacks1: (f) => ['Grassland.png', 'GrassMaze.png', 'RockCave.png', 'Crystal.png', 'DirtCave.png', 'PoisonSwamp.png', 'Temple.png', 'DirtField.png'].includes(f),
  battlebacks2: (f) => ['Forest.png', 'GrassMaze.png', 'RockCave.png', 'Crystal.png', 'DirtCave.png', 'PoisonSwamp.png', 'Temple.png', 'Grassland.png'].includes(f),
};

let count = 0;
let bytes = 0;
const manifest = {};
for (const [dir, filter] of Object.entries(PLAN)) {
  const from = path.join(img, dir);
  const to = path.join(out, dir);
  fs.mkdirSync(to, { recursive: true });
  manifest[dir] = [];
  for (const f of fs.readdirSync(from).filter(filter)) {
    fs.copyFileSync(path.join(from, f), path.join(to, f));
    bytes += fs.statSync(path.join(to, f)).size;
    count++;
    if (f.endsWith('.png')) manifest[dir].push(f.replace(/\.png$/, ''));
  }
}
// extras: alguns inimigos do conjunto SF e dos DLCs que combinam com a fantasia medieval
const EXTRAS = [
  ['img/enemies/SF_Wolf.png', 'enemies'],
  ['img/enemies/SF_Shadow.png', 'enemies'],
  ['img/enemies/SF_Whitewolf.png', 'enemies'],
  ['../dlc/MV Trinity Resource Pack/enemies/Mandrake_mvt.png', 'enemies'],
  ['../dlc/MV Trinity Resource Pack/enemies/HauntedTree_mvt.png', 'enemies'],
];
for (const [rel, dir] of EXTRAS) {
  const from = path.join(src, rel);
  if (!fs.existsSync(from)) continue;
  fs.copyFileSync(from, path.join(out, dir, path.basename(from)));
  manifest[dir].push(path.basename(from, '.png'));
  count++;
}
fs.mkdirSync(path.join(out, 'fonts'), { recursive: true });
for (const f of ['mplus-1m-regular.woff', 'mplus-2p-bold-sub.woff']) {
  fs.copyFileSync(path.join(src, 'fonts', f), path.join(out, 'fonts', f));
  count++;
}
fs.writeFileSync(path.join(out, 'manifest.json'), JSON.stringify(manifest, null, 1));
console.log(`${count} arquivos copiados (${(bytes / 1048576).toFixed(1)} MB) para assets/mz/`);
