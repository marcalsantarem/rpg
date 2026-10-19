// Valida mapas e referências de dados: `npm run check`
import { MAPS } from '../src/data/maps/index.js';
import { LEGEND } from '../src/data/maps/legend.js';
import { ITEMS } from '../src/data/items.js';
import { SKILLS } from '../src/data/skills.js';
import { HEROES } from '../src/data/heroes.js';
import { ENEMIES } from '../src/data/enemies.js';
import { SHOPS } from '../src/data/shops.js';
import { SONGS } from '../src/data/music.js';
import { SPRITES as MZ_SPRITES, mzFiles } from '../src/data/mzAssets.js';
import { GROUP_LEGEND, mapGroup } from '../src/art/mzTiles.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const errors = [];
const warn = [];
const err = (m) => errors.push(m);

const SPRITES = new Set(Object.keys(MZ_SPRITES));
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function solidAt(map, x, y) {
  const row = map.rows[y];
  if (!row || x < 0 || x >= row.length) return true;
  const L = LEGEND[row[x]];
  return !L || !!L.solid;
}

for (const [id, map] of Object.entries(MAPS)) {
  if (map.id !== id) err(`${id}: id interno "${map.id}" difere da chave`);
  const w = map.rows[0].length;
  map.rows.forEach((r, y) => {
    if (r.length !== w) err(`${id}: linha ${y} tem ${r.length} colunas (esperado ${w})`);
    for (const ch of r) if (!LEGEND[ch]) err(`${id}: caractere desconhecido "${ch}" na linha ${y}`);
  });
  const legend = GROUP_LEGEND[mapGroup(map)];
  for (const ch of new Set(map.rows.join(''))) if (!legend[ch]) warn.push(`${id}: caractere "${ch}" sem tile do MZ (usa o chão base)`);
  if (!SONGS[map.music]) err(`${id}: música "${map.music}" não existe`);
  if (map.encounters) {
    for (const g of map.encounters.groups) for (const e of g.e) if (!ENEMIES[e]) err(`${id}: inimigo "${e}" não existe`);
  }
  for (const ev of map.events ?? []) {
    const where = `${id}: evento ${ev.type}${ev.id ? ` "${ev.id}"` : ''} (${ev.x},${ev.y})`;
    if (ev.x !== undefined && (ev.x < 0 || ev.y < 0 || ev.y >= map.rows.length || ev.x >= w)) err(`${where} fora do mapa`);
    if (ev.type === 'warp') {
      const t = MAPS[ev.to];
      if (!t) err(`${where}: mapa destino "${ev.to}" não existe`);
      else if (solidAt(t, ev.tx, ev.ty)) err(`${where}: destino ${ev.to} (${ev.tx},${ev.ty}) é sólido`);
      if (solidAt(map, ev.x, ev.y)) warn.push(`${where}: warp sobre tile sólido`);
    }
    if (ev.type === 'npc' && !SPRITES.has(ev.sprite)) err(`${where}: sprite "${ev.sprite}" não existe`);
    if (ev.type === 'chest' && ev.item && !ITEMS[ev.item]) err(`${where}: item "${ev.item}" não existe`);
    if ((ev.type === 'npc' || ev.type === 'chest' || ev.type === 'save') && solidAt(map, ev.x, ev.y) && map.rows[ev.y][ev.x] !== 'N')
      warn.push(`${where}: sobre tile sólido`);
  }
}

// referências dentro dos scripts (busca textual)
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/data/maps');
for (const f of fs.readdirSync(dir)) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  for (const m of src.matchAll(/a\.battle\(\[([^\]]*)\]/g))
    for (const e of m[1].split(',').map((s) => s.trim().replace(/['"]/g, '')).filter(Boolean)) if (!ENEMIES[e]) err(`${f}: batalha com inimigo "${e}" inexistente`);
  for (const m of src.matchAll(/a\.give\('([^']+)'/g)) if (!ITEMS[m[1]]) err(`${f}: give de item "${m[1]}" inexistente`);
  for (const m of src.matchAll(/a\.shop\('([^']+)'/g)) if (!SHOPS[m[1]]) err(`${f}: loja "${m[1]}" inexistente`);
  for (const m of src.matchAll(/a\.join\('([^']+)'/g)) if (!HEROES[m[1]]) err(`${f}: herói "${m[1]}" inexistente`);
  for (const m of src.matchAll(/a\.warp\('([^']+)'/g)) if (!MAPS[m[1]]) err(`${f}: warp para mapa "${m[1]}" inexistente`);
  for (const m of src.matchAll(/a\.music\('([^']+)'/g)) if (!SONGS[m[1]]) err(`${f}: música "${m[1]}" inexistente`);
  for (const m of src.matchAll(/a\.spawn\('[^']+', '([^']+)'/g))
    if (!SPRITES.has(m[1]) && !['shade'].includes(m[1])) err(`${f}: spawn de sprite "${m[1]}" inexistente`);
  for (const m of src.matchAll(/music: '([^']+)'/g)) if (!SONGS[m[1]]) err(`${f}: música "${m[1]}" inexistente`);
}

for (const [id, h] of Object.entries(HEROES)) {
  for (const [, s] of h.skills) if (!SKILLS[s]) err(`herói ${id}: habilidade "${s}" não existe`);
  for (const it of Object.values(h.equip)) if (it && !ITEMS[it]) err(`herói ${id}: equipamento "${it}" não existe`);
  if (!SPRITES.has(h.sprite)) err(`herói ${id}: sprite "${h.sprite}" não existe`);
}
for (const [id, e] of Object.entries(ENEMIES)) {
  if (!e.mz) err(`inimigo ${id}: sem arte do MZ (campo mz)`);
  for (const [s] of e.actions ?? []) if (!SKILLS[s]) err(`inimigo ${id}: ação "${s}" não existe`);
  for (const [it] of e.drops ?? []) if (!ITEMS[it]) err(`inimigo ${id}: drop "${it}" não existe`);
  if (e.steal && !ITEMS[e.steal]) err(`inimigo ${id}: roubo "${e.steal}" não existe`);
  if (e.ai) {
    const src = e.ai.toString();
    for (const m of src.matchAll(/'([a-z_]+)'/g)) if (!SKILLS[m[1]]) err(`inimigo ${id}: IA usa "${m[1]}" inexistente`);
  }
}
for (const [id, s] of Object.entries(SHOPS)) for (const it of s.stock) if (!ITEMS[it]) err(`loja ${id}: item "${it}" não existe`);

// arquivos do RPG Maker MZ referenciados precisam existir em assets/mz
for (const f of mzFiles(Object.values(ENEMIES).map((e) => e.mz).filter(Boolean)))
  if (!fs.existsSync(path.join(ROOT, decodeURIComponent(f.path)))) err(`arquivo do MZ ausente: ${decodeURIComponent(f.path)} (rode npm run import-mz)`);
for (const w of warn) console.warn('aviso:', w);
if (errors.length) {
  for (const e of errors) console.error('ERRO:', e);
  console.error(`\n${errors.length} erro(s).`);
  process.exit(1);
}
console.log(`OK — ${Object.keys(MAPS).length} mapas, ${Object.keys(ENEMIES).length} inimigos, ${Object.keys(ITEMS).length} itens, ${Object.keys(SKILLS).length} habilidades verificados.`);
